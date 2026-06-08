import { randomBytes } from "crypto";
import { mkdir, writeFile } from "fs/promises";
import path from "path";
import sharp from "sharp";
import { sendApplicationEmails } from "@/lib/email";
import { databaseUnavailableMessage, isDatabaseConfigured, prisma } from "@/lib/prisma";
import { jsonError, logProductionError, withTimeout } from "@/lib/runtime";

const requiredFields = [
  "fullName",
  "phone",
  "email",
  "destinationCountry",
  "purposeOfTravel",
  "travelPurpose",
  "message",
] as const;

const maxFileSize = 15 * 1024 * 1024;
const maxImageDimension = 1600;

const allowedMimeTypes = new Set([
  "application/pdf",
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/heic",
  "image/heif",
  "image/heic-sequence",
  "image/heif-sequence",
]);
const allowedExtensions = new Set([".pdf", ".jpg", ".jpeg", ".png", ".webp", ".heic", ".heif"]);
const imageExtensions = new Set([".jpg", ".jpeg", ".png", ".webp", ".heic", ".heif"]);

const uploadFields = [
  {
    formName: "passportUpload",
    label: "Passport Upload",
    legacyPathField: "passportUploadPath",
    originalPathField: "passportUploadOriginalPath",
    optimizedPathField: "passportUploadOptimizedPath",
    originalSizeField: "passportUploadOriginalSize",
    optimizedSizeField: "passportUploadOptimizedSize",
  },
  {
    formName: "passportPhoto",
    label: "Passport Photograph",
    legacyPathField: "passportPhotoPath",
    originalPathField: "passportPhotoOriginalPath",
    optimizedPathField: "passportPhotoOptimizedPath",
    originalSizeField: "passportPhotoOriginalSize",
    optimizedSizeField: "passportPhotoOptimizedSize",
  },
  {
    formName: "bankStatement",
    label: "Bank Statement",
    legacyPathField: "bankStatementPath",
    originalPathField: "bankStatementOriginalPath",
    optimizedPathField: "bankStatementOptimizedPath",
    originalSizeField: "bankStatementOriginalSize",
    optimizedSizeField: "bankStatementOptimizedSize",
  },
  {
    formName: "supportingDocument",
    label: "Additional Supporting Document",
    legacyPathField: "supportingDocPath",
    originalPathField: "supportingDocOriginalPath",
    optimizedPathField: "supportingDocOptimizedPath",
    originalSizeField: "supportingDocOriginalSize",
    optimizedSizeField: "supportingDocOptimizedSize",
  },
] as const;

class UploadError extends Error {}

function generateTrackingCode() {
  const letters = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  const bytes = randomBytes(5);
  const suffix = Array.from(bytes, (byte) => letters[byte % letters.length]).join("");

  return `GFG-${new Date().getFullYear()}-${suffix}`;
}

async function generateUniqueTrackingCode() {
  for (let attempt = 0; attempt < 8; attempt += 1) {
    const trackingCode = generateTrackingCode();
    const existing = await prisma.application.findUnique({
      where: { trackingCode },
      select: { id: true },
    });

    if (!existing) {
      return trackingCode;
    }
  }

  throw new Error("Unable to generate tracking code.");
}

function getFileExtension(file: File) {
  return path.extname(file.name).toLowerCase();
}

function getSafeFileName(trackingCode: string, fieldName: string, variant: string, extension: string) {
  return `${trackingCode}-${fieldName}-${variant}-${randomBytes(5).toString("hex")}${extension}`;
}

function hasValidSignature(buffer: Buffer, extension: string) {
  if (extension === ".pdf") {
    return buffer[0] === 0x25 && buffer[1] === 0x50 && buffer[2] === 0x44 && buffer[3] === 0x46;
  }

  if (extension === ".jpg" || extension === ".jpeg") {
    return buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff;
  }

  if (extension === ".png") {
    return (
      buffer[0] === 0x89 &&
      buffer[1] === 0x50 &&
      buffer[2] === 0x4e &&
      buffer[3] === 0x47 &&
      buffer[4] === 0x0d &&
      buffer[5] === 0x0a &&
      buffer[6] === 0x1a &&
      buffer[7] === 0x0a
    );
  }

  if (extension === ".webp") {
    return buffer.subarray(0, 4).toString("ascii") === "RIFF" && buffer.subarray(8, 12).toString("ascii") === "WEBP";
  }

  if (extension === ".heic" || extension === ".heif") {
    const brand = buffer.subarray(8, 12).toString("ascii");
    return (
      buffer.subarray(4, 8).toString("ascii") === "ftyp" &&
      ["heic", "heix", "hevc", "hevx", "heif", "mif1", "msf1"].includes(brand)
    );
  }

  return false;
}

function validateUpload(file: File, buffer: Buffer, label: string) {
  if (file.size > maxFileSize) {
    throw new UploadError(`${label} must be 15MB or smaller before optimization.`);
  }

  const extension = getFileExtension(file);

  if (!allowedMimeTypes.has(file.type) || !allowedExtensions.has(extension)) {
    throw new UploadError(`${label} must be a PDF, JPG, JPEG, PNG, WEBP, or supported HEIC file.`);
  }

  if (!hasValidSignature(buffer, extension)) {
    throw new UploadError(`${label} file contents do not match a supported document or image type.`);
  }

  return extension;
}

async function saveBuffer(buffer: Buffer, safeName: string) {
  const uploadDir = process.env.UPLOAD_DIR
    ? path.resolve(process.env.UPLOAD_DIR)
    : path.join(process.cwd(), "public", "uploads");
  const publicPath = process.env.UPLOAD_PUBLIC_PATH || "/uploads";

  await mkdir(uploadDir, { recursive: true });
  await writeFile(path.join(uploadDir, safeName), buffer);

  return `${publicPath.replace(/\/$/, "")}/${safeName}`;
}

async function optimizeImage(buffer: Buffer, label: string) {
  try {
    return await sharp(buffer, { failOn: "error" })
      .rotate()
      .resize({
        width: maxImageDimension,
        height: maxImageDimension,
        fit: "inside",
        withoutEnlargement: true,
      })
      .jpeg({ quality: 78, mozjpeg: true })
      .toBuffer();
  } catch {
    throw new UploadError(
      `${label} could not be optimized safely. Please upload PDF, JPG, JPEG, PNG, WEBP, or a supported HEIC image.`
    );
  }
}

async function processUpload(
  file: File,
  trackingCode: string,
  uploadField: (typeof uploadFields)[number]
) {
  const originalBuffer = Buffer.from(await file.arrayBuffer());
  const extension = validateUpload(file, originalBuffer, uploadField.label);
  const originalName = getSafeFileName(trackingCode, uploadField.formName, "original", extension);
  const originalPath = await saveBuffer(originalBuffer, originalName);

  if (extension === ".pdf") {
    return {
      originalPath,
      optimizedPath: originalPath,
      originalSize: originalBuffer.length,
      optimizedSize: originalBuffer.length,
    };
  }

  if (!imageExtensions.has(extension)) {
    throw new UploadError(`${uploadField.label} is not a supported optimizable image.`);
  }

  const optimizedBuffer = await optimizeImage(originalBuffer, uploadField.label);
  const optimizedName = getSafeFileName(trackingCode, uploadField.formName, "optimized", ".jpg");
  const optimizedPath = await saveBuffer(optimizedBuffer, optimizedName);

  return {
    originalPath,
    optimizedPath,
    originalSize: originalBuffer.length,
    optimizedSize: optimizedBuffer.length,
  };
}

async function parseApplicationRequest(request: Request) {
  const contentType = request.headers.get("content-type") ?? "";

  if (contentType.includes("multipart/form-data")) {
    const formData = await request.formData();
    const fields = Object.fromEntries(
      requiredFields.map((field) => [field, String(formData.get(field) ?? "")])
    ) as Record<(typeof requiredFields)[number], string>;

    return { fields, formData };
  }

  const body = await request.json();
  const fields = Object.fromEntries(
    requiredFields.map((field) => [field, String(body[field] ?? "")])
  ) as Record<(typeof requiredFields)[number], string>;

  return { fields, formData: null };
}

export async function POST(request: Request) {
  try {
    if (!isDatabaseConfigured()) {
      return jsonError(databaseUnavailableMessage, 503);
    }

    const { fields, formData } = await parseApplicationRequest(request);

    for (const field of requiredFields) {
      if (fields[field].trim().length === 0) {
        return jsonError("Please complete all required fields.", 400);
      }
    }

    const trackingCode = await generateUniqueTrackingCode();
    const uploadData: Record<string, string | number | null> = {};

    for (const uploadField of uploadFields) {
      uploadData[uploadField.legacyPathField] = null;
      uploadData[uploadField.originalPathField] = null;
      uploadData[uploadField.optimizedPathField] = null;
      uploadData[uploadField.originalSizeField] = null;
      uploadData[uploadField.optimizedSizeField] = null;
    }

    if (formData) {
      for (const uploadField of uploadFields) {
        const file = formData.get(uploadField.formName);

        if (!(file instanceof File) || file.size === 0) {
          continue;
        }

        const processed = await processUpload(file, trackingCode, uploadField);
        uploadData[uploadField.legacyPathField] = processed.optimizedPath;
        uploadData[uploadField.originalPathField] = processed.originalPath;
        uploadData[uploadField.optimizedPathField] = processed.optimizedPath;
        uploadData[uploadField.originalSizeField] = processed.originalSize;
        uploadData[uploadField.optimizedSizeField] = processed.optimizedSize;
      }
    }

    const application = await prisma.application.create({
      data: {
        fullName: fields.fullName.trim(),
        phone: fields.phone.trim(),
        email: fields.email.trim(),
        destinationCountry: fields.destinationCountry.trim(),
        purposeOfTravel: fields.purposeOfTravel.trim(),
        travelPurpose: fields.travelPurpose.trim(),
        message: fields.message.trim(),
        trackingCode,
        ...uploadData,
      },
    });

    try {
      await withTimeout(
        sendApplicationEmails({
          fullName: application.fullName,
          email: application.email,
          destinationCountry: application.destinationCountry,
          status: application.status,
          trackingCode: application.trackingCode,
        }),
        8000,
        "Application email notification"
      );
    } catch (emailError) {
      logProductionError("Application email notification failed or timed out", emailError);
    }

    return Response.json({ success: true, application }, { status: 201 });
  } catch (error) {
    if (error instanceof UploadError) {
      return jsonError(error.message, 400);
    }

    logProductionError("Application submission failed", error);
    return jsonError("Something went wrong while saving your application. Please try again.", 500);
  }
}

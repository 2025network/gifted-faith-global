import { randomBytes } from "crypto";
import { mkdir, writeFile } from "fs/promises";
import { NextResponse } from "next/server";
import path from "path";
import { sendApplicationEmails } from "@/lib/email";
import { prisma } from "@/lib/prisma";

const requiredFields = [
  "fullName",
  "phone",
  "email",
  "destinationCountry",
  "travelPurpose",
  "message",
] as const;

const maxFileSize = 5 * 1024 * 1024;
const allowedMimeTypes = new Set(["application/pdf", "image/jpeg", "image/png"]);
const allowedExtensions = new Set([".pdf", ".jpg", ".jpeg", ".png"]);

const uploadFields = [
  {
    formName: "passportUpload",
    dbName: "passportUploadPath",
    label: "Passport Upload",
  },
  {
    formName: "passportPhoto",
    dbName: "passportPhotoPath",
    label: "Passport Photograph",
  },
  {
    formName: "bankStatement",
    dbName: "bankStatementPath",
    label: "Bank Statement",
  },
  {
    formName: "supportingDocument",
    dbName: "supportingDocPath",
    label: "Additional Supporting Document",
  },
] as const;

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

async function hasValidSignature(file: File) {
  const bytes = new Uint8Array(await file.slice(0, 8).arrayBuffer());
  const extension = getFileExtension(file);

  if (extension === ".pdf") {
    return bytes[0] === 0x25 && bytes[1] === 0x50 && bytes[2] === 0x44 && bytes[3] === 0x46;
  }

  if (extension === ".jpg" || extension === ".jpeg") {
    return bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff;
  }

  if (extension === ".png") {
    return (
      bytes[0] === 0x89 &&
      bytes[1] === 0x50 &&
      bytes[2] === 0x4e &&
      bytes[3] === 0x47 &&
      bytes[4] === 0x0d &&
      bytes[5] === 0x0a &&
      bytes[6] === 0x1a &&
      bytes[7] === 0x0a
    );
  }

  return false;
}

async function validateUpload(file: File, label: string) {
  if (file.size > maxFileSize) {
    return `${label} must be 5MB or smaller.`;
  }

  const extension = getFileExtension(file);

  if (!allowedMimeTypes.has(file.type) || !allowedExtensions.has(extension)) {
    return `${label} must be a PDF, JPG, JPEG, or PNG file.`;
  }

  if (!(await hasValidSignature(file))) {
    return `${label} file contents do not match a supported PDF, JPG, JPEG, or PNG file.`;
  }

  return "";
}

async function saveUpload(file: File, trackingCode: string, fieldName: string) {
  const extension = getFileExtension(file);
  const safeName = `${trackingCode}-${fieldName}-${randomBytes(4).toString("hex")}${extension}`;
  const uploadDir = path.join(process.cwd(), "public", "uploads");
  const filePath = path.join(uploadDir, safeName);

  await mkdir(uploadDir, { recursive: true });
  await writeFile(filePath, Buffer.from(await file.arrayBuffer()));

  return `/uploads/${safeName}`;
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
    const { fields, formData } = await parseApplicationRequest(request);

    for (const field of requiredFields) {
      if (fields[field].trim().length === 0) {
        return NextResponse.json(
          { error: "Please complete all required fields." },
          { status: 400 }
        );
      }
    }

    const trackingCode = await generateUniqueTrackingCode();
    const uploadPaths: Record<string, string | null> = {
      passportUploadPath: null,
      passportPhotoPath: null,
      bankStatementPath: null,
      supportingDocPath: null,
    };

    if (formData) {
      for (const uploadField of uploadFields) {
        const file = formData.get(uploadField.formName);

        if (!(file instanceof File) || file.size === 0) {
          continue;
        }

        const validationError = await validateUpload(file, uploadField.label);

        if (validationError) {
          return NextResponse.json({ error: validationError }, { status: 400 });
        }

        uploadPaths[uploadField.dbName] = await saveUpload(
          file,
          trackingCode,
          uploadField.formName
        );
      }
    }

    const application = await prisma.application.create({
      data: {
        fullName: fields.fullName.trim(),
        phone: fields.phone.trim(),
        email: fields.email.trim(),
        destinationCountry: fields.destinationCountry.trim(),
        travelPurpose: fields.travelPurpose.trim(),
        message: fields.message.trim(),
        trackingCode,
        passportUploadPath: uploadPaths.passportUploadPath,
        passportPhotoPath: uploadPaths.passportPhotoPath,
        bankStatementPath: uploadPaths.bankStatementPath,
        supportingDocPath: uploadPaths.supportingDocPath,
      },
    });

    await sendApplicationEmails({
      fullName: application.fullName,
      email: application.email,
      destinationCountry: application.destinationCountry,
      status: application.status,
      trackingCode: application.trackingCode,
      trackingUrl: `${new URL(request.url).origin}/track-application?code=${encodeURIComponent(
        application.trackingCode
      )}`,
    });

    return NextResponse.json({ application }, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Something went wrong while saving your application." },
      { status: 500 }
    );
  }
}

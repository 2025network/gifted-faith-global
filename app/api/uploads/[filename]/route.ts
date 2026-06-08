import { readFile } from "fs/promises";
import { NextResponse } from "next/server";
import path from "path";
import { logProductionError } from "@/lib/runtime";

const contentTypes: Record<string, string> = {
  ".pdf": "application/pdf",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
  ".heic": "image/heic",
  ".heif": "image/heif",
};

function getUploadDir() {
  return process.env.UPLOAD_DIR
    ? path.resolve(process.env.UPLOAD_DIR)
    : path.join(process.cwd(), "public", "uploads");
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ filename: string }> }
) {
  try {
    const { filename } = await params;

    if (!/^[A-Za-z0-9._-]+$/.test(filename)) {
      return NextResponse.json({ success: false, error: "Invalid file name." }, { status: 400 });
    }

    const uploadDir = getUploadDir();
    const filePath = path.resolve(uploadDir, filename);

    if (!filePath.startsWith(uploadDir + path.sep)) {
      return NextResponse.json({ success: false, error: "Invalid file path." }, { status: 400 });
    }

    const file = await readFile(filePath);
    const extension = path.extname(filename).toLowerCase();

    return new NextResponse(file, {
      headers: {
        "Content-Type": contentTypes[extension] ?? "application/octet-stream",
        "Cache-Control": "private, max-age=3600",
      },
    });
  } catch (error) {
    logProductionError("Upload file read failed", error);
    return NextResponse.json({ success: false, error: "File not found." }, { status: 404 });
  }
}

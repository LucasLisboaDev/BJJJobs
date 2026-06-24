import { mkdir, writeFile } from "fs/promises";
import path from "path";

const ALLOWED_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);
const MAX_SIZE = 2 * 1024 * 1024; // 2 MB

export function validateImageFile(file: File) {
  if (!ALLOWED_TYPES.has(file.type)) {
    return "Only JPG, PNG, or WebP images are allowed";
  }
  if (file.size > MAX_SIZE) {
    return "Image must be under 2 MB";
  }
  return null;
}

export async function saveUploadedImage(
  file: File,
  userId: string,
  subdir: "photos" | "logos"
): Promise<string> {
  const error = validateImageFile(file);
  if (error) throw new Error(error);

  const uploadsDir = path.join(process.cwd(), "public", "uploads", subdir);
  await mkdir(uploadsDir, { recursive: true });

  const ext = file.type === "image/png" ? "png" : file.type === "image/webp" ? "webp" : "jpg";
  const filename = `${userId}-${Date.now()}.${ext}`;
  const filepath = path.join(uploadsDir, filename);

  const buffer = Buffer.from(await file.arrayBuffer());
  await writeFile(filepath, buffer);

  return `/uploads/${subdir}/${filename}`;
}

import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { saveUploadedImage, validateImageFile } from "@/lib/upload-image";

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const formData = await req.formData();
    const file = formData.get("logo") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const validationError = validateImageFile(file);
    if (validationError) {
      return NextResponse.json({ error: validationError }, { status: 400 });
    }

    const logoUrl = await saveUploadedImage(file, userId, "logos");
    return NextResponse.json({ logoUrl });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to upload logo" }, { status: 500 });
  }
}

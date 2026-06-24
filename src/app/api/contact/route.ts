import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { sendContactFormEmail } from "@/lib/email/send";

const contactSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  message: z
    .string()
    .min(10, "Message must be at least 10 characters")
    .max(5000, "Message must be under 5000 characters"),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, message } = contactSchema.parse(body);

    await sendContactFormEmail({ email, message });

    return NextResponse.json({ ok: true });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json(
        { error: err.errors[0]?.message ?? "Invalid input" },
        { status: 400 }
      );
    }

    if (err instanceof Error && err.message === "Email service not configured") {
      return NextResponse.json(
        { error: "Contact form is temporarily unavailable. Please try again later." },
        { status: 503 }
      );
    }

    console.error(err);
    return NextResponse.json({ error: "Failed to send message. Please try again." }, { status: 500 });
  }
}

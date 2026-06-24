import type { Metadata } from "next";
import ContactContent from "@/components/contact-content";

export const metadata: Metadata = {
  title: "Contact us — JiuJitsuJobs",
  description: "Get in touch with the JiuJitsuJobs team.",
};

export default function ContactPage() {
  return <ContactContent />;
}

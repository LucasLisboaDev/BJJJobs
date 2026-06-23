import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { Providers } from "@/components/providers";
import { APP_NAME } from "@/lib/brand";
import "./globals.css";

export const metadata: Metadata = {
  title: `${APP_NAME} — The #1 Job Board for BJJ Coaches`,
  description: "Find coaching jobs at top Brazilian jiu-jitsu gyms, or post a role and find your next instructor.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning data-theme="light">
        <body>
          <Providers>{children}</Providers>
        </body>
      </html>
    </ClerkProvider>
  );
}

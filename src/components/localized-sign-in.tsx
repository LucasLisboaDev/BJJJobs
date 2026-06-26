"use client";

import type { ComponentProps } from "react";
import { SignIn } from "@clerk/nextjs";
import { useLanguage } from "@/components/language-provider";
import { getClerkLocalization } from "@/lib/clerk-localization";

export function LocalizedSignIn(props: ComponentProps<typeof SignIn>) {
  const { locale } = useLanguage();

  return <SignIn {...props} localization={getClerkLocalization(locale)} />;
}

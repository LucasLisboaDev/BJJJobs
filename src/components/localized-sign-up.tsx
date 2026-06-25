"use client";

import { SignUp } from "@clerk/nextjs";
import { ptBR } from "@clerk/localizations";
import { useLanguage } from "@/components/language-provider";

export function LocalizedSignUp(props: React.ComponentProps<typeof SignUp>) {
  const { locale } = useLanguage();

  return <SignUp {...props} localization={locale === "pt-BR" ? ptBR : undefined} />;
}

"use client";

import type { ComponentProps } from "react";
import { SignIn } from "@clerk/nextjs";

export function LocalizedSignIn(props: ComponentProps<typeof SignIn>) {
  return <SignIn {...props} />;
}

"use client";

import { useEffect, useRef, type ComponentProps } from "react";
import { SignUp } from "@clerk/nextjs";

const HIDE_NAME_FIELD_ELEMENTS = {
  formFieldRow__firstName: { display: "none" },
  formFieldRow__lastName: { display: "none" },
  formFieldRow__name: { display: "none" },
  formField__firstName: { display: "none" },
  formField__lastName: { display: "none" },
  formFieldInput__firstName: { display: "none" },
  formFieldInput__lastName: { display: "none" },
  formFieldLabel__firstName: { display: "none" },
  formFieldLabel__lastName: { display: "none" },
} as const;

const NAME_INPUT_SELECTORS = [
  'input[name="firstName"]',
  'input[name="lastName"]',
  'input[name="first_name"]',
  'input[name="last_name"]',
  'input[autocomplete="given-name"]',
  'input[autocomplete="family-name"]',
].join(",");

const NAME_LABEL_PATTERNS = [
  /^first name/i,
  /^last name/i,
  /^nome\b/i,
  /^sobrenome/i,
  /^primeiro nome/i,
  /^último nome/i,
  /^ultimo nome/i,
];

function hideNameFieldRows(container: ParentNode) {
  container.querySelectorAll(NAME_INPUT_SELECTORS).forEach((input) => {
    const row =
      input.closest(".cl-formFieldRow") ??
      input.closest(".cl-formField") ??
      input.closest('[class*="formFieldRow"]') ??
      input.parentElement?.parentElement;

    if (row instanceof HTMLElement) {
      row.style.display = "none";
    }
  });

  container.querySelectorAll("label").forEach((label) => {
    const text = label.textContent?.replace(/\s+/g, " ").trim() ?? "";
    if (!NAME_LABEL_PATTERNS.some((pattern) => pattern.test(text))) return;

    const row =
      label.closest(".cl-formFieldRow") ??
      label.closest(".cl-formField") ??
      label.closest('[class*="formFieldRow"]') ??
      label.parentElement?.parentElement;

    if (row instanceof HTMLElement) {
      row.style.display = "none";
    }
  });
}

function useHideClerkNameFields(enabled: boolean) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!enabled) return;

    const container = containerRef.current;
    if (!container) return;

    hideNameFieldRows(container);

    const observer = new MutationObserver(() => hideNameFieldRows(container));
    observer.observe(container, { childList: true, subtree: true });

    return () => observer.disconnect();
  }, [enabled]);

  return containerRef;
}

function buildEmailOnlyAppearance(
  appearance: ComponentProps<typeof SignUp>["appearance"]
): ComponentProps<typeof SignUp>["appearance"] {
  const themed = appearance as
    | (NonNullable<ComponentProps<typeof SignUp>["appearance"]> & {
        signUp?: { elements?: Record<string, unknown> };
        elements?: Record<string, unknown>;
      })
    | undefined;

  return {
    ...themed,
    signUp: {
      ...themed?.signUp,
      elements: {
        ...themed?.signUp?.elements,
        ...HIDE_NAME_FIELD_ELEMENTS,
      },
    },
    elements: {
      ...themed?.elements,
      ...HIDE_NAME_FIELD_ELEMENTS,
    },
  } as ComponentProps<typeof SignUp>["appearance"];
}

export function LocalizedSignUp({
  emailOnly = true,
  appearance,
  ...props
}: ComponentProps<typeof SignUp> & { emailOnly?: boolean }) {
  const containerRef = useHideClerkNameFields(emailOnly);

  const signUp = (
    <SignUp
      {...props}
      appearance={emailOnly ? buildEmailOnlyAppearance(appearance) : appearance}
    />
  );

  if (!emailOnly) return signUp;

  return (
    <div ref={containerRef} className="email-only-signup w-full">
      {signUp}
    </div>
  );
}

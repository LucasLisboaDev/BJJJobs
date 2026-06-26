/** True when CI uses placeholder Clerk keys — public E2E smoke runs without a Clerk instance. */
export function isClerkE2eBypassEnabled() {
  return (
    process.env.CLERK_E2E_BYPASS === "1" ||
    process.env.NEXT_PUBLIC_CLERK_E2E_BYPASS === "1" ||
    process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY === "pk_test_ci_placeholder" ||
    process.env.CLERK_SECRET_KEY === "sk_test_ci_placeholder"
  );
}

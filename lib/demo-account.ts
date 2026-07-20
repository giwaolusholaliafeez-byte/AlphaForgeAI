export const DEMO_ACCOUNT_EMAIL = "demo@alphaforge.ai";

export function isDemoAccount(email: string | null | undefined): boolean {
  if (!email) return false;
  return email.toLowerCase().trim() === DEMO_ACCOUNT_EMAIL.toLowerCase().trim();
}

export function getDemoUserInfo() {
  return {
    fullName: "Demo Investor",
    email: DEMO_ACCOUNT_EMAIL,
  };
}

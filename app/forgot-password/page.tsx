import type { Metadata } from "next";
import ForgotPasswordContent from "./ForgotPasswordContent";

export const metadata: Metadata = {
  title: "Reset your password | AlphaForge AI",
  description: "Request a password reset link for your AlphaForge AI account.",
};

export default function ForgotPasswordPage() {
  return <ForgotPasswordContent />;
}

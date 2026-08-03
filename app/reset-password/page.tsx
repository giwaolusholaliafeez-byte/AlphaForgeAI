import type { Metadata } from "next";
import ResetPasswordContent from "./ResetPasswordContent";

export const metadata: Metadata = {
  title: "Set a new password | AlphaForge AI",
  description: "Choose a new password for your AlphaForge AI account.",
};

export default function ResetPasswordPage() {
  return <ResetPasswordContent />;
}

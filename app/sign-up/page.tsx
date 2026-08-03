import type { Metadata } from "next";
import SignUpContent from "./SignUpContent";

export const metadata: Metadata = {
  title: "Create your account | AlphaForge AI",
  description: "Start your financial intelligence journey with AlphaForge AI — live markets, AI research, and portfolio monitoring in one workspace.",
};

export default function SignUpPage() {
  return <SignUpContent />;
}

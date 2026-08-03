import type { Metadata } from "next";
import { Suspense } from "react";
import SignInContent from "./SignInContent";

export const metadata: Metadata = {
  title: "Sign in | AlphaForge AI",
  description: "Sign in to your AlphaForge AI workspace to access live markets, AI research, and portfolio monitoring.",
};

function SignInLoading() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#0B0F1A] text-white">
      <p className="text-[#A1A7B3]">Loading sign in...</p>
    </main>
  );
}

export default function SignInPage() {
  return (
    <Suspense fallback={<SignInLoading />}>
      <SignInContent />
    </Suspense>
  );
}

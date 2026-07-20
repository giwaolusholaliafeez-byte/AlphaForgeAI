import { Suspense } from "react";
import SignInContent from "./SignInContent";

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

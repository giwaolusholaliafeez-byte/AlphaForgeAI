import Link from "next/link";
import Image from "next/image";
import { ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-[#0B0F1A] p-6 text-center text-white">
      <Image
        src="/alphaforge-icon.png"
        alt="AlphaForge AI logo"
        width={40}
        height={40}
        className="h-10 w-auto mb-6"
      />
      <p className="text-xs uppercase tracking-[0.2em] text-[#00C2A8]">404</p>
      <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">Page not found</h1>
      <p className="mt-4 max-w-md text-[#A1A7B3]">
        The page you're looking for doesn't exist or may have been moved.
      </p>
      <Link
        href="/"
        className="mt-8 inline-flex items-center text-sm text-[#60A5FA] transition-colors hover:underline"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Home
      </Link>
    </main>
  );
}

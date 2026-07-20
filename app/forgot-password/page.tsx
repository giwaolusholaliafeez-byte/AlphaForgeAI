"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Mail } from "lucide-react";
import { requestPasswordReset } from "@/app/auth/actions";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const formData = new FormData();
    formData.append("email", email);

    const result = await requestPasswordReset(formData);

    if (result.error) {
      setError(result.error);
      setLoading(false);
      return;
    }

    if (result.success) {
      setSuccess(true);
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-[#0B0F1A] flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <Card className="bg-[#1E293B] border-[#1E293B]">
            <CardHeader className="space-y-4">
              <div className="flex items-center justify-center space-x-3">
                <Image
                  src="/alphaforge-icon.png"
                  alt="AlphaForge AI logo"
                  width={40}
                  height={40}
                  className="h-10 w-auto"
                />
                <span className="text-2xl font-bold">
                  <span className="text-white">ALPHA</span>
                  <span className="text-[#F4B000]">FORGE</span>
                  <span className="text-[#00C2A8]">AI</span>
                </span>
              </div>
              <CardTitle className="text-2xl font-bold text-center text-white">
                Check your email
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <div className="p-4 rounded-lg bg-[#00C2A8]/10 border border-[#00C2A8]/20">
                <p className="text-sm text-[#00C2A8]">
                  If an account exists with this email, you'll receive a password reset link.
                </p>
              </div>
              <Link href="/sign-in">
                <Button className="w-full mt-4 bg-[#2563EB] hover:bg-[#2563EB]/90 text-white">
                  Back to Sign In
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0B0F1A] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Link 
          href="/sign-in" 
          className="inline-flex items-center text-[#A1A7B3] hover:text-white transition-colors mb-6 text-sm"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Sign In
        </Link>

        <Card className="bg-[#1E293B] border-[#1E293B]">
          <CardHeader className="space-y-4">
            <div className="flex items-center justify-center space-x-3">
              <Image
                src="/alphaforge-icon.png"
                alt="AlphaForge AI logo"
                width={40}
                height={40}
                className="h-10 w-auto"
              />
              <span className="text-2xl font-bold">
                <span className="text-white">ALPHA</span>
                <span className="text-[#F4B000]">FORGE</span>
                <span className="text-[#00C2A8]">AI</span>
              </span>
            </div>
            <CardTitle className="text-2xl font-bold text-center text-white">
              Reset your password
            </CardTitle>
            <p className="text-sm text-[#A1A7B3] text-center">
              We'll send you a link to reset your password
            </p>
          </CardHeader>
          <CardContent>
            {error && (
              <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-center">
                <p className="text-sm text-red-500">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-white text-sm">
                  Email
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#A1A7B3]" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 bg-[#0B0F1A] border-[#0B0F1A] text-white placeholder:text-[#A1A7B3] focus:border-[#2563EB] focus:ring-[#2563EB]"
                    required
                    disabled={loading}
                  />
                </div>
              </div>

              <Button 
                type="submit" 
                className="w-full bg-[#2563EB] hover:bg-[#2563EB]/90 text-white"
                disabled={loading}
              >
                {loading ? "Sending..." : "Send Reset Link"}
              </Button>
            </form>

            <div className="mt-6 text-center border-t border-[#0B0F1A] pt-4">
              <p className="text-xs text-[#A1A7B3]">
                Remember your password?{" "}
                <Link 
                  href="/sign-in"
                  className="text-[#2563EB] hover:text-[#2563EB]/80 transition-colors"
                >
                  Sign in
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

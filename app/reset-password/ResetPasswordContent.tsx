"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Lock, Eye, EyeOff, CheckCircle } from "lucide-react";
import { updatePassword } from "@/app/auth/actions";

export default function ResetPasswordContent() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const formData = new FormData();
    formData.append("password", password);
    formData.append("confirm_password", confirmPassword);

    const result = await updatePassword(formData);

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
                Password Updated
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 rounded-full bg-[#00C2A8]/10 flex items-center justify-center">
                  <CheckCircle className="h-8 w-8 text-[#00C2A8]" />
                </div>
              </div>
              <p className="text-sm text-[#A1A7B3] mb-6">
                Your password has been successfully updated.
              </p>
              <Link href="/dashboard">
                <Button className="w-full bg-[#2563EB] hover:bg-[#2563EB]/90 text-white">
                  Go to Dashboard
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
              Set new password
            </CardTitle>
            <p className="text-sm text-[#A1A7B3] text-center">
              Enter your new password below
            </p>
          </CardHeader>
          <CardContent>
            {error && (
              <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-center">
                <p className="text-sm text-red-500">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* New Password */}
              <div className="space-y-2">
                <Label htmlFor="password" className="text-white text-sm">
                  New Password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#A1A7B3]" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 pr-10 bg-[#0B0F1A] border-[#0B0F1A] text-white placeholder:text-[#A1A7B3] focus:border-[#2563EB] focus:ring-[#2563EB]"
                    required
                    disabled={loading}
                    minLength={8}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#A1A7B3] hover:text-white transition-colors"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                <p className="text-xs text-[#A1A7B3]">Must be at least 8 characters</p>
              </div>

              {/* Confirm Password */}
              <div className="space-y-2">
                <Label htmlFor="confirm_password" className="text-white text-sm">
                  Confirm Password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#A1A7B3]" />
                  <Input
                    id="confirm_password"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="pl-10 pr-10 bg-[#0B0F1A] border-[#0B0F1A] text-white placeholder:text-[#A1A7B3] focus:border-[#2563EB] focus:ring-[#2563EB]"
                    required
                    disabled={loading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#A1A7B3] hover:text-white transition-colors"
                  >
                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <Button 
                type="submit" 
                className="w-full bg-[#2563EB] hover:bg-[#2563EB]/90 text-white"
                disabled={loading}
              >
                {loading ? "Updating..." : "Update Password"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

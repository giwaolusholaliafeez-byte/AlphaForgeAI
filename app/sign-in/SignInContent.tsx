"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowLeft, Mail, Lock, Eye, EyeOff, Chrome } from "lucide-react";
import { signIn, signInWithGoogle } from "@/app/auth/actions";

export default function SignInContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get("next") || "/dashboard";
  const errorParam = searchParams.get("error");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(errorParam || null);
  const [googleLoading, setGoogleLoading] = useState(false);

  useEffect(() => {
    if (errorParam) {
      setError(errorParam);
    }
  }, [errorParam]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const formData = new FormData();
    formData.append("email", email);
    formData.append("password", password);

    const result = await signIn(formData);

    if (result.error) {
      setError(result.error);
      setLoading(false);
      return;
    }

    if (result.success) {
      // Validate next parameter to prevent open redirects
      if (next && next.startsWith("/") && !next.startsWith("//")) {
        router.push(next);
      } else {
        router.push("/dashboard");
      }
      router.refresh();
    }
  };

  const handleGoogleSignIn = async () => {
    setGoogleLoading(true);
    setError(null);
    const result = await signInWithGoogle();
    if (result && result.error) {
      setError(result.error);
      setGoogleLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0B0F1A] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Link 
          href="/" 
          className="inline-flex items-center text-[#A1A7B3] hover:text-white transition-colors mb-6 text-sm"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Home
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
              Sign in to AlphaForge AI
            </CardTitle>
            <p className="text-sm text-[#A1A7B3] text-center">
              Access your financial intelligence workspace
            </p>
          </CardHeader>
          <CardContent>
            {error && (
              <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-center">
                <p className="text-sm text-red-500">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Email */}
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

              {/* Password */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password" className="text-white text-sm">
                    Password
                  </Label>
                  <Link 
                    href="/forgot-password"
                    className="text-xs text-[#2563EB] hover:text-[#2563EB]/80 transition-colors"
                  >
                    Forgot password?
                  </Link>
                </div>
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
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#A1A7B3] hover:text-white transition-colors"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {/* Remember Me */}
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="remember"
                  checked={rememberMe}
                  onCheckedChange={(checked) => setRememberMe(checked as boolean)}
                  className="border-[#A1A7B3] data-[state=checked]:bg-[#2563EB] data-[state=checked]:border-[#2563EB]"
                />
                <Label 
                  htmlFor="remember" 
                  className="text-sm text-[#A1A7B3] cursor-pointer"
                >
                  Remember me
                </Label>
              </div>

              {/* Sign In Button */}
              <Button 
                type="submit" 
                className="w-full bg-[#2563EB] hover:bg-[#2563EB]/90 text-white"
                disabled={loading}
              >
                {loading ? "Signing in..." : "Sign In"}
              </Button>

              {/* Divider */}
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-[#0B0F1A]"></div>
                </div>
                <div className="relative flex justify-center text-xs">
                  <span className="px-2 bg-[#1E293B] text-[#A1A7B3]">or continue with</span>
                </div>
              </div>

              {/* Google Sign In */}
              <Button 
                type="button"
                variant="outline"
                onClick={handleGoogleSignIn}
                disabled={googleLoading}
                className="w-full border-[#0B0F1A] text-white hover:bg-[#0B0F1A] hover:text-white"
              >
                <Chrome className="h-4 w-4 mr-2" />
                {googleLoading ? "Connecting..." : "Continue with Google"}
              </Button>
            </form>

            <div className="mt-6 text-center border-t border-[#0B0F1A] pt-4">
              <p className="text-xs text-[#A1A7B3]">
                Don't have an account?{" "}
                <Link 
                  href="/sign-up"
                  className="text-[#2563EB] hover:text-[#2563EB]/80 transition-colors"
                >
                  Create one
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

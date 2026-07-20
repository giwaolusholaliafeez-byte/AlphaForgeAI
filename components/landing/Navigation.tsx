"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, User, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { navigationLinks } from "@/data/navigation";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      setLoading(false);
    };

    getUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null);
        router.refresh();
      }
    );

    return () => subscription.unsubscribe();
  }, [supabase, router]);

  const navItems = navigationLinks;

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  };

  return (
    <header className="fixed top-0 z-50 w-full border-b bg-[#0B0F1A]/80 backdrop-blur-sm border-[#1E293B]">
      <div className="container flex h-16 items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-3">
          <Image
            src="/alphaforge-icon.png"
            alt="AlphaForge AI logo"
            width={32}
            height={32}
            priority
            className="h-8 w-auto"
          />
          <span className="text-lg font-bold tracking-tight hidden sm:inline">
            <span className="text-white">ALPHA</span>
            <span className="text-[#F4B000]">FORGE</span>
            <span className="text-[#00C2A8]">AI</span>
          </span>
        </Link>

        <nav className="hidden md:flex items-center space-x-8">
          {navItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="text-sm text-[#A1A7B3] hover:text-white transition-colors"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden md:flex items-center space-x-4">
          {!loading && (
            <>
              {user ? (
                <div className="flex items-center space-x-3">
                  <Link href="/dashboard">
                    <Button variant="ghost" size="sm" className="text-[#A1A7B3] hover:text-white">
                      <User className="h-4 w-4 mr-2" />
                      Account
                    </Button>
                  </Link>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={handleSignOut}
                    className="text-[#A1A7B3] hover:text-white"
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Sign Out
                  </Button>
                </div>
              ) : (
                <>
                  <Link href="/sign-in">
                    <Button variant="ghost" size="sm" className="text-[#A1A7B3] hover:text-white">
                      Sign In
                    </Button>
                  </Link>
                  <Link href="#product-preview">
                    <Button size="sm" className="bg-[#2563EB] hover:bg-[#2563EB]/90 text-white">
                      Start Researching
                    </Button>
                  </Link>
                </>
              )}
            </>
          )}
        </div>

        {/* Mobile Menu */}
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="md:hidden text-white">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[300px] sm:w-[350px] bg-[#0B0F1A] border-[#1E293B]">
            <div className="flex flex-col h-full">
              <div className="flex items-center space-x-3 mb-8">
                <Image
                  src="/alphaforge-icon.png"
                  alt="AlphaForge AI logo"
                  width={28}
                  height={28}
                  className="h-7 w-auto"
                />
                <span className="text-lg font-bold">
                  <span className="text-white">ALPHA</span>
                  <span className="text-[#F4B000]">FORGE</span>
                  <span className="text-[#00C2A8]">AI</span>
                </span>
              </div>
              <nav className="flex flex-col space-y-4">
                {navItems.map((item) => (
                  <Link
                    key={item.label}
                    href={item.href}
                    className="text-sm text-[#A1A7B3] hover:text-white transition-colors py-2"
                    onClick={() => setIsOpen(false)}
                  >
                    {item.label}
                  </Link>
                ))}
                <div className="pt-4 border-t border-[#1E293B] flex flex-col space-y-3">
                  {!loading && (
                    <>
                      {user ? (
                        <>
                          <Link href="/dashboard" onClick={() => setIsOpen(false)}>
                            <Button variant="ghost" className="w-full justify-start text-[#A1A7B3] hover:text-white">
                              <User className="h-4 w-4 mr-2" />
                              Dashboard
                            </Button>
                          </Link>
                          <Button 
                            onClick={() => {
                              handleSignOut();
                              setIsOpen(false);
                            }}
                            className="w-full justify-start text-[#A1A7B3] hover:text-white bg-transparent hover:bg-[#1E293B]"
                          >
                            <LogOut className="h-4 w-4 mr-2" />
                            Sign Out
                          </Button>
                        </>
                      ) : (
                        <>
                          <Link href="/sign-in" onClick={() => setIsOpen(false)}>
                            <Button variant="ghost" className="w-full justify-start text-[#A1A7B3] hover:text-white">
                              Sign In
                            </Button>
                          </Link>
                          <Link href="#product-preview" onClick={() => setIsOpen(false)}>
                            <Button className="w-full bg-[#2563EB] hover:bg-[#2563EB]/90 text-white">
                              Start Researching
                            </Button>
                          </Link>
                        </>
                      )}
                    </>
                  )}
                </div>
              </nav>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}

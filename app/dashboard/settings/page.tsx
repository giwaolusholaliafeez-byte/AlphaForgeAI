"use client";

import { useState } from "react";
import { 
  User, 
  Palette, 
  Globe, 
  Bell, 
  Shield, 
  LogOut,
  Check,
  ChevronRight,
  Sun,
  Moon,
  Monitor
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

type SettingsSection = "profile" | "appearance" | "preferences" | "notifications" | "security" | "account";

const sections: Array<{ id: SettingsSection; label: string; icon: any }> = [
  { id: "profile", label: "Profile", icon: User },
  { id: "appearance", label: "Appearance", icon: Palette },
  { id: "preferences", label: "Preferences", icon: Globe },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "security", label: "Security", icon: Shield },
  { id: "account", label: "Account", icon: LogOut },
];

export default function SettingsPage() {
  const [activeSection, setActiveSection] = useState<SettingsSection>("profile");
  const [isSaving, setIsSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const user = {
    name: "John Doe",
    email: "john@example.com",
    createdAt: new Date().toISOString(),
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    await new Promise(resolve => setTimeout(resolve, 800));
    setSuccessMessage("Settings saved successfully");
    setTimeout(() => setSuccessMessage(null), 3000);
    setIsSaving(false);
  };

  const renderContent = () => {
    switch (activeSection) {
      case "profile":
        return (
          <form onSubmit={handleSave} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="name" className="text-white text-sm">
                Full Name
              </Label>
              <Input
                id="name"
                type="text"
                defaultValue={user.name}
                className="bg-[#0B0F1A] border-[#0B0F1A] text-white placeholder:text-[#A1A7B3] focus:border-[#2563EB] focus:ring-[#2563EB]"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-white text-sm">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                defaultValue={user.email}
                className="bg-[#0B0F1A] border-[#0B0F1A] text-white placeholder:text-[#A1A7B3] focus:border-[#2563EB] focus:ring-[#2563EB]"
              />
            </div>
            <Button type="submit" disabled={isSaving} className="bg-[#2563EB] hover:bg-[#2563EB]/90 text-white">
              {isSaving ? "Saving..." : "Save Profile"}
            </Button>
            {successMessage && (
              <div className="p-3 rounded-lg bg-[#00C2A8]/10 border border-[#00C2A8]/20">
                <p className="text-sm text-[#00C2A8]">{successMessage}</p>
              </div>
            )}
          </form>
        );

      case "appearance":
        return (
          <div className="space-y-4">
            <div className="space-y-1.5">
              <Label className="text-white text-sm">Theme</Label>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { id: "light", label: "Light", icon: Sun },
                  { id: "dark", label: "Dark", icon: Moon },
                  { id: "system", label: "System", icon: Monitor },
                ].map((theme) => (
                  <button
                    key={theme.id}
                    className={cn(
                      "p-3 rounded-lg border transition-all duration-150 text-center",
                      theme.id === "dark"
                        ? "border-[#2563EB] bg-[#2563EB]/10 text-white"
                        : "border-[#1E293B] bg-[#0B0F1A] text-[#A1A7B3] hover:border-white/[0.08]"
                    )}
                  >
                    <theme.icon className="h-5 w-5 mx-auto mb-1" />
                    <span className="text-xs">{theme.label}</span>
                    {theme.id === "dark" && (
                      <Check className="h-3 w-3 text-[#2563EB] mx-auto mt-1" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>
        );

      case "preferences":
        return (
          <div className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="currency" className="text-white text-sm">
                Base Currency
              </Label>
              <select
                id="currency"
                className="w-full px-3 py-2 rounded-lg bg-[#0B0F1A] border border-[#0B0F1A] text-white focus:border-[#2563EB] focus:ring-[#2563EB]"
                defaultValue="USD"
              >
                <option value="USD">USD - US Dollar</option>
                <option value="EUR">EUR - Euro</option>
                <option value="GBP">GBP - British Pound</option>
              </select>
            </div>
          </div>
        );

      case "notifications":
        return (
          <div className="p-3 rounded-lg bg-[#F4B000]/5 border border-[#F4B000]/10">
            <p className="text-sm text-[#A1A7B3]">
              ⚠️ Notification preferences will be available once alert notifications are fully implemented.
            </p>
          </div>
        );

      case "security":
        return (
          <div className="space-y-4">
            <div className="p-3 rounded-lg bg-[#F4B000]/5 border border-[#F4B000]/10">
              <p className="text-sm text-[#A1A7B3]">
                🔒 Security settings will be available in a future update.
              </p>
            </div>
          </div>
        );

      case "account":
        return (
          <div className="space-y-4">
            <div className="p-3 rounded-lg bg-[#0B0F1A] border border-[#1E293B]">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-white">Account Created</p>
                  <p className="text-xs text-[#A1A7B3]">{new Date(user.createdAt).toLocaleDateString()}</p>
                </div>
                <Badge className="bg-[#00C2A8]/10 text-[#00C2A8] border-[#00C2A8]/20">Active</Badge>
              </div>
            </div>
            <div className="p-3 rounded-lg bg-red-500/5 border border-red-500/10">
              <p className="text-sm text-red-500 font-medium mb-1">Danger Zone</p>
              <p className="text-xs text-[#A1A7B3] mb-3">Permanently delete your account and all associated data</p>
              <Button variant="destructive" size="sm" className="bg-red-500 hover:bg-red-600 text-white">
                Delete Account
              </Button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold text-white">Settings</h1>
        <p className="text-sm text-[#A1A7B3]">Manage your account preferences</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="md:col-span-1">
          <div className="bg-[#1E293B] rounded-lg border border-[#1E293B] p-2 space-y-0.5">
            {sections.map((section) => {
              const Icon = section.icon;
              const isActive = activeSection === section.id;
              return (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={cn(
                    "w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all duration-150",
                    isActive
                      ? "bg-[#2563EB]/10 text-[#2563EB]"
                      : "text-[#A1A7B3] hover:text-white hover:bg-white/[0.04]"
                  )}
                >
                  <Icon className="h-4 w-4" />
                  <span className="flex-1 text-left">{section.label}</span>
                  {isActive && <ChevronRight className="h-4 w-4" />}
                </button>
              );
            })}
          </div>
        </div>

        <div className="md:col-span-3">
          <div className="bg-[#1E293B] rounded-lg border border-[#1E293B] p-5">
            {renderContent()}
          </div>
        </div>
      </div>
    </div>
  );
}

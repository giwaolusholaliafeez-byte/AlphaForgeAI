"use client";

import { useEffect, useState } from "react";
import { Bell, BellOff } from "lucide-react";
import { Button } from "@/components/ui/button";

type PermissionState = NotificationPermission | "unsupported";

export default function NotificationPermissionButton({ compact = false }: { compact?: boolean }) {
  const [permission, setPermission] = useState<PermissionState>("default");

  useEffect(() => {
    if (typeof window === "undefined" || !("Notification" in window)) {
      setPermission("unsupported");
      return;
    }
    setPermission(window.Notification.permission);
  }, []);

  const requestPermission = async () => {
    if (!("Notification" in window)) {
      setPermission("unsupported");
      return;
    }
    if (window.Notification.permission === "denied") {
      setPermission("denied");
      return;
    }
    const nextPermission = await window.Notification.requestPermission();
    setPermission(nextPermission);
  };

  const label = permission === "granted"
    ? "Browser notifications enabled"
    : permission === "denied"
      ? "Browser notifications blocked"
      : permission === "unsupported"
        ? "Browser notifications unavailable"
        : "Allow browser notifications";

  return (
    <Button
      type="button"
      variant="ghost"
      size={compact ? "default" : "icon"}
      onClick={requestPermission}
      className={compact
        ? "w-full justify-start gap-3 text-[#A1A7B3] hover:bg-white/[0.04] hover:text-white"
        : "h-10 w-10 text-[#A1A7B3] hover:bg-white/[0.04] hover:text-white"}
      aria-label={label}
      title={label}
      disabled={permission === "unsupported" || permission === "granted"}
    >
      {permission === "denied" || permission === "unsupported" ? <BellOff className="h-4.5 w-4.5" /> : <Bell className="h-4.5 w-4.5" />}
      {compact && <span>{permission === "granted" ? "Notifications enabled" : permission === "denied" ? "Notifications blocked in browser" : permission === "unsupported" ? "Notifications unavailable" : "Allow browser notifications"}</span>}
    </Button>
  );
}

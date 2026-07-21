import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getUserSubscription } from "@/lib/billing/entitlements";
import { signOut } from "@/app/auth/actions";
import SettingsForm from "./SettingsForm";

export default async function SettingsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/sign-in");
  const [{ data: profile }, subscription] = await Promise.all([
    supabase.from("profiles").select("display_name,user_type").eq("user_id", user.id).maybeSingle(),
    getUserSubscription(),
  ]);
  const displayName = profile?.display_name || user.user_metadata?.full_name || user.email?.split("@")[0] || "User";
  const userType = profile?.user_type === "trader" || profile?.user_type === "exploring" ? profile.user_type : "investor";
  return <div className="max-w-3xl space-y-6"><header><p className="text-xs uppercase tracking-wider text-[#00C2A8]">Account settings</p><h1 className="mt-1 text-2xl font-semibold text-white">Settings</h1><p className="mt-1 text-sm text-[#A1A7B3]">Manage the profile and dashboard preference attached to your authenticated account.</p></header><SettingsForm displayName={displayName} email={user.email ?? ""} userType={userType} /><section className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-5"><p className="text-xs uppercase tracking-wider text-[#00C2A8]">Plan</p><div className="mt-2 flex items-center justify-between gap-4"><div><h2 className="font-medium text-white">AlphaForge {subscription.plan === "pro" ? "Pro" : "Free"}</h2><p className="mt-1 text-sm text-[#A1A7B3]">Billing is separate from paper trading and brokerage funding.</p></div><Link href="/dashboard/settings/billing" className="rounded-lg border border-[#2563EB]/40 px-3 py-2 text-sm text-[#60A5FA] hover:bg-[#2563EB]/10">Manage billing</Link></div></section><section className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-5"><p className="text-xs uppercase tracking-wider text-[#00C2A8]">Security</p><h2 className="mt-2 font-medium text-white">Password</h2><p className="mt-1 text-sm text-[#A1A7B3]">Use the existing Supabase password-reset flow to change your password.</p><div className="mt-4 flex flex-wrap gap-3"><Link href="/forgot-password" className="rounded-lg border border-white/[0.1] px-3 py-2 text-sm text-white hover:bg-white/[0.04]">Reset password</Link><form action={signOut}><button type="submit" className="rounded-lg border border-red-400/30 px-3 py-2 text-sm text-red-300 hover:bg-red-400/10">Sign out</button></form></div></section><p className="text-xs text-[#64748B]">Connected Brokerage and Live Brokerage are not available. No settings on this page can enable real-money trading.</p></div>;
}

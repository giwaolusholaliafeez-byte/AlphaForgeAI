"use client";

import { useState, useTransition } from "react";
import { updateProfile } from "./actions";

export default function SettingsForm({ displayName, email, userType }: { displayName: string; email: string; userType: "investor" | "trader" | "exploring" }) {
  const [name, setName] = useState(displayName);
  const [role, setRole] = useState(userType);
  const [message, setMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const save = () => { const data = new FormData(); data.set("displayName", name); data.set("userType", role); startTransition(async () => { const result = await updateProfile(data); setMessage(result.success ? "Profile and preference saved." : result.error ?? "Profile could not be saved."); }); };
  return <section className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-5"><p className="text-xs uppercase tracking-wider text-[#00C2A8]">Profile</p><div className="mt-4 grid gap-4 sm:grid-cols-2"><label className="text-sm text-[#A1A7B3]">Display name<input value={name} onChange={(event) => setName(event.target.value)} className="mt-1 h-10 w-full rounded-lg border border-white/[0.08] bg-[#0B0F1A] px-3 text-white outline-none focus:border-[#2563EB]" maxLength={80} /></label><label className="text-sm text-[#A1A7B3]">Email<input value={email} readOnly className="mt-1 h-10 w-full rounded-lg border border-white/[0.04] bg-[#0B0F1A]/60 px-3 text-[#64748B] outline-none" /></label></div><div className="mt-5"><p className="text-sm text-[#A1A7B3]">Dashboard preference</p><div className="mt-2 grid gap-2 sm:grid-cols-3">{(["investor", "trader", "exploring"] as const).map((option) => <button type="button" key={option} onClick={() => setRole(option)} className={`rounded-lg border px-3 py-3 text-left text-sm capitalize ${role === option ? "border-[#2563EB] bg-[#2563EB]/10 text-white" : "border-white/[0.08] text-[#A1A7B3] hover:bg-white/[0.04]"}`}>{option}<span className="mt-1 block text-xs text-[#64748B]">{option === "investor" ? "Portfolio first" : option === "trader" ? "Paper trading first" : "Markets first"}</span></button>)}</div></div><button type="button" onClick={save} disabled={isPending || !name.trim()} className="mt-5 rounded-lg bg-[#2563EB] px-4 py-2 text-sm font-medium text-white disabled:opacity-50">{isPending ? "Saving..." : "Save changes"}</button>{message && <p className="mt-3 text-sm text-[#A1A7B3]">{message}</p>}</section>;
}

"use client";

import { useState } from "react";
import { openPaperAccount } from "@/lib/paper/actions";

export default function OpenPaperAccountButton() { const [loading, setLoading] = useState(false); const [error, setError] = useState<string | null>(null); const open = async () => { setLoading(true); setError(null); const result = await openPaperAccount(); if (!result.success) { setError(result.error ?? "Paper account could not be opened."); setLoading(false); } }; return <div><button type="button" disabled={loading} onClick={open} className="rounded-lg bg-[#2563EB] px-4 py-2 text-sm font-medium text-white hover:bg-[#2563EB]/90 disabled:opacity-50">{loading ? "Opening account..." : "Open $100,000 simulated account"}</button>{error && <p className="mt-2 text-sm text-red-300">{error}</p>}</div>; }

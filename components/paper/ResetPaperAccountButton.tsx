"use client";

import { useState } from 'react';
import { resetPaperAccount } from '@/lib/paper/actions';
import { Button } from '@/components/ui/button';

export default function ResetPaperAccountButton() {
  const [message, setMessage] = useState<string | null>(null);
  const reset = async () => { if (!window.confirm('Reset your paper account to $100,000 and remove all paper activity?')) return; const result = await resetPaperAccount(); setMessage(result.success ? 'Paper account reset.' : result.error ?? 'Reset failed.'); };
  return <div className="mt-6"><Button type="button" variant="outline" onClick={reset}>Reset paper account</Button>{message && <p className="mt-2 text-sm text-[#A1A7B3]">{message}</p>}</div>;
}

"use client";

import Link from 'next/link';
import { useState } from 'react';
import { cancelSubscription } from '@/lib/billing/actions';
import { Button } from '@/components/ui/button';

export default function BillingActions({ canCancel }: { canCancel: boolean }) {
  const [message, setMessage] = useState<string | null>(null);
  const [working, setWorking] = useState(false);
  const cancel = async () => { if (!window.confirm('Cancel recurring Pro billing? Your access remains available through the current billing period.')) return; setWorking(true); const result = await cancelSubscription(); setMessage(result.success ? 'Recurring billing cancelled.' : result.error ?? 'Cancellation failed.'); setWorking(false); };
  return <div className="mt-6 flex flex-wrap gap-3"><Button asChild variant="outline"><Link href="/dashboard/settings/billing/manage">Manage Subscription</Link></Button><Button type="button" variant="destructive" disabled={!canCancel || working} onClick={cancel}>{working ? 'Cancelling...' : 'Cancel Subscription'}</Button>{message && <p className="basis-full text-sm text-[#A1A7B3]">{message}</p>}</div>;
}

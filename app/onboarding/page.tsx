import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { saveUserType } from '@/lib/onboarding/actions';
import { Button } from '@/components/ui/button';

const choices = [
  { id: 'investor', title: 'Investor', description: 'I invest and track assets over time.' },
  { id: 'trader', title: 'Trader', description: 'I actively follow markets and trade.' },
  { id: 'exploring', title: 'Exploring', description: "I'm learning, researching, or exploring markets." },
] as const;

export default async function OnboardingPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/sign-in');
  const { data: profile } = await supabase.from('profiles').select('user_type').eq('user_id', user.id).maybeSingle();
  if (profile?.user_type) redirect('/dashboard');
  return <main className="min-h-screen bg-[#0B0F1A] flex items-center justify-center p-6"><form action={async (formData) => { 'use server'; const result = await saveUserType(formData); if (result.success) redirect('/dashboard'); }} className="w-full max-w-xl rounded-2xl border border-white/[0.08] bg-[#111827] p-8"><p className="text-xs uppercase tracking-[0.2em] text-[#00C2A8]">AlphaForge AI</p><h1 className="mt-3 text-3xl font-semibold text-white">How do you plan to use AlphaForge?</h1><p className="mt-2 text-[#A1A7B3]">This personalizes your dashboard without limiting access to any feature.</p><div className="mt-8 space-y-3">{choices.map((choice) => <label key={choice.id} className="flex cursor-pointer gap-3 rounded-xl border border-white/[0.08] p-4 hover:border-[#2563EB]"><input required type="radio" name="userType" value={choice.id} className="mt-1 accent-[#2563EB]" /><span><span className="block font-medium text-white">{choice.title}</span><span className="text-sm text-[#A1A7B3]">{choice.description}</span></span></label>)}</div><Button type="submit" className="mt-8 w-full">Continue to AlphaForge</Button></form></main>;
}

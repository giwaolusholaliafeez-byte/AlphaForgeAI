import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export const metadata: Metadata = {
  title: "Privacy Policy | AlphaForge AI",
  description: "How AlphaForge AI collects, uses, and protects your data.",
};

const sections = [
  {
    title: "1. Information we collect",
    body: [
      "Account information: name, email address, and authentication credentials when you sign up or sign in.",
      "Financial data you provide: watchlists, portfolio holdings, alerts, and paper-trading activity you create inside the product.",
      "Usage data: pages visited, features used, and AI-copilot interactions, collected to operate and improve the service.",
      "Billing information: subscription plan and payment status. Card details are handled directly by our payment processor (Paystack) and are never stored on AlphaForge AI servers.",
    ],
  },
  {
    title: "2. How we use your information",
    body: [
      "To provide the core product: market data, portfolio analytics, watchlists, alerts, AI research, and paper trading.",
      "To authenticate you and keep your account secure.",
      "To process subscription payments and manage entitlements.",
      "To communicate service updates, security notices, and — where you've opted in — product updates.",
      "To monitor, debug, and improve platform reliability and performance.",
    ],
  },
  {
    title: "3. AI features",
    body: [
      "AI Research and Ask AlphaForge send your questions and relevant portfolio context to our AI provider (OpenAI) to generate a response. We do not send your raw account credentials or payment details to any AI provider.",
      "AI-generated research and answers are informational only and are not stored or used to train third-party models beyond the provider's standard API data-handling terms.",
    ],
  },
  {
    title: "4. Data sharing",
    body: [
      "We do not sell your personal data.",
      "We share data with service providers strictly to operate the platform: Supabase (database and authentication), Paystack (billing), Finnhub/CoinGecko/Twelve Data/Frankfurter (market data), and OpenAI (AI features).",
      "We may disclose information if required by law or to protect the rights, safety, or property of AlphaForge AI or its users.",
    ],
  },
  {
    title: "5. Data retention",
    body: [
      "We retain account and portfolio data for as long as your account is active. You can request deletion of your account and associated data at any time by contacting support.",
    ],
  },
  {
    title: "6. Your rights",
    body: [
      "You may access, correct, export, or delete your personal data by managing it in-app or by contacting support@alphaforge.ai.",
      "You may unsubscribe from non-essential communications at any time.",
    ],
  },
  {
    title: "7. Security",
    body: [
      "Data is stored in Supabase (Postgres) with row-level security scoping every record to your account. Access to production systems is restricted and payment data is never handled directly by our servers.",
    ],
  },
  {
    title: "8. Changes to this policy",
    body: [
      "We may update this policy as the product evolves. Material changes will be reflected by updating the date below.",
    ],
  },
];

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-[#0B0F1A] p-6 text-white">
      <div className="mx-auto max-w-3xl py-12 sm:py-20">
        <Link
          href="/"
          className="inline-flex items-center text-sm text-[#A1A7B3] transition-colors hover:text-white"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Home
        </Link>

        <p className="mt-8 text-xs uppercase tracking-[0.2em] text-[#00C2A8]">Legal</p>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight sm:text-5xl">Privacy Policy</h1>
        <p className="mt-4 text-sm text-[#64748B]">Last updated: August 3, 2026</p>

        <p className="mt-8 max-w-2xl text-[#A1A7B3]">
          This policy explains what data AlphaForge AI collects, how it's used, and the choices you have. It is
          informational and does not constitute legal advice.
        </p>

        <div className="mt-12 space-y-10">
          {sections.map((section) => (
            <section key={section.title}>
              <h2 className="text-xl font-semibold text-white">{section.title}</h2>
              <ul className="mt-3 space-y-2">
                {section.body.map((line) => (
                  <li key={line} className="text-sm leading-relaxed text-[#A1A7B3]">
                    {line}
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>

        <p className="mt-12 text-sm text-[#64748B]">
          Questions about this policy? Contact{" "}
          <a href="mailto:support@alphaforge.ai" className="text-[#60A5FA] hover:underline">
            support@alphaforge.ai
          </a>
          .
        </p>
      </div>
    </main>
  );
}

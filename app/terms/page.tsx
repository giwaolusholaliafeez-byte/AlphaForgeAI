import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export const metadata: Metadata = {
  title: "Terms of Service | AlphaForge AI",
  description: "The terms that govern your use of AlphaForge AI.",
};

const sections = [
  {
    title: "1. Acceptance of terms",
    body: [
      "By creating an account or using AlphaForge AI, you agree to these Terms of Service. If you do not agree, do not use the service.",
    ],
  },
  {
    title: "2. Not financial advice",
    body: [
      "AlphaForge AI provides research tools, market data, analytics, and AI-generated commentary for informational purposes only. Nothing on the platform constitutes financial, investment, tax, or legal advice.",
      "Always consult a qualified financial advisor before making investment decisions. You are solely responsible for any trading or investment decisions you make.",
    ],
  },
  {
    title: "3. Paper trading",
    body: [
      "The paper-trading feature simulates trades using real market prices in a sandboxed account with no real funds. Simulated results do not guarantee future performance of real trades and may differ from live market execution.",
    ],
  },
  {
    title: "4. Live trading",
    body: [
      "Live brokerage connectivity is not currently available to end users. Any future live-trading feature will require explicit opt-in and separate terms with the applicable broker.",
    ],
  },
  {
    title: "5. Accounts and eligibility",
    body: [
      "You must provide accurate information when creating an account and are responsible for keeping your credentials secure.",
      "You must be legally permitted to use financial research tools in your jurisdiction.",
    ],
  },
  {
    title: "6. Subscriptions and billing",
    body: [
      "Paid plans are billed through Paystack on a recurring basis until cancelled. Plan features and limits are described on the Pricing page and may change with notice.",
      "You can manage or cancel your subscription at any time from Settings → Billing.",
    ],
  },
  {
    title: "7. Acceptable use",
    body: [
      "You may not attempt to disrupt the service, reverse-engineer its systems, scrape data at scale, or use the platform for unlawful purposes.",
    ],
  },
  {
    title: "8. Third-party data",
    body: [
      "Market data is sourced from third-party providers (including Finnhub, CoinGecko, Twelve Data, and Frankfurter) and is provided \"as is.\" AlphaForge AI does not guarantee the accuracy, completeness, or timeliness of this data.",
    ],
  },
  {
    title: "9. Disclaimer of warranties & limitation of liability",
    body: [
      "The service is provided \"as is\" without warranties of any kind. To the fullest extent permitted by law, AlphaForge AI is not liable for any indirect, incidental, or consequential damages arising from your use of the platform, including losses from trading or investment decisions.",
    ],
  },
  {
    title: "10. Changes to these terms",
    body: [
      "We may update these terms as the product evolves. Continued use of the service after changes take effect constitutes acceptance of the updated terms.",
    ],
  },
];

export default function TermsPage() {
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
        <h1 className="mt-3 text-4xl font-semibold tracking-tight sm:text-5xl">Terms of Service</h1>
        <p className="mt-4 text-sm text-[#64748B]">Last updated: August 3, 2026</p>

        <p className="mt-8 max-w-2xl text-[#A1A7B3]">
          These terms govern your access to and use of AlphaForge AI. They are informational and do not
          constitute legal advice.
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
          Questions about these terms? Contact{" "}
          <a href="mailto:support@alphaforge.ai" className="text-[#60A5FA] hover:underline">
            support@alphaforge.ai
          </a>
          .
        </p>
      </div>
    </main>
  );
}

import Navigation from "@/components/landing/Navigation";
import Hero from "@/components/landing/Hero";
import ProductPreview from "@/components/landing/ProductPreview";
import Capabilities from "@/components/landing/Capabilities";
import PlatformShowcase from "@/components/landing/PlatformShowcase";
import HowItWorks from "@/components/landing/HowItWorks";
import DataTrust from "@/components/landing/DataTrust";
import CTA from "@/components/landing/CTA";
import Footer from "@/components/landing/Footer";

export default function HomePage() {
  const providerStatus = {
    finnhub: Boolean(process.env.FINNHUB_API_KEY),
    coingecko: Boolean(process.env.COINGECKO_DEMO_API_KEY),
    twelveData: Boolean(process.env.TWELVE_DATA_API_KEY),
    openai: Boolean(process.env.OPENAI_API_KEY),
  };

  return (
    <main className="min-h-screen overflow-x-hidden bg-background text-foreground">
      <Navigation />
      <Hero />
      <ProductPreview />
      <Capabilities />
      <PlatformShowcase />
      <HowItWorks />
      <DataTrust providerStatus={providerStatus} />
      <CTA />
      <Footer />
    </main>
  );
}

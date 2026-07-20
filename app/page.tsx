import Navigation from "@/components/landing/Navigation";
import Hero from "@/components/landing/Hero";
import ProductPreview from "@/components/landing/ProductPreview";
import Capabilities from "@/components/landing/Capabilities";
import AIDemo from "@/components/landing/AIDemo";
import HowItWorks from "@/components/landing/HowItWorks";
import BuiltFor from "@/components/landing/BuiltFor";
import CTA from "@/components/landing/CTA";
import Footer from "@/components/landing/Footer";

export default function HomePage() {
  return (
    <main className="min-h-screen overflow-x-hidden bg-background text-foreground">
      <Navigation />
      <Hero />
      <ProductPreview />
      <Capabilities />
      <AIDemo />
      <HowItWorks />
      <BuiltFor />
      <CTA />
      <Footer />
    </main>
  );
}

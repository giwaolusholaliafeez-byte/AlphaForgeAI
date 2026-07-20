import Link from "next/link";
import Image from "next/image";
import { Separator } from "@/components/ui/separator";

const footerLinks = {
  product: ["Markets", "Research", "Pricing", "Demo"],
  company: ["About", "Blog", "Careers", "Contact"],
  legal: ["Privacy", "Terms", "Risk Disclosure"],
};

export default function Footer() {
  return (
    <footer className="border-t border-[#1E293B] bg-[#0B0F1A]">
      <div className="container py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-1">
            <Link href="/" className="flex items-center space-x-3">
              <Image
                src="/alphaforge-icon.png"
                alt="AlphaForge AI logo"
                width={28}
                height={28}
                className="h-7 w-auto"
              />
              <span className="text-lg font-bold">
                <span className="text-white">ALPHA</span>
                <span className="text-[#F4B000]">FORGE</span>
                <span className="text-[#00C2A8]">AI</span>
              </span>
            </Link>
            <p className="text-xs text-[#A1A7B3] mt-3 max-w-xs">
              Financial intelligence platform combining AI research, market data, and portfolio monitoring.
            </p>
          </div>

          <div>
            <h4 className="text-sm font-medium mb-3 text-white">Product</h4>
            <ul className="space-y-2">
              {footerLinks.product.map((link) => (
                <li key={link}>
                  <Link
                    href={`#${link.toLowerCase()}`}
                    className="text-xs text-[#A1A7B3] hover:text-white transition-colors"
                  >
                    {link}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-medium mb-3 text-white">Company</h4>
            <ul className="space-y-2">
              {footerLinks.company.map((link) => (
                <li key={link}>
                  <Link
                    href={`#${link.toLowerCase()}`}
                    className="text-xs text-[#A1A7B3] hover:text-white transition-colors"
                  >
                    {link}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-medium mb-3 text-white">Legal</h4>
            <ul className="space-y-2">
              {footerLinks.legal.map((link) => (
                <li key={link}>
                  <Link
                    href={`#${link.toLowerCase().replace(" ", "-")}`}
                    className="text-xs text-[#A1A7B3] hover:text-white transition-colors"
                  >
                    {link}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <Separator className="my-8 bg-[#1E293B]" />

        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-[#A1A7B3]">
            © {new Date().getFullYear()} AlphaForge AI. All rights reserved.
          </p>
          <p className="text-xs text-[#A1A7B3] text-center max-w-2xl">
            <span className="text-white font-medium">Risk Disclosure:</span> AlphaForge AI provides research tools and information 
            and does not provide financial advice. Always consult with a qualified financial advisor before making 
            investment decisions.
          </p>
        </div>
      </div>
    </footer>
  );
}

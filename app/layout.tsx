import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AlphaForge AI | Financial Intelligence",
  description:
    "Research financial assets, monitor markets, track portfolios, and understand market news with AI-powered financial intelligence."
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body>{children}</body>
    </html>
  );
}

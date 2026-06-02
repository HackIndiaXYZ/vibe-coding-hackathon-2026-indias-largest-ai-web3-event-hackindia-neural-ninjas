import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "TruScan AI — Know What To Trust Before It Costs You",
  description:
    "TruScan AI helps you detect scam calls, phishing SMS, AI voice clones, fake websites, deepfakes and misinformation using AI-powered trust analysis.",
  keywords: [
    "scam detection",
    "deepfake detection",
    "AI voice clone",
    "phishing SMS",
    "fraud prevention",
    "cybersecurity",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground">
        {children}
      </body>
    </html>
  );
}

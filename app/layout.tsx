import type { Metadata } from "next";
import "./globals.css";
import RootClientLayout from "@/components/sections/RootClientLayout";
import { Toaster } from "sonner";
import Script from "next/script";

export const metadata: Metadata = {
  title: {
    template: "%s | Makeadle", // This sets a template for all pages
    default: "Makeadle - Create & Play Custom Wordles", // Default title for pages without a specific title
  },
  description:
    "Makeadle is a platform where you can create and play custom Wordle-like games based on your favorite topics, like Mobile Legends, League of Legends, and more!",
  keywords: [
    "wordle",
    "custom wordle",
    "makeadle",
    "wordle game",
    "online game",
    "mobile legends wordle",
    "league of legends wordle",
  ],
  openGraph: {
    title: "Makeadle - Create & Play Custom Wordles",
    description:
      "Makeadle is a platform where you can create and play custom Wordle-like games based on your favorite topics, like Mobile Legends, League of Legends, and more!",
    url: "https://www.makeadle.com", // Your base URL
    siteName: "Makeadle",
    images: [
      {
        url: "https://www.makeadle.com/img/makeadle-og-image.png", // Path to your default Open Graph image
        width: 1200,
        height: 630,
        alt: "Makeadle - Create and Play Custom Wordles",
      },
      // You can add more image objects if you have different sizes or types
    ],
    type: "website", // 'website' for the homepage and general site
  },
  twitter: {
    card: "summary_large_image",
    site: "@your_twitter_handle", // Optional: Your Twitter handle
    creator: "@your_twitter_handle", // Optional: Your Twitter handle
    title: "Makeadle - Create & Play Custom Wordles",
    description:
      "Makeadle is a platform where you can create and play custom Wordle-like games based on your favorite topics, like Mobile Legends, League of Legends, and more!",
    images: ["https://www.makeadle.com/img/makeadle-og-image.png"],
  },
  // Add other useful meta tags
  authors: [
    { name: "Your Name or Company Name", url: "https://www.makeadle.com" },
  ],
  creator: "Your Name or Company Name",
  publisher: "Your Name or Company Name",
  // You might also want to add manifest, theme-color, etc.
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      {/* Google tag (gtag.js) */}
      <Script
        async
        src="https://www.googletagmanager.com/gtag/js?id=G-H0R023VWX9"
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-H0R023VWX9');
        `}
      </Script>
      <body className="antialiased h-screen w-screen overflow-hidden scrollbar scrollbar-thumb-slate-700 scrollbar-track-slate-300">
        <RootClientLayout />
        {children}
        <Toaster />
      </body>
    </html>
  );
}

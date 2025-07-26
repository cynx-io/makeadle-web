import type { Metadata } from "next";
import "./globals.css";
import RootClientLayout from "@/components/sections/RootClientLayout";
import { Toaster } from "sonner";
import Script from "next/script";
import DynamicFavicon from "@/components/DynamicFavicon";

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
    "pokemon wordle",
    "mobiledle",
    "loldle",
    "pokedle",
  ],
  openGraph: {
    title: "Makeadle - Create & Play Custom Wordles",
    description:
      "Makeadle is a platform where you can create and play custom Wordle-like games based on your favorite topics, like Mobile Legends, League of Legends, and more!",
    url: "https://www.makeadle.com", // Your base URL
    siteName: "Makeadle",
    images: [
      {
        url: "https://www.makeadle.com/icon.png", // Path to your default Open Graph image
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
    images: ["https://www.makeadle.com/icon.png"],
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
      <head>
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

        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1374372173829138"
          crossOrigin="anonymous"
        ></script>

        {/* Additional SEO Meta Tags */}
        <meta
          name="robots"
          content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1"
        />
        <meta name="googlebot" content="index, follow" />
        <meta name="bingbot" content="index, follow" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, maximum-scale=5.0"
        />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta name="theme-color" content="#2563eb" />
        <meta name="color-scheme" content="light dark" />
        <meta name="format-detection" content="telephone=no" />

        {/* Preconnect to external domains */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://www.googletagmanager.com" />
        <link rel="preconnect" href="https://pagead2.googlesyndication.com" />

        {/* Canonical URL */}
        <link rel="canonical" href="https://www.makeadle.com" />

        {/* Favicon - using your custom favicon.ico */}
        <link
          rel="icon"
          href="/favicon.ico"
          type="image/x-icon"
          sizes="32x32"
        />
        <link rel="shortcut icon" href="/favicon.ico" type="image/x-icon" />
        <link rel="apple-touch-icon" href="/icon.png" />

        {/* Alternate languages if you plan to support them */}
        <link rel="alternate" hrefLang="en" href="https://www.makeadle.com" />

        {/* RSS Feed if you plan to add a blog */}
        {/* <link rel="alternate" type="application/rss+xml" title="Makeadle Blog" href="/feed.xml" /> */}
      </head>
      <body className="antialiased scrollbar scrollbar-thumb-slate-700 scrollbar-track-slate-300">
        <DynamicFavicon />
        <RootClientLayout />
        {children}
        <Toaster />
      </body>
    </html>
  );
}

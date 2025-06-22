import type { Metadata } from "next";
import "./globals.css";
import RootClientLayout from "@/components/sections/RootClientLayout";
import { Toaster } from "sonner";

export const metadata: Metadata = {
  title: "Makeadle",
  description: "",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased h-screen w-screen overflow-hidden scrollbar scrollbar-thumb-slate-700 scrollbar-track-slate-300">
        <RootClientLayout />
        {children}
        <Toaster />
      </body>
    </html>
  );
}

import type { Metadata } from "next";
import { NextSSRPlugin } from "@uploadthing/react/next-ssr-plugin";
import { extractRouterConfig } from "uploadthing/server";
import { Geist, Geist_Mono } from "next/font/google";
import { ourFileRouter } from "@/app/api/uploadthing/core";
import { ChannelStripBackground } from "@/components/channel-strip-background";
import { Navbar } from "@/components/navbar";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Xsycho Labs | Mixing, Mastering & Audio Presets",
  description:
    "I offer high-end mixing, mastering, and custom vocal presets. Solo audio engineering for industry ready sound.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="relative flex min-h-full flex-col bg-xs-bg font-sans text-white">
        <NextSSRPlugin routerConfig={extractRouterConfig(ourFileRouter)} />
        <ChannelStripBackground />
        <Navbar />
        {children}
      </body>
    </html>
  );
}

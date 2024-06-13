import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { DM_Serif_Display } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import { cn } from "@/lib/utils";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/toaster";
import "./globals.css";
import { Settings } from "./settings";
import { Menu } from "./menu";
import TRPCProvider from "@/app/_trpc/provider";
import { SignInButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";

export const metadata: Metadata = {
  title: "The Time Lit",
  description: "Time in Literature",
};

const titleFont = DM_Serif_Display({ weight: "400", subsets: ["latin"] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <head>
          <link
            rel="apple-touch-icon"
            sizes="180x180"
            href="/apple-touch-icon.png"
          />
          <link
            rel="icon"
            type="image/png"
            sizes="32x32"
            href="/favicon-32x32.png"
          />
          <link
            rel="icon"
            type="image/png"
            sizes="16x16"
            href="/favicon-16x16.png"
          />
          <link rel="manifest" href="/site.webmanifest" />
          <meta
            name="theme-color"
            media="(prefers-color-scheme: light)"
            content="white"
          />
          <meta
            name="theme-color"
            media="(prefers-color-scheme: dark)"
            content="black"
          />
        </head>
        <body
          className={cn(
            "relative flex min-h-screen flex-col bg-foreground/50",
            "before:absolute before:inset-0 before:bg-cover before:content-['']",
            "before:bg-[url('/bg/marble_sm.webp')] xl:before:bg-[url('/bg/marble_lg.webp')]",
            "before:opacity-80 dark:before:invert",
            GeistSans.className,
          )}
        >
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            <TRPCProvider>
              <header className="flex h-16 flex-grow-0 flex-row items-center justify-between bg-background/50 px-2 text-foreground/90 shadow-lg backdrop-blur-sm lg:px-4">
                <div className="w-8 flex-grow-0">
                  <Menu />
                </div>
                <div
                  className={cn("text-2xl tracking-wide", titleFont.className)}
                >
                  The Time Lit
                </div>
                <div className="w-8 flex-grow-0">
                  <Settings />
                </div>
              </header>
              {children}
              <Toaster />
            </TRPCProvider>
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}

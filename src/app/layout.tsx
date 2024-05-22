import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { DM_Serif_Display } from "next/font/google";
import { cn } from "@/lib/utils";
import { ThemeProvider } from "@/components/theme-provider";
import "./globals.css";
import { Settings } from "./settings";

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
          "relative flex min-h-screen flex-col",
          "before:absolute before:inset-0 before:bg-cover before:content-['']",
          "before:bg-[url('/bg/marble_sm.webp')] xl:before:bg-[url('/bg/marble_lg.webp')]",
          "dark:before:invert",
          GeistSans.className,
        )}
      >
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <header className="bg-background/50 text-foreground/90 flex h-16 flex-grow-0 flex-row items-center justify-between px-2 shadow-lg backdrop-blur-sm lg:px-4">
            <div className="w-8 flex-grow-0">&nbsp;</div>
            <div className={cn("text-2xl tracking-wide", titleFont.className)}>
              The Time Lit
            </div>
            <div className="w-8 flex-grow-0">
              <Settings />
            </div>
          </header>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}

import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { DM_Serif_Display } from "next/font/google";
import { cn } from "@/lib/utils";
import { ThemeProvider } from "@/components/theme-provider";
import "./globals.css";

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
    <html lang="en">
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
      </head>
      <body className={cn("flex min-h-screen flex-col", GeistSans.className)}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <header className="bg-primary/50 text-primary-foreground/90 flex h-16 flex-grow-0 flex-row items-center justify-center px-2 shadow-lg backdrop-blur-sm lg:px-4">
            <div className={cn("text-2xl tracking-wide", titleFont.className)}>
              The Time Lit
            </div>
          </header>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}

import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "../styles/globals.css";
import { ThemeProvider } from "@/components/themeProvider";
import { SiteHeader } from "@/components/header";
import { NavigationBridge } from "@/components/navigation-bridge";
import { Footer } from "@/components/footer";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Workshop Supply",
  description: "Workshop Supply — tools, materials, essentials",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
          <NavigationBridge /> 
          <div className="min-h-screen bg-background text-foreground">
            <SiteHeader />
              <main className="mx-auto w-full max-w-6xl px-4 py-6">{children}</main>
              <Footer />
              
  </div>
</ThemeProvider>
      </body>
    </html>
  );
}

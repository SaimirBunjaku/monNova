import type { Metadata } from "next";
import { Inter, Plus_Jakarta_Sans } from "next/font/google";
import { AppSplashDismiss } from "@/components/app-splash-dismiss";
import { AppSplashShell } from "@/components/app-splash-shell";
import { CartProvider } from "@/components/cart-provider";
import "./globals.css";

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["700", "800"],
  variable: "--font-plus-jakarta",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "monNova Store",
  description: "A modern e-commerce storefront built with Next.js",
};

const SPLASH_BOOT_SCRIPT = `
(function () {
  try {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    var doc = document.documentElement;
    var body = document.body;
    doc.classList.add("nova-splash-pending");
    var scrollbarWidth = window.innerWidth - doc.clientWidth;
    if (scrollbarWidth > 0) {
      doc.style.setProperty("--nova-scrollbar-width", scrollbarWidth + "px");
      body.style.paddingRight = scrollbarWidth + "px";
    }
  } catch (e) {}
})();
`;

const SPLASH_CRITICAL_CSS = `
  html.nova-splash-pending { overflow: hidden; }
  html.nova-splash-pending #nova-splash { display: flex !important; }
  #nova-splash { display: none; }
  body { background-color: #fafafb; }
`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <style dangerouslySetInnerHTML={{ __html: SPLASH_CRITICAL_CSS }} />
      </head>
      <body className={`${plusJakarta.variable} ${inter.variable} antialiased`}>
        <script dangerouslySetInnerHTML={{ __html: SPLASH_BOOT_SCRIPT }} />
        <div id="nova-app">
          <CartProvider>{children}</CartProvider>
        </div>
        <AppSplashShell />
        <AppSplashDismiss />
      </body>
    </html>
  );
}

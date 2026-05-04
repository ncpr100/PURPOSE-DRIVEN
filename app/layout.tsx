import type { Metadata } from "next";
import { Cinzel, DM_Sans } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/layout/providers";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

const cinzel = Cinzel({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  variable: "--font-display",
  display: "swap",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  variable: "--font-body",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Kḥesed-tek Church Management Systems",
  description:
    "Sistema completo de gestión para iglesias con analíticas inteligentes",
  manifest: `/manifest.json?v=1.1.0&t=${Date.now()}`,
  applicationName: "Kḥesed-tek v1.1.0",
  icons: {
    icon: "/logo.png?v=2025",
    apple: "/logo.png?v=2025",
    shortcut: "/logo.png?v=2025",
  },
  other: {
    "cache-control": "no-cache, no-store, must-revalidate",
    pragma: "no-cache",
    expires: "0",
    "mobile-web-app-capable": "yes",
    "mobile-web-app-status-bar-style": "default",
  },
};

export function generateViewport() {
  return {
    themeColor: "#F0B83C",
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
  };
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  return (
    // data-theme="dark" server-side so CSS tokens arrive correct on first byte.
    // NO inline style prop — backgrounds are governed by the <style> tag below
    // so CSS cascade (and theme toggling) work correctly without any JS cleanup.
    // suppressHydrationWarning lets next-themes reconcile on client silently.
    <html lang="es" data-theme="dark" suppressHydrationWarning>
      <head>
        {/*
          Critical CSS — render-blocking <style> applied before any external
          stylesheet.  Sets html background for both themes so the browser never
          shows a white flash.  Using a <style> rule (not inline style attr) means
          the CASCADE is respected: when next-themes toggles data-theme the rule
          html[data-theme="light"] fires automatically — no JS cleanup required.
          This resolves the inline-style specificity issue flagged in PR #67 review.
        */}
        <style
          dangerouslySetInnerHTML={{
            __html: `html{background:#05080F;color-scheme:dark;}html[data-theme="light"]{background:#F0F2F5;color-scheme:light;}`,
          }}
        />
        {/*
          Anti-FOUC inline script — runs synchronously BEFORE any CSS or React.
          Background is handled by the <style> tag above; script only needs to:
            1. Read 'cosmos-theme' from localStorage (new key — old 'theme' key ignored).
            2. Set data-theme='light' when user has a saved light preference.
            3. Add no-fouc ONLY on the dark→light flip to suppress the 0.2 s CSS
               transition that would animate the background switch visibly.
            4. Remove no-fouc on window.load (React + next-themes fully hydrated
               by then; ~200 ms — double-rAF at ~33 ms was too early).
          Dark users never get no-fouc — all animations work from first load.
        */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var el=document.documentElement;var t=localStorage.getItem('cosmos-theme');if(t==='light'){el.classList.add('no-fouc');el.setAttribute('data-theme','light');var rm=function(){el.classList.remove('no-fouc')};window.addEventListener('load',rm,{once:true});setTimeout(rm,800)}}catch(e){}})()`,
          }}
        />
        <script src="/cache-invalidation.js" defer></script>
      </head>
      <body className={`${cinzel.variable} ${dmSans.variable} font-sans`}>
        <Providers session={session}>{children}</Providers>
      </body>
    </html>
  );
}

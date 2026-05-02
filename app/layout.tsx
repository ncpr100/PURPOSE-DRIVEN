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
    // style/data-theme set server-side so the HTML arrives with correct dark background.
    // suppressHydrationWarning allows next-themes to differ on client without error.
    <html
      lang="es"
      data-theme="dark"
      style={
        { background: "#05080F", colorScheme: "dark" } as React.CSSProperties
      }
      suppressHydrationWarning
    >
      <head>
        {/*
          Anti-FOUC inline script — runs synchronously BEFORE any CSS or React loads.
          Strategy:
            1. Server already sends data-theme="dark" + bg #05080F (correct default).
            2. Script ONLY runs when user has explicitly saved light/Sunshine preference
               under storageKey 'cosmos-theme' (ignores stale 'theme' key from old sessions).
            3. no-fouc added ONLY on the dark→light flip path to suppress the 0.2 s CSS
               transition that would otherwise animate the background change visibly.
            4. no-fouc removed on window 'load' event — ensures React + next-themes are
               fully hydrated before transitions re-enable (fixes residual flash; hydration
               takes ~200 ms but double-rAF only waited ~33 ms).
            5. Dark users (the default) never get no-fouc → animations work from first load.
        */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var el=document.documentElement;var t=localStorage.getItem('cosmos-theme');if(t==='light'){el.classList.add('no-fouc');el.setAttribute('data-theme','light');el.style.background='#F0F2F5';el.style.colorScheme='light';var rm=function(){el.classList.remove('no-fouc')};window.addEventListener('load',rm,{once:true});setTimeout(rm,800)}}catch(e){}})()`
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

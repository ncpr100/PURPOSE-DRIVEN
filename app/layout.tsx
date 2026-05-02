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
      style={{ background: '#05080F', colorScheme: 'dark' } as React.CSSProperties}
      suppressHydrationWarning
    >
      <head>
        {/*
          Anti-FOUC inline script — runs synchronously BEFORE any CSS or React loads.
          Strategy:
            1. Adds 'no-fouc' class → disables all CSS transitions so nothing animates in
            2. Only overrides when user has chosen light/Sunshine theme (dark is already set server-side)
            3. Removes 'no-fouc' after first paint via requestAnimationFrame double-frame trick
          This completely eliminates:
            - White body flash (html now has server-side bg + min-height:100dvh in CSS)
            - Transition animation from white→dark on load
            - Logo swap flash (CSS dual-image approach handles logo, no JS needed)
        */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var el=document.documentElement;el.classList.add('no-fouc');var t=localStorage.getItem('theme');if(t==='light'){el.setAttribute('data-theme','light');el.style.background='#F0F2F5';el.style.colorScheme='light'}requestAnimationFrame(function(){requestAnimationFrame(function(){el.classList.remove('no-fouc')})})}catch(e){}})()`,
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

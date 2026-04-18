
import type { Metadata } from "next"
import { Cinzel, DM_Sans } from "next/font/google"
import "./globals.css"
import { Providers } from "@/components/layout/providers"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"

const cinzel = Cinzel({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  variable: "--font-display",
  display: "swap",
})

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  variable: "--font-body",
  display: "swap",
})

export const metadata: Metadata = {
  title: "Kḥesed-tek Church Management Systems",
  description: "Sistema completo de gestión para iglesias con analíticas inteligentes",
  manifest: `/manifest.json?v=1.1.0&t=${Date.now()}`,
  applicationName: "Kḥesed-tek v1.1.0",
  icons: {
    icon: "/logo.png?v=2025",
    apple: "/logo.png?v=2025",
    shortcut: "/logo.png?v=2025",
  },
  other: {
    'cache-control': 'no-cache, no-store, must-revalidate',
    'pragma': 'no-cache',
    'expires': '0',
    'mobile-web-app-capable': 'yes',
    'mobile-web-app-status-bar-style': 'default',
  },
}

export function generateViewport() {
  return {
    themeColor: "#F0B83C",
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
  }
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getServerSession(authOptions)

  return (
    <html lang="es" suppressHydrationWarning>
      <head>
        <script src="/cache-invalidation.js" defer></script>
      </head>
      <body className={`${cinzel.variable} ${dmSans.variable} font-sans`}>
        <Providers session={session}>
          {children}
        </Providers>
      </body>
    </html>
  )
}

import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/Providers";
import { ThemeProvider } from "@/components/ThemeProvider";

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  variable: "--font-montserrat",
  display: "swap",
});

const BASE_URL = "https://kenyayouthclimatehub.org";

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),

  title: {
    default: "Kenya Youth Climate Hub — Youth-led Climate Action",
    template: "%s | Kenya Youth Climate Hub",
  },

  description:
    "KYCH is Kenya's national platform connecting young people (15–35) to climate finance, skills, policy spaces, and innovation opportunities across all 47 counties. Grants, fellowships, events, resources and tools — all in one place.",

  keywords: [
    "Kenya Youth Climate Hub",
    "KYCH",
    "youth climate action Kenya",
    "climate funding Kenya",
    "climate grants Kenya",
    "youth innovation Kenya",
    "climate fellowships Kenya",
    "Youth Climate Innovation Challenge",
    "Afosi",
    "climate resources Kenya",
    "green startups Kenya",
    "climate events Kenya",
    "climate policy Kenya",
    "sustainable development Kenya",
    "Flarehub Kenya",
  ],

  authors: [{ name: "Kenya Youth Climate Hub", url: BASE_URL }],
  creator: "Kenya Youth Climate Hub",
  publisher: "Afosi — Action for Sustainability Initiative",

  category: "Climate Action, Youth Development, Sustainability",

  openGraph: {
    type: "website",
    locale: "en_KE",
    url: BASE_URL,
    siteName: "Kenya Youth Climate Hub",
    title: "Kenya Youth Climate Hub — Youth-led Climate Action",
    description:
      "Kenya's national platform connecting young people to climate finance, skills, policy spaces, and innovation opportunities across all 47 counties.",
    images: [
      {
        url: "/kych_logo.png",
        width: 1200,
        height: 630,
        alt: "Kenya Youth Climate Hub",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "Kenya Youth Climate Hub — Youth-led Climate Action",
    description:
      "Kenya's national platform connecting young people to climate finance, skills, policy spaces, and innovation opportunities.",
    images: ["/kych_logo.png"],
    creator: "@KYCHKenya",
    site: "@KYCHKenya",
  },

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },

  icons: {
    icon: [
      { url: "/logo.png", type: "image/png" },
    ],
    shortcut: "/logo.png",
    apple: "/logo.png",
  },

  manifest: "/site.webmanifest",

  alternates: {
    canonical: BASE_URL,
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${montserrat.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        {/* Geo tags for Kenya */}
        <meta name="geo.region" content="KE" />
        <meta name="geo.placename" content="Nairobi, Kenya" />
        <meta name="geo.position" content="-1.286389;36.817223" />
        <meta name="ICBM" content="-1.286389, 36.817223" />
      </head>
      <body className="min-h-full flex flex-col" suppressHydrationWarning>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
          <Providers>
            {children}
          </Providers>
        </ThemeProvider>
      </body>
    </html>
  );
}

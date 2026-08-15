import type { Metadata } from "next";
import { Cormorant_Garamond, DM_Sans } from "next/font/google";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { LocalBusinessSchema } from "@/components/LocalBusinessSchema";
import { siteConfig } from "@/data/site";
import { absoluteUrl, DEFAULT_OG_IMAGE } from "@/lib/seo";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  subsets: ["latin", "latin-ext"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-cormorant",
  display: "swap",
});

const dmSans = DM_Sans({
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-dm-sans",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: "Stoły Loftowe na Wymiar Rzeszów | Stolmax – Jasionka, Podkarpacie",
    template: "%s | Stolmax – Stoły Loftowe Rzeszów",
  },
  description:
    "Stolmax - producent stołów loftowych na wymiar w Jasionce koło Rzeszowa. Stoły z laminatu, forniru i forniru dębowego. Stoły Podkarpacie - hurt i detal od 2008 roku.",
  applicationName: siteConfig.name,
  authors: [{ name: siteConfig.legalName, url: siteConfig.url }],
  creator: siteConfig.legalName,
  publisher: siteConfig.legalName,
  category: "Furniture manufacturing",
  keywords: [
    "stoły loftowe Rzeszów",
    "stoły loftowe na wymiar Jasionka",
    "stoły Podkarpacie",
    "stoły na wymiar Rzeszów",
    "producent stołów loftowych",
    "stoły industrialne",
  ],
  alternates: {
    canonical: absoluteUrl("/"),
    languages: {
      "pl-PL": absoluteUrl("/"),
    },
  },
  openGraph: {
    type: "website",
    locale: "pl_PL",
    url: siteConfig.url,
    siteName: siteConfig.name,
    title: "Stoły Loftowe na Wymiar – Rzeszów i Podkarpacie | Stolmax",
    description: siteConfig.description,
    images: [
      {
        url: absoluteUrl(DEFAULT_OG_IMAGE),
        alt: `${siteConfig.name} – stoły loftowe na wymiar`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Stoły Loftowe na Wymiar – Rzeszów i Podkarpacie | Stolmax",
    description: siteConfig.description,
    images: [absoluteUrl(DEFAULT_OG_IMAGE)],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  formatDetection: {
    telephone: true,
    email: true,
    address: true,
  },
  icons: {
    icon: [{ url: "/favicon.png", type: "image/png" }],
    apple: [{ url: "/favicon.png", type: "image/png" }],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pl" className={`${cormorant.variable} ${dmSans.variable}`}>
      <body className="min-h-screen overflow-x-hidden antialiased">
        <LocalBusinessSchema />
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}

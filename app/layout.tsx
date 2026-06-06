import type { Metadata } from "next";
import { GoogleAnalytics } from "@next/third-parties/google";
import { brand } from "./data";
import "./globals.css";
import { seoKeywords, siteUrl } from "@/lib/seo";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Gifted-Faith Global Ventures",
    template: "%s | Gifted-Faith Global Ventures",
  },
  description:
    "Professional travel, visa assistance, appointment booking, itinerary planning, reservations, document upload, and application tracking support.",
  keywords: seoKeywords,
  alternates: {
    canonical: "/",
  },
  icons: {
    icon: [{ url: "/logo.png", type: "image/png" }],
    apple: [{ url: "/logo.png", type: "image/png" }],
  },
  openGraph: {
    type: "website",
    locale: "en_NG",
    url: siteUrl,
    siteName: "Gifted-Faith Global Ventures",
    title: "Gifted-Faith Global Ventures",
    description:
      "Visa assistance, study visa support, tourism travel planning, business travel support, reservations, and document support in Nigeria.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Gifted-Faith Global Ventures travel and visa support",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Gifted-Faith Global Ventures",
    description:
      "Professional visa assistance, travel planning, and document support in Nigeria.",
    images: ["/og-image.jpg"],
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
};

const travelAgencyJsonLd = {
  "@context": "https://schema.org",
  "@type": "TravelAgency",
  name: brand.name,
  url: siteUrl,
  logo: `${siteUrl}/logo.png`,
  image: `${siteUrl}/logo.png`,
  slogan: brand.slogan,
  description:
    "Travel agency in Nigeria offering visa assistance, UK visa support, Canada visa assistance, study visa support, tourism travel planning, business travel support, reservations, and document support.",
  telephone: brand.phone,
  email: brand.email,
  address: {
    "@type": "PostalAddress",
    streetAddress: brand.address,
    addressCountry: "NG",
  },
  areaServed: ["Nigeria", "United Kingdom", "Canada", "United States", "Schengen Area"],
  serviceType: [
    "Visa assistance",
    "UK visa assistance",
    "Canada visa assistance",
    "Study visa support",
    "Tourism travel planning",
    "Business travel support",
    "Document support",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(travelAgencyJsonLd) }}
        />
        {children}
        <GoogleAnalytics gaId="G-DWB66M7D0C" />
      </body>
    </html>
  );
}

import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Gifted-Faith Global Ventures",
    template: "%s | Gifted-Faith Global Ventures",
  },
  description:
    "Professional travel, visa assistance, appointment booking, itinerary planning, reservations, document upload, and application tracking support.",
  keywords: [
    "visa assistance",
    "travel agency",
    "UK visa support",
    "Canada visa assistance",
    "USA appointment",
    "travel planning",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

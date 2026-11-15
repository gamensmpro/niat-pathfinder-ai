
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "PathFinder AI | Discover Your Future in Tech",
  description:
    "Discover technology careers, recommended skills and a personalized 90-day learning roadmap with AI."
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

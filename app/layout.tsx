import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "FCM Archery Score",
  description: "Score app voor boogschieten",
  viewport: "width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="nl">
      <body className="antialiased">{children}</body>
    </html>
  );
}
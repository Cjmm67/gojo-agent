import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Gojo-sensei — Your Anime Guide",
  description: "Chat with Satoru Gojo about anime!",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Dual-Video RAG Chatbot",
  description: "Compare two social videos with a grounded, citing RAG assistant.",
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

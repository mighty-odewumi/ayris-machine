import type { Metadata } from "next";
import { UnifrakturMaguntia } from "next/font/google";
import "./globals.css";

const unifrak = UnifrakturMaguntia({
  variable: "--font-unifrak",
  subsets: ["latin"],
  weight: "400"
})

export const metadata: Metadata = {
  title: "Ayris Machine",
  description: "Ayris Beauty Machine",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        // className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        className={`${unifrak.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}

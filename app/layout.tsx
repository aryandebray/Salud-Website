import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import Header from "./components/Header";
import "./globals.css";
import { headers } from 'next/headers';

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-playfair-display",
});

export const metadata: Metadata = {
  title: "Salud - Authentic Italian Restaurant",
  description: "Experience authentic Italian cuisine at Salud. Make your reservations today.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const headersList = headers();
  const pathname = headersList.get('x-pathname') || '';
  const isAdminPage = pathname.startsWith('/admin');

  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
      <body className={`font-sans ${!isAdminPage ? 'bg-white' : ''}`}>
        {!isAdminPage && <Header />}
        {children}
      </body>
    </html>
  );
} 
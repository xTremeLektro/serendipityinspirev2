import type { Metadata } from 'next';
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import LayoutClient from '@/components/LayoutClient'; import ThemeProvider from '@/components/ThemeProvider';
import Footer from '@/components/Footer';

const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"], }); const geistSans = Geist({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Serendipity Inspire v2",
  description: "Portal de Interiorismo",
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en"> <head>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css" />
      </head>
      <body className="bg-white text-black dark:bg-black dark:text-white"
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        suppressHydrationWarning={true}
      >
        <ThemeProvider>
          <LayoutClient>{children}</LayoutClient>
        </ThemeProvider>
        <Footer />
      </body>
    </html>
  );
}

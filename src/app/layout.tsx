import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AppProvider } from "./context/AppContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "FivoPay Ethical Banking - BaaS Platform",
  description: "Ethical Banking as a Service platform with comprehensive customer, employee, and authentication management",
  keywords: "Ethical banking, Sharia compliant, BaaS, Banking as a Service, Halal finance",
  icons: {
    icon: [
      {
        url: '/logo.jpeg',
        sizes: 'any',
        type: 'image/jpeg',
      },
    ],
    apple: [
      {
        url: '/logo.jpeg',
        sizes: 'any',
        type: 'image/jpeg',
      },
    ],
  },
  openGraph: {
    title: "FivoPay Ethical Banking - BaaS Platform",
    description: "Ethical Banking as a Service platform with comprehensive customer, employee, and authentication management",
    images: [
      {
        url: '/logo.jpeg',
        width: 1200,
        height: 630,
        alt: 'FivoPay Ethical Banking Platform',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: "FivoPay Ethical Banking - BaaS Platform",
    description: "Ethical Banking as a Service platform with comprehensive customer, employee, and authentication management",
    images: ['/logo.jpeg'],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        suppressHydrationWarning
      >
        <AppProvider>
          {children}
        </AppProvider>
      </body>
    </html>
  );
}

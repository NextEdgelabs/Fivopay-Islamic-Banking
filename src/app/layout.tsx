import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { AppProvider } from "./context/AppContext";
import { Providers } from "./providers";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "FivoPay Digital Banking - BaaS Platform",
  description: "Digital Banking as a Service platform with comprehensive customer, employee, and authentication management",
  keywords: "Digital banking, modern banking, BaaS, Banking as a Service, fintech platform",
  metadataBase: new URL('http://localhost:3000'),
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
    title: "FivoPay Digital Banking - BaaS Platform",
    description: "Digital Banking as a Service platform with comprehensive customer, employee, and authentication management",
    url: "https://fivopay.com",
    siteName: "FivoPay",
    images: [
      {
        url: "/logo.jpeg",
        width: 1200,
        height: 630,
        alt: 'FivoPay Digital Banking Platform',
      }
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: "FivoPay Digital Banking - BaaS Platform",
    description: "Digital Banking as a Service platform with comprehensive customer, employee, and authentication management",
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
        className={`${inter.variable} ${jetbrainsMono.variable} antialiased`}
        suppressHydrationWarning
      >
        <Providers>
          <AppProvider>
            {children}
          </AppProvider>
        </Providers>
      </body>
    </html>
  );
}

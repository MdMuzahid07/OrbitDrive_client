import type { Metadata } from "next";
import { Orbitron } from "next/font/google";
import ReduxProvider from "../provider/ReduxProvider";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
//@ts-ignore
import "./globals.css";

const orbitron = Orbitron({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  variable: "--font-orbitron",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "OrbitDrive - Secure Cloud Storage",
    template: "%s | OrbitDrive",
  },
  description:
    "Store and manage your files securely with OrbitDrive. Access your data from anywhere.",
  keywords: ["cloud storage", "file storage", "secure storage", "OrbitDrive"],
  authors: [{ name: "OrbitDrive Team" }],

  openGraph: {
    title: "OrbitDrive - Secure Cloud Storage",
    description: "Store and manage your files securely.",
    type: "website",
    locale: "en_US",
    siteName: "OrbitDrive",
  },

  twitter: {
    card: "summary_large_image",
    title: "OrbitDrive - Secure Cloud Storage",
    description: "Store and manage your files securely.",
  },

  robots: {
    index: true,
    follow: true,
  },

  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${orbitron.variable} font-orbitron antialiased`}>
        <ReduxProvider>{children}</ReduxProvider>
      </body>
    </html>
  );
}

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Hamal Challenge JJ",
  description: "A simple app to demonstrate the integration of Truora's Identity Verification API, allowing users to verify their identity through a seamless and secure process. This application showcases the use of Truora's API to enhance user authentication and provide a smooth verification experience.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} h-full antialiased`}
    >
      <body className="bg-background text-on-background font-body-md min-h-screen flex flex-col antialiased font-inter">{children}</body>
    </html>
  );
}

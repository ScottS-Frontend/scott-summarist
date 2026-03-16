import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ReduxProvider } from "@/store/Provider";
import { Roboto } from 'next/font/google';

const roboto = Roboto ({
  subsets: ['latin'],
  weight: ['100', '300', '400', '500', '700', '900'],
  variable: '--font-roboto',
})

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Summarist - Summarize Books",
  description: "Summarize books in minutes",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={roboto.className}>
        <ReduxProvider>{children}</ReduxProvider>
      </body>
    </html>
  );
}
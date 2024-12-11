import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import CustomSessionProvider from "./ClientComponents/SessionProvider"  ; 
import   {Toaster}  from 'react-hot-toast'

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Alpha - Your next gen Chat",
  description: "Alpha is a app where you can chat with friends and share files with it",
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
      >
                <CustomSessionProvider>
                <Toaster
                  position="top-center"
                  reverseOrder={false}
                />
        {children}
               </CustomSessionProvider>
      </body>
    </html>
  );
}

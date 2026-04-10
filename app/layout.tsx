import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Daniel Guerra - Full Stack Developer",
  description:
    "Portfolio de Daniel Guerra - Desarrollador Full Stack especializado en React, Node.js y TypeScript",
  icons: {
    icon: "/icon",
    shortcut: "/icon",
    apple: "/icon",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const backendOrigin = (() => {
    try {
      const url = process.env.NEXT_PUBLIC_BACKEND_URL;
      return url ? new URL(url).origin : null;
    } catch {
      return null;
    }
  })();

  return (
    <html lang="es" suppressHydrationWarning>
      <head>
        {backendOrigin && (
          <>
            <link rel="preconnect" href={backendOrigin} />
            <link rel="dns-prefetch" href={backendOrigin} />
          </>
        )}
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}

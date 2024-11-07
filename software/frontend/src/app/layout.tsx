import type { Metadata } from "next";
import "./globals.css";
import Head from "next/head";

export const metadata: Metadata = {
  title: "MyoSense",
  description: "Muscle Functional Weakness Detection",
  icons: {
    icon: "/Logo.png"
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <Head>
        <link rel="icon" href="/Logo-half.jpg" />
      </Head>
      <body
        className={`antialiased !font-rubik`}
      >
        {children}
      </body>
    </html>
  );
}

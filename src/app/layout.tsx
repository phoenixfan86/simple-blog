import type { Metadata } from "next";
import { Geist_Mono, Poppins } from "next/font/google";
import ReduxProvider from "@/lib/redux/ReduxProvider";
import "./globals.css";
import './globalicon.css';


const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "800"],
  variable: "--font-poppins",
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Simple Blog",
  description: "Simple Blog - built with Nextjs, FirebaseDB, Redux and ZOD",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${poppins.variable} ${geistMono.variable} antialiased`}
      >
        <ReduxProvider>
          {children}
        </ReduxProvider>

      </body>
    </html>
  );
}

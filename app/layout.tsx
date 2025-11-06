import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import HydrationWrapper from "./components/HydrationWrapper";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Ayokunle Ogunfidodo's - Portfolio",
  description: "Personal portfolio showcasing my projects and skills",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth" suppressHydrationWarning>
      <body className={`${inter.className} antialiased`}>
        {" "}
        <HydrationWrapper>{children} </HydrationWrapper>
      </body>
    </html>
  );
}

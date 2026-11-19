import "./globals.css";
import ChatWidget from "./components/ChatWidget";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import HydrationWrapper from "./components/HydrationWrapper";
import { Analytics } from "@vercel/analytics/next";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Ayokunle Ogunfidodo's - Portfolio",
  metadataBase: new URL("https://ogunfidodoayokunle.vercel.app/"),
  description: "Personal portfolio showcasing my projects and skills",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth" suppressHydrationWarning>
      <head>
        <script
          // Applies the saved/system theme before paint so there's no
          // light-then-dark flash (the --dark class also drives the CSS
          // variable tokens in globals.css, not just `dark:` utilities).
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('theme');var d=t?t==='dark':window.matchMedia('(prefers-color-scheme: dark)').matches;document.documentElement.classList.toggle('dark',d);}catch(e){}})();`,
          }}
        />
      </head>
      <body className={`${inter.className} antialiased`}>
        {" "}
        <HydrationWrapper>{children} </HydrationWrapper>
        <ChatWidget />
        <Analytics />
      </body>
    </html>
  );
}

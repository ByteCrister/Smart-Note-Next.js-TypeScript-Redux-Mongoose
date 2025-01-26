import type { Metadata } from "next";
import "./globals.css";
import ClientProvider from "./ClientProvider";
import { Roboto, Lora, Open_Sans } from "next/font/google";

const roboto = Roboto({
  weight: ["400", "700"], 
  subsets: ["latin"],
});

const lora = Lora({
  weight: ["400", "700"],
  subsets: ["latin"],
});

const openSans = Open_Sans({
  weight: ["400", "600"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Smart Note",
  description: "Smart Note | Next.js | Tailwind | Shadcn | Redux",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${roboto.className} ${lora.className} ${openSans.className} antialiased bg-gray-100 h-screen`}
      >
        <ClientProvider>
          {children}
        </ClientProvider>
      </body>
    </html>
  );
}

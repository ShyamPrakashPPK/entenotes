import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import MainNav from "@/components/nav/MainNav";
import "./globals.css";

const poppins = Poppins({ subsets: ["latin"], weight: ["400", "500", "600", "700"] });

export const metadata: Metadata = {
  title: "Notes App",
  description: "A modern note-taking application",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${poppins.className} bg-[#151415] `}>
        <MainNav />
        {children}
      </body>
    </html>
  );
}

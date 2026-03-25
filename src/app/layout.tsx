import type { Metadata } from "next";
import { Cormorant_Garamond, Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-cormorant",
});

export const metadata: Metadata = {
  title: "chocotap — craft chocolate stamp rally",
  description: "日本全国のクラフトチョコレートショップを巡る、やさしいスタンプラリーアプリ",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja" className={`${inter.variable} ${cormorant.variable}`}>
      <body className="bg-pastel min-h-screen">{children}</body>
    </html>
  );
}

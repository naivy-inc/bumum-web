import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://bumom.xyz"),
  title: {
    default: "부맘",
    template: "%s | 부맘",
  },
  description: "부맘 가족 초대 링크",
  openGraph: {
    title: "부맘 가족 초대",
    description: "부맘에서 가족 연결을 완료해 주세요.",
    siteName: "부맘",
    type: "website",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#faf9f4",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}

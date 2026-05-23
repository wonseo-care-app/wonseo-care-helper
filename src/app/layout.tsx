import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import "./globals.css";

export const metadata: Metadata = {
  title: "wonseo #3",
  description: "키워드로 작성하는 어린이집 보육문서 초안 도구",
  applicationName: "wonseo #3",
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    title: "wonseo #3",
    statusBarStyle: "default"
  }
};

export const viewport: Viewport = {
  themeColor: "#fffaf2",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}

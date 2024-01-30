import type { Metadata } from "next";
import { twJoin } from "tailwind-merge";
import { Inter } from "next/font/google";
import { AppProvider } from "@/context";
import { Header, ContentWrapper } from "@/components/layout/main-layout";
import "@mysten/dapp-kit/dist/index.css";
import "./globals.css";
import "./overrideWalletDialog.css";

export const metadata: Metadata = {
  title: "Bot SUI",
  description: "Bot SUI",
};

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en">
      <body className={twJoin(inter.variable)}>
        <AppProvider>
          <Header />
          <div
            className={twJoin(
              "font-inter",
              "h-[calc(100vh-64px)]",
              "relative w-screen mt-16"
            )}
          >
            <ContentWrapper>{children}</ContentWrapper>
          </div>
        </AppProvider>
      </body>
    </html>
  );
}

interface RootLayoutProps {
  children: React.ReactNode;
}

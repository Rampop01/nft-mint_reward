import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Web3ModalStyles from "./components/Web3ModalStyles";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "NFT Creator Rewards",
  description: "Mint NFTs and earn creator tokens as rewards",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Web3ModalStyles />
        {children}
      </body>
    </html>
  );
}

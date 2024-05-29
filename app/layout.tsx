"use client";

import { Inter } from "next/font/google";
import "./globals.css";
import "@near-wallet-selector/modal-ui/styles.css";

import { MintbaseWalletContextProvider } from "@mintbase-js/react";
import { Suspense } from "react";

const inter = Inter({ subsets: ["latin"] });

const MintbaseWalletSetup = {
  // contractAddress: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS || "hellovirtualworld.mintspace2.testnet",
  network: process.env.NEXT_PUBLIC_NETWORK || "mainnet",
  callbackUrl: process.env.NEXT_PUBLIC_CALLBACK_URL || (typeof window !== "undefined" ? window.location.origin : ""),
  failureUrl:
    process.env.NEXT_PUBLIC_FAILURE_URL ||
    (typeof window !== "undefined" ? `${window.location.origin}?success=false` : ""),
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <MintbaseWalletContextProvider {...MintbaseWalletSetup}>
      <html lang="en">
        <body className={inter.className}>
          <div className="flex flex-1 flex-col min-h-screen text-gray-500 gradient w-full  h-full flex justify-center items-center bold text-white">
            <Suspense fallback={<div>Loading...</div>}>{children}</Suspense>
          </div>
        </body>
      </html>
    </MintbaseWalletContextProvider>
  );
}

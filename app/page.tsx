"use client";
import ChallengeCreator from "@/components/ChallengeCreator";
import Form from "@/components/forms/NFTForm";
import { NetworkToggle } from "@/components/network-toggle";
import { Network } from "@mintbase-js/sdk";
import Image from "next/image";
import { Suspense, useState } from "react";

import { useSearchParams } from "next/navigation";

export default function Home() {
  const [network, setNetwork] = useState<Network>("testnet");
  const params = useSearchParams();
  const txHash = params.get("transactionHashes");
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div>
        <NetworkToggle network={network} setNetwork={setNetwork} />
        <h1 className="text-3xl text-center font-bold mb-10">Create Your NFT Challenge</h1>
        <ChallengeCreator network={network} />

        {txHash != null && (
          <div>
            Congrats! Youyre NFT Challenge contract was made in transaction {txHash}. You can view the transaction
            <a href={`https://testnet.nearblocks.io/txns/${txHash}`} target="_blank" rel="noreferrer">
              here
            </a>
          </div>
        )}
      </div>
    </main>
  );
}

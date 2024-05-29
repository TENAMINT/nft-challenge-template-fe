"use client";
import ChallengeCreator from "@/components/ChallengeCreator";
import Form from "@/components/forms/NFTForm";
import { NetworkToggle } from "@/components/network-toggle";
import { Network } from "@mintbase-js/sdk";
import Image from "next/image";
import { useState } from "react";

import { useSearchParams } from "next/navigation";
import { useMbWallet } from "@mintbase-js/react";

export default function Home() {
  const [network, setNetwork] = useState<Network>("mainnet");
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div>
        <NetworkToggle network={network} setNetwork={setNetwork} />
        <h1 className="text-3xl text-center font-bold my-5">Create Your NFT Challenge</h1>
        <ChallengeCreator network={network} />
      </div>
    </main>
  );
}

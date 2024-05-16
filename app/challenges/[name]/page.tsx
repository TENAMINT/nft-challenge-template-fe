"use client";
import ChallengeCreator from "@/components/ChallengeCreator";
import Form from "@/components/forms/NFTForm";
import { NetworkToggle } from "@/components/network-toggle";
import { Network } from "@mintbase-js/sdk";
import Image from "next/image";
import { useState } from "react";

import { useParams, useSearchParams } from "next/navigation";
import { useMbWallet } from "@mintbase-js/react";
import Link from "next/link";

export default function Home() {
  const [network, setNetwork] = useState<Network>("testnet");
  const params = useParams<{ name: string }>();
  const txHash = useSearchParams().get("transactionHashes");
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div>
        Congrats on creating your new challenge,{" "}
        <a
          href={`https://testnet.nearblocks.io/address/${params.name}.supreme-squirrel.testnet`}
          target="_blank"
          rel="noreferrer"
          className="text-blue-500 underline"
        >
          {params.name}
        </a>
        ! You can view the creation challenge{" "}
        <a
          href={`https://testnet.nearblocks.io/txns/${txHash}`}
          target="_blank"
          rel="noreferrer"
          className="text-blue-500 underline"
        >
          here
        </a>
        and create a new challenge{" "}
        <Link className="text-blue-500 underline" href={"/"}>
          now
        </Link>
        !
      </div>
    </main>
  );
}

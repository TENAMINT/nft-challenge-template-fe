"use client";
import ChallengeCreator from "@/components/ChallengeCreator";
import Form from "@/components/forms/NFTForm";
import Image from "next/image";
import { useState } from "react";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div>
        <h1 className="text-3xl text-center font-bold mb-10">Create Your NFT Challenge</h1>
        <ChallengeCreator />
      </div>
    </main>
  );
}

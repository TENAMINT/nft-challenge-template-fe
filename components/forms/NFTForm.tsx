/**
 * This code was generated by v0 by Vercel.
 * @see https://v0.dev/t/wmouMaCO9ek
 * Documentation: https://v0.dev/docs#integrating-generated-code-into-your-nextjs-app
 */

/** Add fonts into your Next.js project:

import { Inter } from 'next/font/google'

inter({
  subsets: ['latin'],
  display: 'swap',
})

To read more about using these font, please visit the Next.js documentation:
- App Directory: https://nextjs.org/docs/app/building-your-application/optimizing/fonts
- Pages Directory: https://nextjs.org/docs/pages/building-your-application/optimizing/fonts
**/
"use client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Dispatch, SetStateAction, useState } from "react";
import { NFTContract } from "@/types/nft";
import { fetchGraphQl } from "@mintbase-js/data";
import { Progress } from "../ChallengeCreator";
import { Network } from "@mintbase-js/sdk";
import { fetchNftContract } from "@/toolkit/graphql";

export default function NFTForm({
  rewardNft,
  setRewardNft,
  network,
  name,
  setName,
  desc,
  setDesc,
  idPrefix,
  setIdPrefix,
  mediaLink,
  setMediaLink,
}: {
  rewardNft: NFTContract | undefined;
  setRewardNft: Dispatch<SetStateAction<NFTContract | undefined>>;
  name: string | undefined;
  setName: Dispatch<SetStateAction<string | undefined>>;
  desc: string | undefined;
  setDesc: Dispatch<SetStateAction<string | undefined>>;
  idPrefix: string | undefined;
  setIdPrefix: Dispatch<SetStateAction<string | undefined>>;
  mediaLink: string | undefined;
  setMediaLink: Dispatch<SetStateAction<string | undefined>>;
  network: Network;
}) {
  const [rewardNftId, setRewardNftId] = useState(rewardNft?.id || "");

  const onSubmit = async () => {
    if (!rewardNftId || !name || !idPrefix || !desc) {
      alert("Please fill all necessary details.");
      return;
    }

    const nft = await fetchNftContract(rewardNftId, network);
    if (nft == null) {
      alert("NFT not found");
      return;
    }

    setRewardNft(nft);
  };

  return (
    <div className="mx-auto max-w-md space-y-6">
      <div className="space-y-2 text-left">
        <h2 className="text-xl font-semibold">Choose your reward NFT</h2>
        <p className="text-gray-500 dark:text-gray-400">
          Enter the ID of the NFT you would like to use as a reward for completing the challenge.
        </p>
      </div>
      <div className="space-y-6">
        <div>
          <label htmlFor="nft-id">Challenge Name</label>
          <div className="grid gap-4">
            <div className="space-y-2">
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                id="name"
                placeholder="Enter a name for the challenge"
              />
            </div>
          </div>
        </div>
        <div>
          <label htmlFor="nft-id">Challenge ID Prefix</label>
          <div className="grid gap-4">
            <div className="space-y-2">
              <Input
                value={idPrefix}
                onChange={(e) => setIdPrefix(e.target.value)}
                id="id-prefix"
                placeholder="Enter a prefix for the challenge ID"
              />
            </div>
          </div>
        </div>
        <div>
          <label htmlFor="nft-id">Challenge Description</label>
          <div className="grid gap-4">
            <div className="space-y-2">
              <Input
                value={desc}
                onChange={(e) => setDesc(e.target.value)}
                id="desc"
                placeholder="Enter a description for the challenge"
              />
            </div>
          </div>
        </div>
        <div>
          <label htmlFor="nft-id">Challenge Media Link</label>
          <div className="grid gap-4">
            <div className="space-y-2">
              <Input
                value={mediaLink}
                onChange={(e) => setMediaLink(e.target.value)}
                id="media-link"
                placeholder="An optional media link for the challenge"
              />
            </div>
          </div>
        </div>
        <div>
          <label htmlFor="nft-id">Reward NFT ID</label>
          <div className="grid gap-4">
            <div className="space-y-2">
              <Input
                value={rewardNftId}
                onChange={(e) => setRewardNftId(e.target.value)}
                id="nft-id"
                placeholder="Enter the NFT ID"
              />
            </div>
          </div>
        </div>
        <div className="flex justify-between">
          <Button onClick={onSubmit}>Next</Button>
        </div>
      </div>
    </div>
  );
}

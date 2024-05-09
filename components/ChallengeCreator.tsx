import NFTForm from "@/components/forms/NFTForm";
import Form from "@/components/forms/NFTForm";
import { NFTContract } from "@/types/nft";
import Image from "next/image";
import { useState } from "react";

enum Progress {
  NFTSearch,
  SetChallenges,
}
export default function ChallengeCreator() {
  const [progress, setProgress] = useState<Progress>(Progress.NFTSearch);
  const [nft, setNft] = useState<NFTContract | undefined>(undefined);
  switch (progress) {
    case Progress.NFTSearch:
      return <NFTForm setNft={setNft} />;
  }
}

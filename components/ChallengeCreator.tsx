import NFTForm from "@/components/forms/NFTForm";
import { NFTContract } from "@/types/nft";
import { useEffect, useState } from "react";
import { VictoryConditionsForm } from "./VictoryConditionsForm";
import { TerminationRulesForm } from "./TerminationRulesForm";
import { Button } from "./ui/button";

export enum Progress {
  NFTSearch,
  SetChallenges,
  SetTerminationRules,
  CreateContract,
}

/**
 * Current assumptions:
 * Reward NFT already exists on blockchain
 * Challenge pieces already exist on blockchain
 *
 */
export default function ChallengeCreator() {
  const [progress, setProgress] = useState<Progress>(Progress.NFTSearch);
  const [nft, setNft] = useState<NFTContract | undefined>(undefined);
  const [challengeNfts, setChallengeNfts] = useState<Array<NFTContract>>([]);
  const [terminationDate, setTerminationDate] = useState<Date | undefined>(undefined);
  const [creatorCanEndChallenge, setCreatorCanEndChallenge] = useState(false);
  const [winnerCount, setWinnerCount] = useState(Number.MAX_VALUE);
  const [maxProgress, setMaxProgress] = useState(Progress.NFTSearch);

  useEffect(() => {
    if (nft != null) {
      setProgress(Progress.SetChallenges);
    }
  }, [nft]);

  useEffect(() => {
    if (challengeNfts.length > 0) {
      setProgress(Progress.SetTerminationRules);
    }
  }, [challengeNfts]);

  useEffect(() => {
    if (progress > maxProgress) {
      setMaxProgress(progress);
    }
  }, [progress]);

  const prefix = (
    <div className="flex items-start space-x-4 mb-10">
      {nft?.icon != null && (
        <img
          alt="NFT Icon"
          className="rounded-md"
          height="120"
          src={nft.icon}
          style={{
            aspectRatio: "80/80",
            objectFit: "cover",
          }}
          width="120"
        />
      )}

      <div className={`grid-1 gap-1 ${nft == null ? "hidden" : ""}`}>
        <div className="text-lg font-medium">Reward: {nft?.name}</div>
        {maxProgress >= Progress.SetChallenges && (
          <div className="flex items-center gap-10 text-sm text-gray-500 dark:text-gray-400">
            {/* <AwardIcon className="w-4 h-4" /> */}
            <span>
              {winnerCount == Number.MAX_VALUE ? "Unlimited" : winnerCount} winner{winnerCount > 1 ? "s" : ""}
            </span>
          </div>
        )}
        {challengeNfts.length > 0 && (
          <div className="flex items-center gap-10 text-sm text-gray-500 dark:text-gray-400">
            {/* <PuzzleIcon className="w-4 h-4" /> */}
            <span>
              {challengeNfts.length} Challenge{challengeNfts.length > 1 ? "s" : ""}
            </span>
          </div>
        )}
        {maxProgress >= Progress.SetTerminationRules && (
          <div className="flex items-center gap-10 text-sm text-gray-500 dark:text-gray-400">
            {/* <CalendarDaysIcon className="w-4 h-4" /> */}
            <span>{terminationDate != null ? `Ends on ${terminationDate.toString()}` : `Never ends`}</span>
          </div>
        )}
        {maxProgress >= Progress.SetTerminationRules && (
          <div className="flex items-center gap-10 text-sm text-gray-500 dark:text-gray-400">
            {/* <BoltIcon className="w-4 h-4" /> */}
            <span>Creator can{!creatorCanEndChallenge && "not"} end challenge</span>
          </div>
        )}
      </div>
    </div>
  );

  switch (progress) {
    case Progress.NFTSearch:
      return (
        <div>
          {prefix}
          <NFTForm nft={nft} setNft={setNft} />
        </div>
      );
    case Progress.SetChallenges:
      return (
        <div>
          {prefix}
          <VictoryConditionsForm
            nft={nft!}
            challengeNfts={challengeNfts}
            setChallengeNfts={setChallengeNfts}
            setProgress={setProgress}
            winnerCount={winnerCount}
            setWinnerCount={setWinnerCount}
          />
        </div>
      );
    case Progress.SetTerminationRules:
      return (
        <div>
          {prefix}
          <TerminationRulesForm
            setProgress={setProgress}
            terminationDate={terminationDate}
            setTerminationDate={setTerminationDate}
            creatorCanEndChallenge={creatorCanEndChallenge}
            setCreatorCanEndChallenge={setCreatorCanEndChallenge}
          />
        </div>
      );
    case Progress.CreateContract:
      return (
        <div>
          {prefix}

          <div className="mt-6 flex justify-between">
            <Button onClick={() => setProgress(Progress.SetTerminationRules)} variant="outline">
              Previous
            </Button>
            <Button className="ml-4" onClick={() => setProgress(Progress.CreateContract)}>
              Next
            </Button>
          </div>
        </div>
      );
  }
}

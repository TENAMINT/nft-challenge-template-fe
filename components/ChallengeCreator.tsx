import NFTForm from "@/components/forms/NFTForm";
import { NFTContract } from "@/types/nft";
import { useEffect, useState } from "react";
import { VictoryConditionsForm } from "./forms/VictoryConditionsForm";
import { TerminationRulesForm } from "./forms/TerminationRulesForm";
import { Button } from "./ui/button";
import { Network, execute } from "@mintbase-js/sdk";
import { NearWalletConnector } from "./NearWalletSelector";
import { MintbaseWalletContextProvider, useMbWallet } from "@mintbase-js/react";

export enum Progress {
  NFTSearch,
  SetChallenges,
  SetTerminationRules,
  CreateContract,
  ChallengeCreated,
}

/**
 * Current assumptions:
 * Reward NFT already exists on blockchain
 * Challenge pieces already exist on blockchain
 *
 */
export default function ChallengeCreator({ network }: { network: Network }) {
  const [progress, setProgress] = useState<Progress>(Progress.NFTSearch);
  const [nft, setNft] = useState<NFTContract | undefined>(undefined);
  const [challengeNfts, setChallengeNfts] = useState<Array<NFTContract>>([]);
  const [terminationDate, setTerminationDate] = useState<Date | undefined>(undefined);
  const [creatorCanEndChallenge, setCreatorCanEndChallenge] = useState(false);
  const [winnerCount, setWinnerCount] = useState(Number.MAX_VALUE);
  const [maxProgress, setMaxProgress] = useState(Progress.NFTSearch);
  const { isConnected, selector, connect, activeAccountId } = useMbWallet();

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

  const onSubmit = async () => {
    const wallet = await selector.wallet();
    if (!isConnected) return false;

    const res = await wallet.signAndSendTransaction({
      receiverId: "supreme-squirrel.testnet",
      actions: [
        {
          type: "FunctionCall",
          params: {
            methodName: "create_challenge",
            args: {
              name: `test_challenge_${Math.floor(Math.random() * 1000000)}`,
              challenge_nft: challengeNfts[0].id,
              termination_date: 1,
              winner_limit: 1,
              reward_nft: nft!.id,
            },
            gas: "90000000000000",
            deposit: "4000000000000000000000000",
          },
        },
      ],
    });

    if (res != null) {
      setProgress(Progress.ChallengeCreated);
    }
    // await providers.getTransactionLastResult(outcome);
  };

  const prefix =
    nft?.icon != null ? (
      <div className="flex items-start space-x-4 my-5 ">
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
    ) : null;

  switch (progress) {
    case Progress.NFTSearch:
      return !isConnected ? (
        <div className="flex flex-col items-center justify-center">
          <div className="mb-6">You'll need to connect your NEAR wallet to create a challenge.</div>
          <NearWalletConnector />
        </div>
      ) : (
        <div>
          {prefix}
          <NFTForm nft={nft} setNft={setNft} network={network} />
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
            network={network}
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
            <Button className="ml-4" onClick={onSubmit}>
              Confirm
            </Button>
          </div>
        </div>
      );
    case Progress.ChallengeCreated:
      return (
        <div>
          {prefix}
          <div className="mt-6 flex justify-between">Congrats! You can find your challenge at</div>
        </div>
      );
  }
}

import NFTForm from "@/components/forms/NFTForm";
import { NFTContract, NFTMetaData } from "@/types/nft";
import { useEffect, useState } from "react";
import { VictoryConditionsForm } from "./forms/VictoryConditionsForm";
import { TerminationRulesForm } from "./forms/TerminationRulesForm";
import { Button } from "./ui/button";
import { Network, execute } from "@mintbase-js/sdk";
import { NearWalletConnector } from "./NearWalletSelector";
import { MintbaseWalletContextProvider, useMbWallet } from "@mintbase-js/react";
import { WalletSelector, setupWalletSelector } from "@near-wallet-selector/core";
import { providers } from "near-api-js";
import BigNumber from "bignumber.js";
import RewardNFTForm from "./forms/RewardNFTForm";

export enum Progress {
  ChallengeDetails,
  RewardNFTDetails,
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
  const [progress, setProgress] = useState<Progress>(Progress.ChallengeDetails);
  // Reward Info
  const [rewardNft, setRewardNft] = useState<NFTContract | undefined>(undefined);
  const [rewardTitle, setRewardTitle] = useState<string | undefined>(undefined);
  const [rewardDesc, setRewardDesc] = useState<string | undefined>(undefined);
  const [rewardMediaLink, setRewardMediaLink] = useState<string | undefined>(undefined);

  const [name, setName] = useState<string | undefined>(undefined);
  const [desc, setDesc] = useState<string | undefined>(undefined);
  const [idPrefix, setIdPrefix] = useState<string | undefined>(undefined);
  const [mediaLink, setMediaLink] = useState<string | undefined>(undefined);
  const [challengeNfts, setChallengeNfts] = useState<Array<NFTContract>>([]);
  const [terminationDate, setTerminationDate] = useState<Date | undefined>(undefined);
  const [creatorCanEndChallenge, setCreatorCanEndChallenge] = useState(false);
  const [winnerCount, setWinnerCount] = useState(Number.MAX_SAFE_INTEGER);
  const [maxProgress, setMaxProgress] = useState(Progress.ChallengeDetails);
  const { isConnected, selector, connect, activeAccountId } = useMbWallet();

  useEffect(() => {
    if (rewardNft != null) {
      setProgress(Progress.SetChallenges);
    }
  }, [rewardNft]);

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

    let terminationDateStr = terminationDate?.getTime().toString();
    if (terminationDate == null) {
      terminationDateStr = Number.MAX_SAFE_INTEGER.toString();
    } else {
      terminationDateStr = terminationDateStr + "000000";
    }

    const args = {
      id_prefix: idPrefix, // change
      name,
      description: desc,
      image_link: mediaLink,
      reward_nft: rewardNft!.id,
      challenge_nft_ids: challengeNfts.map((nft) => nft.id),
      // TODO: Convert to nano seconds
      _termination_date_in_ns: terminationDateStr,
      _winner_limit: winnerCount.toString(),
      reward_token_metadata: {
        title: rewardTitle!,
        description: rewardDesc!,
        media: rewardMediaLink!,
      } as NFTMetaData,
    };

    const res = await wallet.signAndSendTransaction({
      receiverId: "tenamint-challenge.near",
      actions: [
        {
          type: "FunctionCall",
          params: {
            methodName: "create_challenge",
            args,
            gas: "90000000000000",
            deposit: "4000000000000000000000000",
          },
        },
      ],
      callbackUrl: `${window.location.origin}/challenges/${idPrefix}`,
    });

    if (res != null) {
      setProgress(Progress.ChallengeCreated);
    }
  };
  console.log(mediaLink, "mediaLink");
  const prefix =
    progress > Progress.ChallengeDetails ? (
      <div className="flex items-start space-x-4 my-5 ">
        {mediaLink != null ? (
          <img
            alt="NFT Icon"
            className="rounded-md"
            height="120"
            src={mediaLink}
            style={{
              aspectRatio: "80/80",
              objectFit: "cover",
            }}
            width="120"
          />
        ) : (
          <img
            alt="NFT Icon"
            className="rounded-md"
            height="120"
            src={rewardNft?.icon}
            style={{
              aspectRatio: "80/80",
              objectFit: "cover",
            }}
            width="120"
          />
        )}
        <div className={`grid-1 gap-1 ${rewardNft == null ? "hidden" : ""}`}>
          <div className="text-lg font-medium">{name}</div>

          <div className="flex items-center gap-10 text-sm text-gray-500 dark:text-gray-400">
            {/* <PuzzleIcon className="w-4 h-4" /> */}
            <span>Reward: {rewardNft?.name}</span>
          </div>
          {maxProgress >= Progress.SetChallenges && (
            <div className="flex items-center gap-10 text-sm text-gray-500 dark:text-gray-400">
              {/* <AwardIcon className="w-4 h-4" /> */}
              <span>
                {winnerCount == Number.MAX_SAFE_INTEGER ? "Unlimited" : winnerCount} winner{winnerCount > 1 ? "s" : ""}
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
              <span>{terminationDate != null ? `Ends on ${terminationDate.toLocaleString()}` : `Never ends`}</span>
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
    case Progress.ChallengeDetails:
      return !isConnected ? (
        <div className="flex flex-col items-center justify-center">
          <div className="mb-6">You`&apos;ll need to connect your NEAR wallet to create a challenge.</div>
          <NearWalletConnector />
        </div>
      ) : (
        <div>
          {prefix}
          <NFTForm
            name={name}
            setName={setName}
            desc={desc}
            setDesc={setDesc}
            idPrefix={idPrefix}
            setIdPrefix={setIdPrefix}
            mediaLink={mediaLink}
            setMediaLink={setMediaLink}
            setProgress={setProgress}
          />
        </div>
      );
    case Progress.RewardNFTDetails:
      return (
        <div>
          {prefix}
          <RewardNFTForm
            rewardNft={rewardNft}
            setRewardNft={setRewardNft}
            network={network}
            rewardTitle={rewardTitle}
            setRewardTitle={setRewardTitle}
            rewardDescription={rewardDesc}
            setRewardDescription={setRewardDesc}
            rewardMediaLink={rewardMediaLink}
            setRewardMediaLink={setRewardMediaLink}
            setProgress={setProgress}
          />
        </div>
      );

    case Progress.SetChallenges:
      return (
        <div>
          {prefix}
          <VictoryConditionsForm
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

/**
 * This code was generated by v0 by Vercel.
 * @see https://v0.dev/t/N2cpRVYyb5X
 * Documentation: https://v0.dev/docs#integrating-generated-code-into-your-nextjs-app
 */

/** Add fonts into your Next.js project:

import { Libre_Franklin } from 'next/font/google'

libre_franklin({
  subsets: ['latin'],
  display: 'swap',
})

To read more about using these font, please visit the Next.js documentation:
- App Directory: https://nextjs.org/docs/app/building-your-application/optimizing/fonts
- Pages Directory: https://nextjs.org/docs/pages/building-your-application/optimizing/fonts
**/
"use client";
import { useContext, useEffect, useState } from "react";

import { useParams, useSearchParams } from "next/navigation";
import { Wallet, useMbWallet } from "@mintbase-js/react";
import { NFTChallengeMetaData, NFTContract, RawNFTChallengeMetaData } from "@/types/nft";
import { Account, Contract, Near, connect } from "near-api-js";

import { Badge } from "@/components/ui/badge";
import { Button } from "../../../components/ui/button";
import { NftContracts } from "@mintbase-js/data/lib/graphql/codegen/graphql";
import { fetchNftContract, fetchNftContracts } from "@/toolkit/graphql";

import { SignMessageMethod } from "@near-wallet-selector/core/src/lib/wallet";
import { NearWalletConnector } from "@/components/NearWalletSelector";
import { MAX_INT } from "@/components/ChallengeCreator";

import { NetworkContext } from "@/toolkit/blockchain";
import NFTCarousel from "@/components/carousel";

export default function NFTChallenge() {
  const [challengeMetaData, setChallengeMetaData] = useState<NFTChallengeMetaData | null>();
  const [rewardNftMetaData, setRewardNftMetaData] = useState<NFTContract | null>();
  const [challengeNfts, setChallengeNfts] = useState<ReadonlyArray<NFTContract>>([]);
  const [challengeNftsOwned, setChallengeNftsOwned] = useState<ReadonlyArray<NftContracts>>([]);
  const [isWinner, setIsWinner] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const { isConnected, selector } = useMbWallet();
  const { network, challengeFactoryContractId, ...connectionConfig } = useContext(NetworkContext)!;

  const params = useParams<{ idPrefix: string }>()!;
  const errorCode = useSearchParams()!.get("errorCode");
  const txHashes = useSearchParams()!.get("txHashes");

  useEffect(() => {
    (async () => {
      const nearConnection = await connect(connectionConfig);
      if (params.idPrefix) {
        const contract = new Contract(nearConnection.connection, `${params.idPrefix}.${challengeFactoryContractId}`, {
          viewMethods: ["get_challenge_metadata"],
          changeMethods: [],
          useLocalViewExecution: true,
        }) as Contract & {
          get_challenge_metadata: () => Promise<RawNFTChallengeMetaData>;
        };

        const response = await contract.get_challenge_metadata();
        setChallengeMetaData({
          ...response,
          // convert to milliseconds, consider using bignumber package
          expirationDateInMs:
            response.expiration_date_in_ns.toString() === MAX_INT ? null : response.expiration_date_in_ns / 1000000,
          winnerLimit: response.winner_limit.toString() === MAX_INT ? null : response.winner_limit,
          winnerCount: response.winners_count,
          challengeNftIds: response.challenge_nft_ids,
          challengeCompleted: response.challenge_completed,
          rewardNftId: response.reward_nft_id,
          mediaLink: response.media_link,
          ownerId: response.owner_id,
        });
      }
    })();
  }, []);

  useEffect(() => {
    (async () => {
      if (challengeMetaData) {
        let wallet: Wallet & SignMessageMethod;
        let accounts: Account[];
        let nearConnection: Near;
        if (isConnected) {
          nearConnection = await connect(connectionConfig);
          wallet = await selector.wallet();
          accounts = (await wallet.getAccounts()) as Account[];
        }

        const [rewardNft, challengeNfts, challengeNftsOwned] = await Promise.all([
          fetchNftContract(challengeMetaData.rewardNftId, network),
          fetchNftContracts(challengeMetaData.challengeNftIds, network),

          Promise.all(
            challengeMetaData.challengeNftIds.map(async (nft) => {
              if (!isConnected) return [];
              try {
                const contract = new Contract(nearConnection.connection, `${nft}`, {
                  viewMethods: ["nft_tokens_for_owner"],
                  changeMethods: [],
                  useLocalViewExecution: true,
                }) as Contract & {
                  // wrong return type, but we're just checking for existence right now
                  nft_tokens_for_owner: (args: { account_id: string }) => Promise<NftContracts[]>;
                };

                const tokens = await contract.nft_tokens_for_owner({
                  account_id: accounts[0].accountId,
                });
                return tokens;
              } catch (e) {
                return [];
              }
            })
          ),
        ]);
        setRewardNftMetaData(rewardNft);
        let modifiedchallengeNftIds = challengeNfts.map((nft, idx) => ({
          ...nft,
          owned: challengeNftsOwned[idx].length > 0,
        }));

        setChallengeNfts(modifiedchallengeNftIds);
        setChallengeNftsOwned(challengeNftsOwned.flat());
      }
    })();
  }, [challengeMetaData, isConnected, network, selector, connectionConfig]);

  useEffect(() => {
    (async () => {
      if (isConnected) {
        setLoading(true);
        const wallet = await selector.wallet();

        const accounts = await wallet.getAccounts();

        const nearConnection = await connect(connectionConfig);
        const contract = new Contract(nearConnection.connection, `${params.idPrefix}.${challengeFactoryContractId}`, {
          viewMethods: ["is_account_winner"],
          changeMethods: [],
          useLocalViewExecution: true,
        }) as Contract & {
          is_account_winner: (args: { account_id: string }) => Promise<boolean>;
        };
        const isWinner = await contract.is_account_winner({ account_id: accounts[0].accountId });
        setIsWinner(isWinner);
        setLoading(false);
        // fetch the user's NFTs
      } else {
        setIsWinner(false);
        // show a message to connect wallet
      }
    })();
  }, [isConnected]);

  const submitEntry = async () => {
    const wallet = await selector.wallet();

    if (!isConnected) return;

    await wallet.signAndSendTransaction({
      receiverId: `${params.idPrefix}.${challengeFactoryContractId}`,
      actions: [
        {
          type: "FunctionCall",
          params: {
            methodName: "initiate_claim",
            args: {},
            gas: "30000000000000",
            deposit: challengeNfts.length.toString(),
          },
        },
      ],
      callbackUrl: `${window.location.origin}/challenges/${params.idPrefix}`,
    });
  };

  if (!challengeMetaData) return <div>Loading...</div>;

  return (
    <>
      <section className="w-full py-12 md:py-24 lg:py-32">
        <div className="container px-4 md:px-6">
          <div className="grid gap-6 lg:grid-cols-[1fr_500px] lg:gap-12 xl:grid-cols-[1fr_600px]">
            <div className="flex flex-col justify-center space-y-4">
              <div className="space-y-2">
                <a
                  href={`https://testnet.nearblocks.io/address/${params.idPrefix}.${challengeFactoryContractId}`}
                  className="font-medium hover:text-blue-500"
                >
                  <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                    {challengeMetaData.name} Challenge
                  </h1>
                </a>

                <p className="max-w-[600px] text-gray-500 md:text-xl dark:text-gray-400">
                  {challengeMetaData.description}
                </p>
              </div>
              <div className="flex flex-col gap-2 min-[400px]:flex-row">
                {isConnected ? (
                  <div>
                    <Button
                      variant="default"
                      disabled={
                        challengeNftsOwned.length < challengeMetaData.challengeNftIds.length || isWinner || loading
                      }
                      onClick={() => submitEntry()}
                    >
                      {loading ? "Loading..." : "Complete Challenge"}
                    </Button>
                    {challengeNftsOwned.length < challengeMetaData.challengeNftIds.length && (
                      <p className=" text-red-500 text-sm">Warning: You don&apos;t own all challenge nfts yet!</p>
                    )}
                  </div>
                ) : (
                  <div>
                    <p className="text-gray-500 md:text-l font-bold dark:text-gray-300 mt-2">
                      Connect your wallet to submit an entry!
                    </p>

                    <NearWalletConnector />
                  </div>
                )}
              </div>
              {isWinner ? (
                <div>
                  <p className="text-gray-500 md:text-m dark:text-gray-300 mt-2">
                    Congrats, you&apos;ve completed this challenge!
                  </p>
                </div>
              ) : (
                <p className="text-gray-500 md:text-m dark:text-gray-300 mt-2">
                  Make sure you have all challenge pieces before submitting your entry!
                </p>
              )}
              {errorCode && (
                <div className="bg-red-100 text-red-500 p-4 rounded-lg">
                  <p className="text-sm">
                    Unfortunately your entry wasn&apos;t accepted.
                    {txHashes && (
                      <p>
                        , you can view the transaction{" "}
                        <a
                          href={`https://testnet.nearblocks.io/txns/${txHashes[0]}`}
                          className="font-medium text-blue-500"
                        >
                          here
                        </a>
                      </p>
                    )}
                    Make sure the challenge isn&apos;t completed and you have all the pieces.
                  </p>
                </div>
              )}
            </div>
            <img
              alt={`${challengeMetaData.name} Challenge media`}
              className="mx-auto aspect-auto overflow-hidden rounded-2xl object-cover"
              height="400"
              src={
                challengeMetaData.mediaLink || "https://pbs.twimg.com/media/FmxbeaCaMAYAvKG?format=jpg&name=4096x4096"
              }
              width="650"
            />
          </div>
        </div>
      </section>
      <section className="w-full py-8 md:py-24 lg:py-20 bg-gray-100 dark:bg-gray-800 justify-center">
        <div className="px-4 md:px-6">
          <div className="grid gap-8 lg:grid-cols-[1fr_1fr] lg:gap-16">
            <div>
              <h2 className="text-2xl font-bold tracking-tighter">Challenge Details</h2>
              <div className="mt-4 space-y-4">
                <div className="flex items-center justify-between">
                  <p className="text-gray-500 dark:text-gray-400">Termination Date</p>
                  <p className="font-medium">
                    {challengeMetaData.expirationDateInMs
                      ? new Date(challengeMetaData.expirationDateInMs).toLocaleString()
                      : "Never ends"}
                  </p>
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-gray-500 dark:text-gray-400">Challenge Pieces</p>
                  <p className="font-medium">{challengeMetaData.challengeNftIds.length}</p>
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-gray-500 dark:text-gray-400">Winners</p>
                  <p className="font-medium">{challengeMetaData.winnerCount}</p>
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-gray-500 dark:text-gray-400">Max winners</p>
                  <p className="font-medium">
                    {challengeMetaData.winnerLimit ? challengeMetaData.winnerLimit : "Unlimited Winners"}
                  </p>
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-gray-500 dark:text-gray-400">Reward NFT</p>
                  <a
                    href={`https://testnet.nearblocks.io/address/${challengeMetaData.rewardNftId}`}
                    className="font-medium text-blue-500"
                  >
                    {challengeMetaData.rewardNftId}
                  </a>
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-gray-500 dark:text-gray-400">Challenge Status</p>
                  {challengeMetaData.challengeCompleted ? (
                    <Badge variant="secondary">Completed</Badge>
                  ) : (
                    <Badge variant="default">Ongoing</Badge>
                  )}
                </div>
              </div>
            </div>

            {rewardNftMetaData && (
              <div>
                <h2 className="text-2xl font-bold tracking-tighter">About the Reward</h2>
                <div className="mt-4 space-y-4">
                  <div className="flex items-center gap-4">
                    <img
                      alt={`${rewardNftMetaData.name} NFT`}
                      className="rounded-lg"
                      height="100"
                      src={rewardNftMetaData.icon}
                      style={{
                        aspectRatio: "100/100",
                        objectFit: "cover",
                      }}
                      width="100"
                    />
                    <div>
                      <p className="text-lg font-medium">{rewardNftMetaData.name}</p>
                      <p className="text-gray-500 dark:text-gray-400">The reward for the challenge</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
          <div className="flex flex-col items-center mt-12">
            <h2 className="text-2xl font-bold tracking-tighter">Challenge fragments</h2>
            <NFTCarousel nfts={challengeNfts} />
          </div>
        </div>
      </section>
    </>
  );
}

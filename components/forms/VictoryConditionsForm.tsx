/**
 * This code was generated by v0 by Vercel.
 * @see https://v0.dev/t/NIRtBytcueJ
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

import { Label } from "@/components/ui/label";
import { SelectValue, SelectTrigger, SelectItem, SelectContent, Select } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Progress } from "../ChallengeCreator";
import { Dispatch, SetStateAction, useState } from "react";
import { Checkbox } from "../ui/checkbox";

export function VictoryConditionsForm({
  setProgress,
  challengeNftIds,
  setChallengeNftIds,
  setWinnerCount,
  winnerCount,
  burnChallengeNftId,
  setBurnChallengeNftId,
}: {
  challengeNftIds: Array<string>;
  setChallengeNftIds: Dispatch<SetStateAction<Array<string>>>;
  setProgress: Dispatch<SetStateAction<Progress>>;
  setWinnerCount: Dispatch<SetStateAction<number | undefined>>;
  winnerCount: number | undefined;
  burnChallengeNftId: Array<boolean>;
  setBurnChallengeNftId: Dispatch<SetStateAction<Array<boolean>>>;
}) {
  const [challengeCount, setChallengeCount] = useState(Math.max(challengeNftIds.length, 1));
  const [nftIds, setNftIds] = useState<Array<string>>(challengeNftIds);
  const [burnNftIds, setBurnNftIds] = useState<Array<boolean>>(burnChallengeNftId);

  const onNext = async () => {
    if (nftIds.length <= 0) {
      alert("Please enter at least one challenge nft id.");
      return;
    }
    if (nftIds.length !== challengeCount || nftIds.some((id) => id === "")) {
      alert("Please enter all challenge nft ids.");
      return;
    }

    if (new Set(nftIds).size !== nftIds.length) {
      alert("Please enter unique challenge nft ids.");
      return;
    }

    const typedBurnNftIds = burnNftIds.map((burn) => !!burn);
    if (typedBurnNftIds.length !== challengeCount) {
      alert("Please indicate whether the challenge nft should be burned on claim.");
      return;
    }

    setChallengeNftIds(nftIds);
    setBurnChallengeNftId(typedBurnNftIds);
    setProgress(Progress.SetTerminationRules);
  };
  return (
    <div className="mx-auto max-w-md space-y-6">
      <div className="flex flex-col items-start justify-between">
        <h2 className="text-xl font-semibold">Choose your challenge&apos;s victory conditions</h2>
        <p className="text-gray-500 dark:text-gray-400">Enter the details for your challenges.</p>
      </div>

      <div className="grid gap-2">
        <Label htmlFor="winners">Quantity of Winners</Label>
        <Select
          onValueChange={(e) => {
            if (e === "limited") {
              setWinnerCount(1);
            } else {
              setWinnerCount(undefined);
            }
          }}
          defaultValue="unlimited"
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select quantity" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem
              onChange={() => {
                setWinnerCount(undefined);
              }}
              value="unlimited"
            >
              Unlimited
            </SelectItem>
            <SelectItem
              onChange={() => {
                setWinnerCount(1);
              }}
              value="limited"
            >
              Limited
            </SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className={winnerCount == null ? "hidden" : "grid gap-2"}>
        <Label htmlFor="challenges">Number of Winners</Label>
        <Input
          placeholder="Enter number of winners"
          onChange={(e) => setWinnerCount(parseInt(e.target.value))}
          value={winnerCount}
          type="number"
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="challenges">Number of Challenges</Label>
        <Input
          id="challenges"
          placeholder="Enter number of challenges"
          onChange={(e) => setChallengeCount(parseInt(e.target.value) || 0)}
          value={challengeCount}
          type="number"
        />
      </div>
      <div>
        {challengeCount > 0 &&
          [...Array(challengeCount).keys()].map((num) => (
            <div key={num} className="grid gap-4">
              <div className="text-lg font-medium grid gap-2">Challenge #{num + 1}</div>
              <div className="flex items-center justify-between">
                <Label htmlFor="challenges">NFT ID</Label>
                <div className="flex items-center justify-between">
                  <Label className="font-medium mr-3" htmlFor="create-can-end-challenge">
                    Burn piece on claim
                  </Label>
                  <Checkbox
                    onCheckedChange={(checked) => {
                      let burnNftIdsCopy = [...burnNftIds];
                      burnNftIdsCopy[num] = checked.valueOf() as boolean;
                      setBurnNftIds(burnNftIdsCopy);
                    }}
                    id="create-can-end-challenge"
                  />
                </div>
              </div>
              <Input
                value={nftIds[num]}
                onChange={(e) => {
                  let nftIdsCopy = [...nftIds];
                  nftIdsCopy[num] = e.target.value;
                  setNftIds(nftIdsCopy);
                }}
                id="nft-id"
                placeholder="Enter the NFT ID"
              />
            </div>
          ))}
      </div>

      <Button
        className="mr-4 w-auto"
        variant="outline"
        onClick={() => {
          setProgress(Progress.RewardNFTDetails);
        }}
      >
        Previous
      </Button>
      <Button className="w-auto" type="submit" onClick={() => onNext()}>
        Next
      </Button>
    </div>
  );
}

export type NFTContract = {
  category?: string;
  created_at?: Date;
  icon?: string;
  id: string;
  name: string;
  symbol: string;
  owner_id: string;
};

// snake case cause it's pulled directly from blockchain
export type RawNFTChallengeMetaData = {
  title: string;
  description: string;
  media: string | null;
  terminates_at: number;
  challenge_nfts: ReadonlyArray<string>;
  winners_count: number;
  winner_limit: number;
  reward_nft: string;
  challenge_completed: boolean;
};

export type NFTChallengeMetaData = {
  title: string;
  description: string;
  media: string | null;
  terminatesAt: number | null;
  challengeNfts: ReadonlyArray<string>;
  winnersCount: number;
  winnerLimit: number | null;
  rewardNft: string;
  challengeCompleted: boolean;
};

export type NFTContract = {
  category?: string;
  created_at?: Date;
  icon?: string;
  id: string;
  name: string;
  symbol: string;
  owner_id: string;
  owned?: boolean;
  count: number | undefined;
};

// snake case cause it's pulled directly from blockchain
export type RawNFTChallengeMetaData = {
  challenge_completed: string;
  challenge_nft_ids: ReadonlyArray<string>;
  description: string;
  image_link: string;
  name: string;
  owner_id: string;
  reward_nft: string;
  termination_date_in_ns: number;
  winner_limit: number;
  winners_count: number;
};

export type NFTChallengeMetaData = {
  challengeCompleted: string;
  challengeNftIds: ReadonlyArray<string>;
  description: string;
  imageLink: string;
  name: string;
  ownerId: string;
  rewardNft: string;
  terminationDateInMs: number | null;
  winnerLimit: number | null;
  winnersCount: number;
};

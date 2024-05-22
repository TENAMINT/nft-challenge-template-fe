import { NFTContract } from "@/types/nft";
import { fetchGraphQl } from "@mintbase-js/data";
import { Network } from "@mintbase-js/sdk";

const query = `
query NftContract($_eq: String = "") {
  nft_contracts(where: {id: {_eq: $_eq}}) {
    category
    created_at
    id
    icon
    name
    owner_id
    symbol
  }
}
`;

export async function fetchNftContract(id: string, network: Network): Promise<NFTContract | undefined> {
  const res: {
    data?: {
      nft_contracts: Array<NFTContract>;
    };
  } = await fetchGraphQl({ query, variables: { _eq: id }, network });
  return res.data?.nft_contracts[0];
}

export async function fetchNftContracts(nftIds: ReadonlyArray<string>, network: Network): Promise<Array<NFTContract>> {
  const res: {
    data?: {
      nft_contracts: Array<NFTContract>;
    };
  } = await fetchGraphQl({
    query: `
    query NFTContractsQuery($_in: [String!] = "") {
      nft_contracts(where: {id: {_in: $_in}}) {
        category
        created_at
        id
        icon
        name
        owner_id
        symbol
      }
    }`,
    variables: { _in: nftIds },
    network,
  });
  return res.data?.nft_contracts || [];
}

// TODO: Put these in env vars

import { Network } from "@mintbase-js/sdk";
import React from "react";

// export const CONTRACT_ID = "tenamint-challenge.near";
export const CONTRACT_ID = "supreme-squirrel.testnet";
export const NETWORK = "testnet";

export const CONNECTION_CONFIG = {
  networkId: "testnet",
  nodeUrl: "https://rpc.testnet.near.org",
  walletUrl: "https://testnet.mynearwallet.com/",
  helperUrl: "https://helper.testnet.near.org",
  explorerUrl: "https://testnet.nearblocks.io",
};

export const NetworkContext = React.createContext<
  | {
      network: Network;
      callbackUrl: string;
      failureUrl: string;
      challengeFactoryContractId: string;
      networkId: string;
      nodeUrl: string;
      walletUrl: string;
      helperUrl: string;
      explorerUrl: string;
    }
  | undefined
>(undefined);

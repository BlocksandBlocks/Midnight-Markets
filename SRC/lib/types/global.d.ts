/// <reference types="@midnight-ntwrk/dapp-connector-api" />

// This file extends the global Window interface to properly type the Midnight API
// It works with the official @midnight-ntwrk/dapp-connector-api globals.d.ts

declare global {
  interface Window {
    midnight?: {
      mnLace?: import('@midnight-ntwrk/dapp-connector-api').DAppConnectorAPI;
    } & {
      [key: string]: import('@midnight-ntwrk/dapp-connector-api').DAppConnectorAPI;
    };
  }
}

export {};
'use client';

import { DAppConnectorAPI } from '@midnight-ntwrk/dapp-connector-api'; // Lace wallet API
import { toast } from 'sonner';

interface CallResult {
  success: boolean;
  message?: string;
  data?: any;
}

interface MockState {
  owner_id: number;
  platform_fee_percentage: number;
  market_sheriffs: Record<number, number>;
  offers: Record<number, { seller_id: number; amount: number; details_hash: string }>;
  sheriff_names: Record<string, number>; // Added for NFT name uniqueness
}

const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS || '0x...'; // Deployed address
const USE_MOCK = process.env.NODE_ENV === 'development'; // Toggle mocks

class ContractService {
  private mockState: MockState = {
    owner_id: 1,
    platform_fee_percentage: 100,  // 1%
    market_sheriffs: {},
    offers: {},
    sheriff_names: {}, // Added for NFT name uniqueness
  };

  private api: DAppConnectorAPI | null = null; // Lace API instance
  
  getState(): MockState {
    return { ...this.mockState };
  }

  async callFunction(functionName: string, params: any[]): Promise<CallResult> {
    if (USE_MOCK) return this.mockCall(functionName, params);
  
    try {
      // Real Lace wallet call
      const api = await (window.midnight?.lace?.enable() || Promise.resolve(null));
      if (!api) return { success: false, message: 'Lace wallet not connected' };
  
      // Build payload directly
      const txnPayload = {
        contract: CONTRACT_ADDRESS,
        function: functionName,
        params: params.map(p => ({ value: p, disclosed: true })), // Disclose params
      };
  
      // Balance/prove/sign txn
      const balancedTxn = await api.balanceAndProveTransaction(txnPayload as any, []); // Empty coins array for API
  
      // Submit shielded txn
      const result = await api.submitTransaction(balancedTxn);
  
      if (typeof result === 'string') { // Success: txn ID string
        this.updateState(functionName, params); // Sync UI state
        return { success: true, message: `Txn ${result} confirmed`, data: { txnId: result } };
      }
      return { success: false, message: (result as any).error || 'Txn failed' };
    } catch (error) {
      return { success: false, message: error instanceof Error ? error.message : 'Txn failed' };
    }
  }
  
  private async mockCall(functionName: string, params: any[]): Promise<CallResult> {
  try {
    switch (functionName) {
      case 'create_market': {
        const [market_id, sheriff_id, market_name, sheriff_fee] = params as [number, number, string, number];
        if (this.mockState.market_sheriffs[market_id]) {
          throw new Error("Market ID already exists");
        }
        this.mockState.market_sheriffs[market_id] = sheriff_id;
        return { success: true, message: `Market ${market_name} created with sheriff fee ${sheriff_fee} bps` };
      }
      case 'post_offer': {
        const [offer_id, market_id, seller_id, amount, details_hash] = params as [number, number, number, number, string];
        this.mockState.offers[offer_id] = { seller_id, amount, details_hash };
        return { success: true, message: `Offer ${offer_id} posted for ${amount} $Night` };
      }
      case 'accept_offer': {
        const [offer_id, buyer_id, market_id, deposited_amount] = params as [number, number, number, number];
        if (!this.mockState.offers[offer_id]) {
          throw new Error("Offer not found");
        }
        return { success: true, message: `Offer ${offer_id} accepted by buyer ${buyer_id}` };
      }
      case 'release_funds': {
        const [offer_id, sheriff_id, market_id] = params as [number, number, number];
        if (!this.mockState.offers[offer_id]) {
          throw new Error("Offer not found");
        }
        return { success: true, message: `Funds released for offer ${offer_id} by sheriff ${sheriff_id}` };
      }
      case 'set_platform_fee': {
        const [new_fee, owner_id] = params as [number, number];
        if (owner_id !== this.mockState.owner_id) {
          throw new Error("Unauthorized: Only owner can set fee");
        }
        this.mockState.platform_fee_percentage = new_fee;
        return { success: true, message: `Platform fee set to ${new_fee} bps by owner ${owner_id}` };
      }
      case 'cancel_offer_by_sheriff': {
        const [offer_id, sheriff_id, market_id] = params as [number, number, number];
        if (!this.mockState.offers[offer_id]) {
          throw new Error("Offer not found");
        }
        delete this.mockState.offers[offer_id];
        return { success: true, message: `Offer ${offer_id} canceled by sheriff ${sheriff_id}` };
      }
      case 'cancel_offer_by_seller': {
        const [offer_id, seller_id] = params as [number, number];
        if (!this.mockState.offers[offer_id]) {
          throw new Error("Offer not found");
        }
        delete this.mockState.offers[offer_id];
        return { success: true, message: `Offer ${offer_id} canceled by seller ${seller_id}` };
      }
      case 'submit_proof': {
        const [offer_id, seller_id, proof_hash] = params as [number, number, string];
        if (!this.mockState.offers[offer_id]) {
          throw new Error("Offer not found");
        }
        return { success: true, message: `Proof ${proof_hash} submitted for offer ${offer_id}` };
      }
      case 'mint_sheriff_nft': {
        const [nft_id, name_hash, word_count, is_geo_specific, niche_keywords_count, payment_amount] = params as [number, string, number, boolean, number, number];
        if (this.mockState.sheriff_names[name_hash]) {
          throw new Error("Market name already taken");
        }
        // Mock mint
        this.mockState.sheriff_names[name_hash] = nft_id;
        return { success: true, message: `Sheriff NFT ${nft_id} minted for name hash ${name_hash.slice(0, 8)}...`, data: { nft_id } };
      }
      default:
        throw new Error(`Unknown function: ${functionName}`);
    }
  } catch (error) {
    return { success: false, message: error instanceof Error ? error.message : 'Unknown error' };
  }
}

private updateState(functionName: string, params: any[]): void {
  // Sync mockState after real call
  switch (functionName) {
    case 'post_offer':
      const [offer_id, m_id, s_id, amt, details_hash] = params;
      this.mockState.offers[offer_id] = { seller_id: s_id, amount: amt, details_hash };
      break;
    case 'create_market':
      const [market_id, sheriff_id, market_name, sheriff_fee] = params;
      this.mockState.market_sheriffs[market_id] = sheriff_id;
      break;
    // Add cases for other functions as needed
    default:
      break;
  }
}
  
} // Close class
  
export const contractService = new ContractService();

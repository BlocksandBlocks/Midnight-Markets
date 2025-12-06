'use client';

interface MockState {
  owner_id: number;
  platform_fee_percentage: number;
  market_sheriffs: Record<number, number>;
  offers: Record<number, { seller_id: number; amount: number; details_hash: string }>;
  // Add more fields as needed for other functions
}

interface CallResult {
  success: boolean;
  message?: string;
  data?: any;
}

class ContractService {
  private mockState: MockState = {
    owner_id: 1,
    platform_fee_percentage: 100,  // 1%
    market_sheriffs: {},
    offers: {},
  };

  getState(): MockState {
    return { ...this.mockState };
  }

  async callFunction(functionName: string, params: any[]): Promise<CallResult> {
    try {
      switch (functionName) {
        case 'create_market': {
          const [market_id, sheriff_id, market_name, sheriff_fee] = params as [number, number, string, number];
          if (this.mockState.market_sheriffs[market_id]) {
            throw new Error("Market ID already exists");
          }
          this.mockState.market_sheriffs[market_id] = sheriff_id;
          // Mock success (replace with real Midnight call)
          return { success: true, message: `Market ${market_name} created with sheriff fee ${sheriff_fee} bps` };
        }
        case 'post_offer': {
          const [offer_id, market_id, seller_id, amount, details_hash] = params as [number, number, number, number, string];
          this.mockState.offers[offer_id] = { seller_id, amount, details_hash };
          return { success: true, message: `Offer ${offer_id} posted for ${amount} $Night` };
        }
        case 'accept_offer': {
          const [offer_id, buyer_id, market_id, deposited_amount] = params as [number, number, number, number];
          // Mock check if offer exists
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
          // Mock owner check
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
          // Mock proof update
          return { success: true, message: `Proof ${proof_hash} submitted for offer ${offer_id}` };
        }
        default:
          throw new Error(`Unknown function: ${functionName}`);
      }
    } catch (error) {
      return { success: false, message: error instanceof Error ? error.message : 'Unknown error' };
    }
  }
}

export const contractService = new ContractService();

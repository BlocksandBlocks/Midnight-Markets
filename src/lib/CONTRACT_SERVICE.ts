'use client';

interface CallResult {
  success: boolean;
  message?: string;
  data?: any;
}

interface MockOffer {
  seller_id: number | string;
  market_id: number;
  amount: number;
  details_hash: string;
}

interface MockState {
  owner_id: number | string;
  platform_fee_percentage: number;
  market_sheriffs: Record<number, number | string>;
  market_names: Record<number, string>;
  market_hidden: Record<number, boolean>;
  offers: Record<number, MockOffer>;
  offer_hidden: Record<number, boolean>;
  sheriff_names: Record<string, number>; // name_hash -> sheriff_nft_id
}

const STORAGE_KEY = 'nightmode.mock.contract.state';

class ContractService {
  private mockState: MockState = {
    owner_id: 1,
    platform_fee_percentage: 0, // default 0%
    market_sheriffs: {},
    market_names: {},
    market_hidden: {},
    offers: {},
    offer_hidden: {},
    sheriff_names: {},
  };

  constructor() {
    this.loadFromStorage();
  }

  private loadFromStorage(): void {
    if (typeof window === 'undefined') return;

    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (!raw) return;

      const parsed = JSON.parse(raw) as Partial<MockState>;
      this.mockState = {
        ...this.mockState,
        ...parsed,
        market_sheriffs: parsed.market_sheriffs || {},
        market_names: parsed.market_names || {},
        market_hidden: parsed.market_hidden || {},
        offers: parsed.offers || {},
        offer_hidden: parsed.offer_hidden || {},
        sheriff_names: parsed.sheriff_names || {},
      };
    } catch {
      // Ignore malformed local state
    }
  }

  private persistState(): void {
    if (typeof window === 'undefined') return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(this.mockState));
  }

  getState(): MockState {
    return {
      ...this.mockState,
      market_sheriffs: { ...this.mockState.market_sheriffs },
      market_names: { ...this.mockState.market_names },
      market_hidden: { ...this.mockState.market_hidden },
      offers: { ...this.mockState.offers },
      offer_hidden: { ...this.mockState.offer_hidden },
      sheriff_names: { ...this.mockState.sheriff_names },
    };
  }

  getNextMarketId(): number {
    const ids = Object.keys(this.mockState.market_sheriffs).map(Number);
    if (ids.length === 0) return 1;
    return Math.max(...ids) + 1;
  }

  async callFunction(functionName: string, params: any[]): Promise<CallResult> {
    // Mock-only for now
    return this.mockCall(functionName, params);
  }

  private async mockCall(functionName: string, params: any[]): Promise<CallResult> {
    try {
      switch (functionName) {
        case 'create_market': {
          const [market_id, sheriff_id, market_name, sheriff_fee] = params as [
            number,
            number | string,
            string,
            number
          ];

          if (this.mockState.market_sheriffs[market_id]) {
            throw new Error('Market ID already exists');
          }

          this.mockState.market_sheriffs[market_id] = sheriff_id;
          this.mockState.market_names[market_id] = market_name;
          this.mockState.market_hidden[market_id] = false;
          this.persistState();

          return {
            success: true,
            message: `Market ${market_name} created with sheriff fee ${sheriff_fee}%`,
          };
        }

        case 'post_offer': {
          const [offer_id, market_id, seller_id, amount, details_hash] = params as [
            number,
            number,
            number | string,
            number,
            string
          ];

          if (this.mockState.market_hidden[market_id]) {
            throw new Error('Market is hidden');
          }

          this.mockState.offers[offer_id] = { seller_id, market_id, amount, details_hash };
          this.mockState.offer_hidden[offer_id] = false;
          this.persistState();

          return { success: true, message: `Offer ${offer_id} posted for ${amount} $Night` };
        }

        case 'accept_offer': {
          const [offer_id, buyer_id, market_id] = params as [number, number | string, number, number];

          if (!this.mockState.offers[offer_id]) {
            throw new Error('Offer not found');
          }
          if (this.mockState.offer_hidden[offer_id]) {
            throw new Error('Offer is hidden');
          }
          if (this.mockState.market_hidden[market_id]) {
            throw new Error('Market is hidden');
          }

          return { success: true, message: `Offer ${offer_id} accepted by buyer ${buyer_id}` };
        }

        case 'release_funds': {
          const [offer_id, sheriff_id, market_id] = params as [number, number | string, number];

          if (!this.mockState.offers[offer_id]) {
            throw new Error('Offer not found');
          }
          if (this.mockState.offer_hidden[offer_id]) {
            throw new Error('Offer is hidden');
          }
          if (this.mockState.market_hidden[market_id]) {
            throw new Error('Market is hidden');
          }

          return { success: true, message: `Funds released for offer ${offer_id} by sheriff ${sheriff_id}` };
        }

        case 'set_platform_fee': {
          const [new_fee, owner_id] = params as [number, number | string];
          this.mockState.platform_fee_percentage = new_fee;
          this.persistState();
          return { success: true, message: `Platform fee set to ${new_fee} bps by owner ${owner_id}` };
        }

        case 'set_market_hidden': {
          const [market_id, hidden] = params as [number, boolean, number | string];

          if (!this.mockState.market_sheriffs[market_id]) {
            throw new Error('Market does not exist');
          }

          this.mockState.market_hidden[market_id] = hidden;
          this.persistState();

          return {
            success: true,
            message: `Market ${market_id} ${hidden ? 'hidden' : 'unhidden'}`,
          };
        }

        case 'set_offer_hidden': {
          const [offer_id, hidden] = params as [number, boolean, number | string];

          if (!this.mockState.offers[offer_id]) {
            throw new Error('Offer does not exist');
          }

          this.mockState.offer_hidden[offer_id] = hidden;
          this.persistState();

          return {
            success: true,
            message: `Offer ${offer_id} ${hidden ? 'hidden' : 'unhidden'}`,
          };
        }

        case 'set_offer_hidden_by_sheriff': {
          const [offer_id, market_id, sheriff_id, hidden] = params as [
            number,
            number,
            number | string,
            boolean
          ];

          const offer = this.mockState.offers[offer_id];
          if (!offer) {
            throw new Error('Offer does not exist');
          }
          if (offer.market_id !== market_id) {
            throw new Error('Offer does not belong to this market');
          }

          const marketSheriff = this.mockState.market_sheriffs[market_id];
          if (String(marketSheriff) !== String(sheriff_id)) {
            throw new Error('Only designated sheriff can moderate offers in this market');
          }

          this.mockState.offer_hidden[offer_id] = hidden;
          this.persistState();

          return {
            success: true,
            message: `Offer ${offer_id} ${hidden ? 'hidden' : 'unhidden'} by sheriff`,
          };
        }

        case 'cancel_offer_by_sheriff': {
          const [offer_id, sheriff_id] = params as [number, number | string, number];
          if (!this.mockState.offers[offer_id]) {
            throw new Error('Offer not found');
          }

          delete this.mockState.offers[offer_id];
          delete this.mockState.offer_hidden[offer_id];
          this.persistState();

          return { success: true, message: `Offer ${offer_id} canceled by sheriff ${sheriff_id}` };
        }

        case 'cancel_offer_by_seller': {
          const [offer_id, seller_id] = params as [number, number | string];
          if (!this.mockState.offers[offer_id]) {
            throw new Error('Offer not found');
          }

          delete this.mockState.offers[offer_id];
          delete this.mockState.offer_hidden[offer_id];
          this.persistState();

          return { success: true, message: `Offer ${offer_id} canceled by seller ${seller_id}` };
        }

        case 'submit_proof': {
          const [offer_id, seller_id, proof_hash] = params as [number, number | string, string];
          if (!this.mockState.offers[offer_id]) {
            throw new Error('Offer not found');
          }

          return {
            success: true,
            message: `Proof ${proof_hash} submitted for offer ${offer_id} by ${seller_id}`,
          };
        }

        case 'mint_sheriff_nft': {
          const [nft_id, name_hash] = params as [number, string, number, boolean, number, number];
          if (this.mockState.sheriff_names[name_hash]) {
            throw new Error('Market name already taken');
          }

          this.mockState.sheriff_names[name_hash] = nft_id;
          this.persistState();

          return {
            success: true,
            message: `Sheriff NFT ${nft_id} minted for name hash ${name_hash.slice(0, 8)}...`,
            data: { nft_id },
          };
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

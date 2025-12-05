import { CONTRACT_CONFIG } from './CONTRACT_CONFIG';
import { useWalletStore } from '@/lib/stores/walletStore';
import { toast } from 'sonner';

export class ContractService {
  private mockState = { ...CONTRACT_CONFIG.mockState };

  async callFunction(functionName: string, params: any[] = []): Promise<any> {
    const { walletState } = useWalletStore.getState();

    if (!walletState?.address) {
      toast.error('Wallet not connected');
      throw new Error('Wallet not connected');
    }

    await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate network delay

    // Mock function logic here
    switch (functionName) {
      case 'create_market': {
        const [market_id, sheriff_id, market_name, sheriff_fee] = params;
        if (this.mockState.market_sheriffs[market_id]) {
          throw new Error("Market ID already exists");
        }
        this.mockState.market_sheriffs[market_id] = sheriff_id;
        this.mockState.market_names[market_id] = market_name;
        this.mockState.market_escrow_balances[market_id] = 0;
        this.mockState.market_sheriff_fee_percentage[market_id] = sheriff_fee;
        this.mockState.total_markets++;
        return { success: true, message: `Market ${market_name} created.` };
      }
      case 'post_offer': {
        const [offer_id, market_id, seller_id, amount, offer_details_hash] = params;
        if (!this.mockState.market_sheriffs[market_id]) {
          throw new Error("Market does not exist");
        }
        if (this.mockState.offers[offer_id]) {
          throw new Error("Offer ID already exists");
        }
        this.mockState.offers[offer_id] = "Open";
        this.mockState.offer_market_ids[offer_id] = market_id;
        this.mockState.offer_seller_ids[offer_id] = seller_id;
        this.mockState.offer_amounts[offer_id] = amount;
        this.mockState.offer_details_hashes[offer_id] = offer_details_hash;
        this.mockState.total_offers++;
        return { success: true, message: `Offer ${offer_id} posted.` };
      }
      case 'accept_offer': {
        const [offer_id, buyer_id, market_id, deposited_amount] = params;
        if (this.mockState.offers[offer_id] !== "Open") {
          throw new Error("Offer is not open for acceptance");
        }
        if (this.mockState.offer_amounts[offer_id] !== deposited_amount) {
          throw new Error("Deposited amount does not match offer amount");
        }
        this.mockState.offers[offer_id] = "Accepted";
        this.mockState.offer_buyer_ids[offer_id] = buyer_id;
        this.mockState.market_escrow_balances[market_id] += deposited_amount;
        return { success: true, message: `Offer ${offer_id} accepted.` };
      }
      case 'submit_proof': {
        const [offer_id, seller_id, proof_hash] = params;
        if (this.mockState.offers[offer_id] !== "Accepted") {
          throw new Error("Offer is not in accepted state");
        }
        if (this.mockState.offer_seller_ids[offer_id] !== seller_id) {
          throw new Error("Only the seller can submit proof");
        }
        this.mockState.offers[offer_id] = "ProofSubmitted";
        this.mockState.offer_proof_hashes[offer_id] = proof_hash;
        return { success: true, message: `Proof for offer ${offer_id} submitted.` };
      }
      case 'release_funds': {
        const [offer_id, sheriff_id, market_id] = params;
        if (this.mockState.offers[offer_id] !== "ProofSubmitted") {
          throw new Error("Proof has not been submitted for this offer");
        }
        if (this.mockState.market_sheriffs[market_id] !== sheriff_id) {
          throw new Error("Only the designated Sheriff can release funds for this market");
        }

        const offer_amount = this.mockState.offer_amounts[offer_id];
        const sheriff_fee_percent = this.mockState.market_sheriff_fee_percentage[market_id];
        const platform_fee_percent = this.mockState.platform_fee_percentage;

        const sheriff_fee = (offer_amount * sheriff_fee_percent) / 10000;
        const platform_fee = (offer_amount * platform_fee_percent) / 10000;
        const amount_to_seller = offer_amount - sheriff_fee - platform_fee;

        if (this.mockState.market_escrow_balances[market_id] < offer_amount) {
          throw new Error("Insufficient funds in escrow");
        }
        this.mockState.market_escrow_balances[market_id] -= offer_amount;
        this.mockState.offers[offer_id] = "FundsReleased";
        return { success: true, message: `Funds for offer ${offer_id} released. Seller receives ${amount_to_seller}, Sheriff receives ${sheriff_fee}, Platform receives ${platform_fee}.` };
      }
      case 'set_platform_fee': {
        const [new_fee, caller_id] = params;
        if (this.mockState.owner_id !== caller_id) {
          throw new Error("Only the platform owner can set the fee");
        }
        this.mockState.platform_fee_percentage = new_fee;
        return { success: true, message: `Platform fee set to ${new_fee / 100}%` };
      }
      case 'cancel_offer_by_sheriff': {
        const [offer_id, sheriff_id, market_id] = params;
        if (this.mockState.offers[offer_id] !== "Open") {
          throw new Error("Offer is not open for cancellation");
        }
        if (this.mockState.market_sheriffs[market_id] !== sheriff_id) {
          throw new Error("Only the designated Sheriff can cancel offers in this market");
        }
        this.mockState.offers[offer_id] = "Cancelled";
        return { success: true, message: `Offer ${offer_id} cancelled by Sheriff.` };
      }
      case 'cancel_offer_by_seller': {
        const [offer_id, seller_id] = params;
        if (this.mockState.offers[offer_id] !== "Open") {
          throw new Error("Offer is not open for cancellation");
        }
        if (this.mockState.offer_seller_ids[offer_id] !== seller_id) {
          throw new Error("Only the seller can cancel this offer");
        }
        this.mockState.offers[offer_id] = "Cancelled";
        return { success: true, message: `Offer ${offer_id} cancelled by seller.` };
      }
      default:
        throw new Error(`Unknown function: ${functionName}`);
    }
  }

  getState() {
    return { ...this.mockState };
  }
}

export const contractService = new ContractService();

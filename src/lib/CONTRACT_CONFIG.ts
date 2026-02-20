export const CONTRACT_CONFIG = {
  name: "MidnightMarkets",
  address: "midnight_markets_contract_address_placeholder", // Replace with deployed contract address
  functions: {
    create_market: {
      name: "create_market",
      params: ["market_id", "sheriff_id", "market_name", "sheriff_fee"],
      returns: "void",
      description: "Creates a new market, assigning a Sheriff and setting the market fee."
    },
    post_offer: {
      name: "post_offer",
      params: ["offer_id", "market_id", "seller_id", "amount", "offer_details_hash"],
      returns: "void",
      description: "Allows users to post offers in a specific market."
    },
    accept_offer: {
      name: "accept_offer",
      params: ["offer_id", "buyer_id", "market_id", "deposited_amount"],
      returns: "void",
      description: "Allows users to accept an offer by placing funds into escrow."
    },
    submit_proof: {
      name: "submit_proof",
      params: ["offer_id", "seller_id", "proof_hash"],
      returns: "void",
      description: "Allows the seller to submit proof that the good/service has been provided."
    },
    release_funds: {
      name: "release_funds",
      params: ["offer_id", "sheriff_id", "market_id"],
      returns: "void",
      description: "Allows the Sheriff to release funds from escrow to the seller, and distribute fees."
    },
    set_platform_fee: {
      name: "set_platform_fee",
      params: ["new_fee", "caller_id"],
      returns: "void",
      description: "Allows the platform owner to set the global platform fee percentage."
    },
    cancel_offer_by_sheriff: {
      name: "cancel_offer_by_sheriff",
      params: ["offer_id", "sheriff_id", "market_id"],
      returns: "void",
      description: "Allows a Sheriff to cancel an open offer in their market."
    },
    cancel_offer_by_seller: {
      name: "cancel_offer_by_seller",
      params: ["offer_id", "seller_id"],
      returns: "void",
      description: "Allows a seller to cancel their own open offer."
    }
  },
  mockState: {
    owner_id: 1,
    platform_fee_percentage: 0, // 0%
    total_markets: 0,
    total_offers: 0,
    market_sheriffs: {},
    market_names: {},
    market_escrow_balances: {},
    market_sheriff_fee_percentage: {},
    offers: {},
    offer_market_ids: {},
    offer_seller_ids: {},
    offer_buyer_ids: {},
    offer_amounts: {},
    offer_details_hashes: {},
    offer_proof_hashes: {}
  }
};

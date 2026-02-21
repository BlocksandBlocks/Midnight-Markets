'use client';

import { useParams, notFound } from 'next/navigation';
import { useCallback, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';
import { WalletConnect } from '@/components/wallet/WalletConnect';
import { ThemeToggle } from '@/components/theme/theme-toggle';
import { contractService } from '@/lib/CONTRACT_SERVICE';
import { useWalletStore } from '@/lib/stores/walletStore';
import { toast } from 'sonner';

const OWNER_WALLET_ADDRESS = 'mn_addr_preprod14svvcfsm22emrjml0fr28l3rp0frycej3gpju5qmtl9kz2ecjnaq6c2nlq';

interface MarketView {
  id: number;
  name: string;
  sheriffId: number | string;
  offersCount: number;
}

interface OfferView {
  id: number;
  seller: string;
  amount: number;
  title: string;
  details: string;
  hidden: boolean;
}

export default function MarketPage() {
  const params = useParams();
  const marketId = parseInt(params.id as string, 10);
  const { isConnected, walletState } = useWalletStore();

  const [actionLoading, setActionLoading] = useState<number | null>(null);
  const [market, setMarket] = useState<MarketView | null>(null);
  const [offers, setOffers] = useState<OfferView[]>([]);
  const [hasLoaded, setHasLoaded] = useState(false);

  const refreshMarketData = useCallback(() => {
    const state = contractService.getState();
    const sheriffId = state.market_sheriffs[marketId];

    if (!sheriffId) {
      setMarket(null);
      setOffers([]);
      setHasLoaded(true);
      return;
    }

    const marketName = state.market_names?.[marketId] || `Market ${marketId}`;
    const marketOffers = Object.entries(state.offers)
      .filter(([, offer]) => offer.market_id === marketId)
      .map(([offerId, offer]) => ({
        id: Number(offerId),
        seller: String(offer.seller_id),
        amount: offer.amount,
        title: offer.details?.trim() || `Offer ${offerId}`,
        details: offer.details?.trim() || 'No offer details provided.',
        hidden: Boolean(state.offer_hidden?.[Number(offerId)]),
      }))
      .sort((a, b) => a.id - b.id);

    setMarket({
      id: marketId,
      name: marketName,
      sheriffId,
      offersCount: marketOffers.length,
    });
    setOffers(marketOffers);
    setHasLoaded(true);
  }, [marketId]);

  useEffect(() => {
    refreshMarketData();
  }, [refreshMarketData]);

  const isOwner = walletState?.address === OWNER_WALLET_ADDRESS;
  const isSheriff = Boolean(walletState?.address && market?.sheriffId && String(market.sheriffId) === walletState.address);
  const canModerateOffers = isOwner || isSheriff;

  const visibleOffers = useMemo(() => {
    return canModerateOffers ? offers : offers.filter((offer) => !offer.hidden);
  }, [canModerateOffers, offers]);

  const toggleOfferHidden = async (offerId: number, currentlyHidden: boolean) => {
    if (!canModerateOffers || !walletState?.address) return;

    const functionName = isOwner ? 'set_offer_hidden' : 'set_offer_hidden_by_sheriff';
    const functionParams = isOwner
      ? [offerId, !currentlyHidden, walletState.address]
      : [offerId, marketId, walletState.address, !currentlyHidden];

    const result = await contractService.callFunction(functionName, functionParams);

    if (!result.success) {
      toast.error(result.message || 'Failed to update offer visibility');
      return;
    }

    toast.success(currentlyHidden ? `Offer ${offerId} restored` : `Offer ${offerId} hidden`);
    refreshMarketData();
  };

  const isTimeout = () => true;

  const handleBuyerRefund = async (offerId: number) => {
    if (!isConnected) {
      toast.error('Connect wallet first');
      return;
    }

    setActionLoading(offerId);
    try {
      const result = await contractService.callFunction('buyer_refund_timeout', [offerId]);
      if (result.success) {
        toast.success('Escrow refunded!');
      } else {
        toast.error(result.message || 'Refund failed');
      }
    } catch {
      toast.error('Refund failed');
    } finally {
      setActionLoading(null);
    }
  };

  const handleSellerClaim = async (offerId: number) => {
    if (!isConnected) {
      toast.error('Connect wallet first');
      return;
    }

    setActionLoading(offerId);
    try {
      const result = await contractService.callFunction('seller_refund_timeout', [offerId]);
      if (result.success) {
        toast.success('Funds claimed!');
      } else {
        toast.error(result.message || 'Claim failed');
      }
    } catch {
      toast.error('Claim failed');
    } finally {
      setActionLoading(null);
    }
  };

  if (!hasLoaded) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-midnight-black via-gray-900 to-midnight-blue flex items-center justify-center text-gray-300">
        Loading market...
      </div>
    );
  }

  if (!market) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-midnight-black via-gray-900 to-midnight-blue flex flex-col p-4">
      <header className="w-full max-w-6xl mx-auto flex justify-between items-center py-4">
        <Link href="/markets" className="text-xl font-bold text-midnight-blue hover:underline">
          ← Back to Markets
        </Link>
        <div className="flex items-center space-x-4">
          <WalletConnect />
          <ThemeToggle />
        </div>
      </header>

      <div className="w-full max-w-6xl mx-auto mb-8">
        <div className="relative w-full h-48 mb-4">
          <Image
            src="/moon.png"
            alt={`${market.name} Banner`}
            fill
            className="object-cover opacity-40 rounded-md"
            sizes="100vw"
          />
        </div>
        <div className="text-center">
          <h1 className="text-3xl font-bold text-white mb-2">{market.name}</h1>
          <p className="text-gray-300 mb-4">Market details</p>
          <Badge variant="secondary" className="text-sm">
            Sheriff: {String(market.sheriffId)} | {market.offersCount} Active Offers
          </Badge>
        </div>
      </div>

      <div className="w-full max-w-6xl mx-auto flex flex-col md:flex-row gap-4 mb-8 justify-center">
        <Link href={`/markets/${marketId}/post-offer`}>
          <Button size="lg" className="w-full md:w-auto bg-gradient-to-r from-midnight-blue to-blue-600 text-white shadow-lg">
            Post Offer
          </Button>
        </Link>
      </div>

      <main className="flex-grow w-full max-w-6xl grid grid-cols-1 gap-6 pb-8">
        <h2 className="text-2xl font-bold text-white col-span-full">Active Offers</h2>

        {visibleOffers.length === 0 && (
          <Card className="bg-gray-900/50 text-white border border-gray-700/50">
            <CardContent className="py-8 text-center text-gray-400">No offers yet in this market.</CardContent>
          </Card>
        )}

        {visibleOffers.map((offer) => (
          <Card key={offer.id} className="bg-gray-900/50 text-white border border-gray-700/50">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg">{offer.title}</CardTitle>
              <CardDescription className="text-gray-400">
                Seller: {offer.seller} | Amount: {offer.amount} $Night
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
              <p className="text-sm text-gray-300 mb-4 whitespace-pre-wrap">{offer.details}</p>
              <div className="flex justify-end space-x-2 flex-wrap gap-y-2">
                <Link href={`/markets/${marketId}/accept-offer?offerId=${offer.id}`}>
                  <Button variant="outline" size="sm">Accept</Button>
                </Link>
                <Link href={`/markets/${marketId}/cancel-offer?offerId=${offer.id}`}>
                  <Button variant="destructive" size="sm">Cancel</Button>
                </Link>
                <Link href={`/markets/${marketId}/submit-proof?offerId=${offer.id}`}>
                  <Button variant="secondary" size="sm">Submit Proof</Button>
                </Link>

                {walletState?.address && isTimeout() && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleBuyerRefund(offer.id)}
                    disabled={actionLoading === offer.id}
                  >
                    {actionLoading === offer.id ? 'Refunding...' : 'Return Funds to Buyer'}
                  </Button>
                )}

                {walletState?.address && isTimeout() && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleSellerClaim(offer.id)}
                    disabled={actionLoading === offer.id}
                  >
                    {actionLoading === offer.id ? 'Claiming...' : 'Claim Funds'}
                  </Button>
                )}

                {canModerateOffers && (
                  <Button
                    variant={offer.hidden ? 'secondary' : 'destructive'}
                    size="sm"
                    onClick={() => toggleOfferHidden(offer.id, offer.hidden)}
                  >
                    {offer.hidden ? 'Unhide Offer' : 'Hide Offer'}
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </main>

      <footer className="w-full max-w-4xl text-center py-4 text-gray-500 text-sm">
        © 2025 Night Mode. All rights reserved.
      </footer>
    </div>
  );
}

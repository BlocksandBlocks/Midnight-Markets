'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { WalletConnect } from '@/components/wallet/WalletConnect';
import { ThemeToggle } from '@/components/theme/theme-toggle';
import { useWalletStore } from '@/lib/stores/walletStore';
import { contractService } from '@/lib/CONTRACT_SERVICE';
import { toast } from 'sonner';
import { Loader2, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function PostOffer() {
  const router = useRouter();
  const params = useParams();
  const marketId = parseInt(params.id as string, 10);
  const { isConnected, walletState } = useWalletStore();

  const [loading, setLoading] = useState(false);
  const [offerId, setOfferId] = useState('');
  const [sellerId, setSellerId] = useState('');
  const [amount, setAmount] = useState('');
  const [offerDetails, setOfferDetails] = useState('');

  const market = useMemo(() => {
    const state = contractService.getState();
    const sheriffId = state.market_sheriffs[marketId];
    if (!sheriffId) return null;

    const offersInMarket = Object.values(state.offers).filter((offer) => offer.market_id === marketId).length;
    return {
      id: marketId,
      name: state.market_names[marketId] || `Market ${marketId}`,
      offersCount: offersInMarket,
    };
  }, [marketId]);

  useEffect(() => {
    if (walletState?.address) {
      setSellerId(walletState.address);
    }

    const state = contractService.getState();
    const marketOfferIds = Object.entries(state.offers)
      .filter(([, offer]) => offer.market_id === marketId)
      .map(([id]) => Number(id));

    const nextOfferId = marketOfferIds.length === 0 ? 1 : Math.max(...marketOfferIds) + 1;
    setOfferId(nextOfferId.toString());
  }, [walletState, marketId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isConnected) {
      toast.error('Please connect your wallet first');
      return;
    }

    setLoading(true);
    try {
      const detailsJson = JSON.stringify({ description: offerDetails });
      const encoder = new TextEncoder();
      const data = encoder.encode(detailsJson);
      const hashBuffer = await crypto.subtle.digest('SHA-256', data);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      const offerDetailsHashHex = hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');

      const result = await contractService.callFunction('post_offer', [
        parseInt(offerId, 10),
        marketId,
        walletState?.address || sellerId,
        parseInt(amount, 10),
        offerDetailsHashHex,
        offerDetails,
      ]);

      if (result.success) {
        toast.success(result.message || 'Offer posted successfully!');
        router.push(`/markets/${marketId}`);
      } else {
        toast.error(result.message || 'Failed to post offer');
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Post failed');
    } finally {
      setLoading(false);
    }
  };

  if (!market) {
    return <div>Market not found</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-midnight-black via-gray-900 to-midnight-blue flex flex-col p-4">
      <header className="w-full max-w-4xl mx-auto flex justify-between items-center py-4">
        <Link href={`/markets/${marketId}`} className="text-xl font-bold text-midnight-blue hover:underline flex items-center gap-2">
          <ArrowLeft className="w-4 h-4" />
          Back to {market.name}
        </Link>
        <div className="flex items-center space-x-4">
          <WalletConnect />
          <ThemeToggle />
        </div>
      </header>

      <main className="flex-grow flex flex-col justify-center items-center w-full max-w-md py-8">
        <Card className="w-full bg-gray-900/50 text-white border border-gray-700/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-2xl text-center">Post an Offer</CardTitle>
            <CardDescription className="text-center">Offer your goods or services in {market.name}. Connect wallet to post.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block text-gray-300">Offer ID (Auto: {offerId || 'Generating...'})</label>
                <Input type="number" value={offerId} onChange={(e) => setOfferId(e.target.value)} placeholder="e.g., 1001" disabled required />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block text-gray-300">Seller ID (Auto: {sellerId || 'Connect Wallet'})</label>
                <Input type="text" value={sellerId} onChange={(e) => setSellerId(e.target.value)} placeholder="Wallet address" disabled required />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block text-gray-300">Amount ($Night)</label>
                <Input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="e.g., 1000"
                  disabled={loading}
                  required
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block text-gray-300">Offer Details</label>
                <Input
                  type="text"
                  value={offerDetails}
                  onChange={(e) => setOfferDetails(e.target.value)}
                  placeholder="Describe your offer"
                  disabled={loading}
                  required
                />
              </div>
              <Button
                type="submit"
                disabled={loading || !isConnected}
                className="w-full bg-gradient-to-r from-midnight-blue to-blue-600 text-white shadow-lg"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Posting...
                  </>
                ) : (
                  'Post Offer'
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </main>

      <footer className="w-full max-w-4xl text-center py-4 text-gray-500 text-sm">© 2025 Night Mode. All rights reserved.</footer>
    </div>
  );
}

'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation'; // For redirect
import { useParams, useSearchParams } from 'next/navigation'; // For marketId and query params
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { WalletConnect } from '@/components/wallet/WalletConnect';
import { NetworkStatus } from '@/components/network/NetworkStatus';
import { ThemeToggle } from '@/components/theme/theme-toggle';
import { useWalletStore } from '@/lib/stores/walletStore';
import { contractService } from '@/lib/CONTRACT_SERVICE';
import { toast } from 'sonner';
import { Loader2, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

// Mock markets for back link lookup
const markets = [
  { id: 1, name: 'Electronics' },
  { id: 2, name: 'Freelance Services' },
  { id: 3, name: 'Art & Collectibles' },
];

export default function CancelOffer() {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams(); // Reads ?offerId from URL
  const marketId = parseInt(params.id as string);
  const market = markets.find((m) => m.id === marketId);
  const { isConnected, walletState } = useWalletStore();
  const [loading, setLoading] = useState(false);
  const [offerId, setOfferId] = useState(searchParams.get('offerId') || ''); // Autofill from query param
  const [sellerId, setSellerId] = useState(''); // Auto from wallet

  // Auto-populate Seller ID on mount
useEffect(() => {
  if (walletState?.address) {
    setSellerId(walletState.address.slice(-6)); // Wallet priority
  } else if (searchParams.get('sellerId')) {
    setSellerId(searchParams.get('sellerId') || ''); // Fallback to param
  }
}, [walletState, searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isConnected) {
      toast.error('Please connect your wallet first');
      return;
    }
    setLoading(true);
    try {
      const result = await contractService.callFunction('cancel_offer_by_seller', [
        parseInt(offerId),
        parseInt(sellerId),
      ]);
      if (result.success) {
        toast.success(result.message || 'Offer canceled successfully!');
        router.push(`/markets/${marketId}`);
      } else {
        toast.error(result.message || 'Failed to cancel offer');
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Cancel failed');
    } finally {
      setLoading(false);
    }
  };

  if (!market) {
    return <div>Market not found</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-midnight-black via-gray-900 to-midnight-blue flex flex-col p-4">
      {/* Header */}
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

      {/* Form Card */}
      <main className="flex-grow flex flex-col justify-center items-center w-full max-w-md py-8">
        <Card className="w-full bg-gray-900/50 text-white border border-gray-700/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-2xl text-center">Cancel an Offer</CardTitle>
            <CardDescription className="text-center">
              Cancel your offer in {market.name}. Connect wallet to cancel.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block text-gray-300">Offer ID {offerId ? `(Pre-filled: ${offerId})` : ''}</label>
                <Input
                  type="number"
                  value={offerId}
                  onChange={(e) => setOfferId(e.target.value)}
                  placeholder="e.g., 101"
                  disabled={loading}
                  required
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block text-gray-300">Seller ID (Auto: {sellerId || 'Connect Wallet'})</label>
                <Input
                  type="number"
                  value={sellerId}
                  onChange={(e) => setSellerId(e.target.value)}
                  placeholder="e.g., 201"
                  disabled // Read-only after auto-fill
                  required
                />
              </div>
              <Button
                type="submit"
                disabled={loading || !isConnected}
                className="w-full bg-red-600 hover:bg-red-700 text-white shadow-lg"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Canceling...
                  </>
                ) : (
                  'Cancel Offer'
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </main>

      {/* Footer */}
      <footer className="w-full max-w-4xl text-center py-4 text-gray-500 text-sm">
        © 2025 Night Mode. All rights reserved.
      </footer>
    </div>
  );
}

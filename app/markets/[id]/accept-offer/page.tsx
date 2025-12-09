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

export default function AcceptOffer() {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams(); // Reads ?offerId from URL
  const marketId = parseInt(params.id as string);
  const market = markets.find((m) => m.id === marketId);
  const { isConnected, walletState } = useWalletStore();
  const [loading, setLoading] = useState(false);
  const [offerId, setOfferId] = useState(searchParams.get('offerId') || ''); // Autofill from query param
  const [buyerId, setBuyerId] = useState(''); // Auto from wallet
  const [depositedAmount, setDepositedAmount] = useState('');

  // Auto-populate Buyer ID on mount
  useEffect(() => {
    if (walletState?.address) {
      setBuyerId(walletState.address.slice(-6)); // Mock short ID from address (real: parse or use full)
    }
  }, [walletState]);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isConnected) {
      toast.error('Please connect your wallet first');
      return;
    }
    setLoading(true);
    try {
      const result = await contractService.callFunction('accept_offer', [
        parseInt(offerId),
        parseInt(buyerId),
        marketId,
        parseInt(depositedAmount),
      ]);
      if (result.success) {
        toast.success(result.message || 'Offer accepted successfully!');
        router.push(`/markets/${marketId}`);
      } else {
        toast.error(result.message || 'Failed to accept offer');
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Accept failed');
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
            <CardTitle className="text-2xl text-center">Accept an Offer</CardTitle>
            <CardDescription className="text-center">
              Accept an offer in {market.name} and deposit funds. Connect wallet to accept.
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
                <label className="text-sm font-medium mb-2 block text-gray-300">Buyer ID (Auto: {buyerId || 'Connect Wallet'})</label>
                <Input
                  type="number"
                  value={buyerId}
                  onChange={(e) => setBuyerId(e.target.value)}
                  placeholder="e.g., 301"
                  disabled // Read-only after auto-fill
                  required
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block text-gray-300">Deposited Amount ($Night)</label>
                <Input
                  type="number"
                  value={depositedAmount}
                  onChange={(e) => setDepositedAmount(e.target.value)}
                  placeholder="e.g., 500"
                  disabled={loading}
                  required
                />
              </div>
              <Button
                type="submit"
                disabled={loading || !isConnected}
                className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white shadow-lg"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Accepting...
                  </>
                ) : (
                  'Accept Offer'
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

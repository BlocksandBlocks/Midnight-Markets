'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation'; // For redirect after success
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'; // Added CardDescription to import
import { WalletConnect } from '@/components/wallet/WalletConnect';
import { NetworkStatus } from '@/components/network/NetworkStatus';
import { ThemeToggle } from '@/components/theme/theme-toggle';
import { useWalletStore } from '@/lib/stores/walletStore';
import { contractService } from '@/lib/CONTRACT_SERVICE';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

export default function CreateMarket() {
  const router = useRouter();
  const { isConnected, walletState } = useWalletStore();
  const [loading, setLoading] = useState(false);
  const [marketId, setMarketId] = useState('');
  const [sheriffId, setSheriffId] = useState('');
  const [marketName, setMarketName] = useState('');
  const [sheriffFee, setSheriffFee] = useState('');

  // Auto-populate Sheriff ID on mount
  useEffect(() => {
    if (walletState?.address) {
      setSheriffId(walletState.address.slice(-6)); // Mock short ID from address (real: parse or use full)
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
      const result = await contractService.callFunction('create_market', [
        parseInt(marketId),
        parseInt(sheriffId),
        marketName,
        parseInt(sheriffFee),
      ]);
      if (result.success) {
        toast.success(result.message || 'Market created successfully!');
        router.push('/markets'); // Redirect to browse after success
      } else {
        toast.error(result.message || 'Failed to create market');
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Creation failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-midnight-black via-gray-900 to-midnight-blue flex flex-col p-4">
      {/* Header */}
      <header className="w-full max-w-4xl mx-auto flex justify-between items-center py-4">
        <h1 className="text-4xl font-bold text-midnight-blue">Create a Market</h1>
        <div className="flex items-center space-x-4">
          <NetworkStatus />
          <WalletConnect />
          <ThemeToggle />
        </div>
      </header>

      {/* Form Card */}
      <main className="flex-grow flex flex-col justify-center items-center w-full max-w-md py-8">
        <Card className="w-full bg-gray-900/50 text-white border border-gray-700/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-2xl text-center">Become a Sheriff</CardTitle>
            <CardDescription className="text-center">
              Create your market and earn fees as Sheriff. Connect wallet to proceed.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block text-gray-300">Market ID</label>
                <Input
                  type="number"
                  value={marketId}
                  onChange={(e) => setMarketId(e.target.value)}
                  placeholder="e.g., 1"
                  disabled={loading}
                  required
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block text-gray-300">Sheriff ID (Auto: {sheriffId || 'Connect Wallet'})</label>
                <Input
                  type="number"
                  value={sheriffId}
                  onChange={(e) => setSheriffId(e.target.value)}
                  placeholder="e.g., 101"
                  disabled // Read-only after auto-fill
                  required
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block text-gray-300">Market Name</label>
                <Input
                  type="text"
                  value={marketName}
                  onChange={(e) => setMarketName(e.target.value)}
                  placeholder="e.g., 'Electronics Bazaar'"
                  disabled={loading}
                  required
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block text-gray-300">Sheriff Fee (bps)</label>
                <Input
                  type="number"
                  value={sheriffFee}
                  onChange={(e) => setSheriffFee(e.target.value)}
                  placeholder="e.g., 100 (for 1%)"
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
                    Creating...
                  </>
                ) : (
                  'Create Market'
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </main>

      {/* Footer */}
      <footer className="w-full max-w-4xl text-center py-4 text-gray-500 text-sm">
        © 2024 Night Mode. All rights reserved.
      </footer>
    </div>
  );
}

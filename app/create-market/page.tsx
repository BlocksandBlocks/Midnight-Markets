'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { WalletConnect } from '@/components/wallet/WalletConnect';
import { ThemeToggle } from '@/components/theme/theme-toggle';
import { useWalletStore } from '@/lib/stores/walletStore';
import { contractService } from '@/lib/CONTRACT_SERVICE';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

export default function CreateMarket() {
  const router = useRouter();
  const { isConnected, walletState } = useWalletStore();
  const [loading, setLoading] = useState(false);
  const [marketId] = useState('Auto');
  const [sheriffId, setSheriffId] = useState('');
  const [marketName, setMarketName] = useState('');
  const [sheriffFee, setSheriffFee] = useState('');
  const [platformFee, setPlatformFee] = useState('');
  const [sheriffMode, setSheriffMode] = useState(0);
  const [nameHash, setNameHash] = useState('');
  const [previewPrice, setPreviewPrice] = useState(0);
  const [nameAvailable, setNameAvailable] = useState(true);

  useEffect(() => {
    if (isConnected && walletState?.address) {
      setSheriffId(walletState.address.slice(-6));
    }
  }, [isConnected, walletState]);

  const computeHashAndPrice = async (name: string) => {
    if (!name) return;

    const encoder = new TextEncoder();
    const data = encoder.encode(name);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hash = hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
    setNameHash(hash);

    const wordCount = name.split(' ').length;
    const isGeo = name.toLowerCase().includes('la') || name.toLowerCase().includes('los angeles');
    const nicheScore = wordCount > 3 ? (wordCount - 3) * 20 : 0;
    const geoPremium = isGeo ? 50 : 0;
    const price = 10 + geoPremium - nicheScore;
    setPreviewPrice(Math.max(price, 0));

    setNameAvailable(true);
  };

  useEffect(() => {
    const fetchMode = async () => {
      try {
        setSheriffMode(0);
      } catch (error) {
        console.error('Mode fetch failed');
      }
    };
    fetchMode();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isConnected) {
      toast.error('Please connect your wallet first');
      return;
    }
    setLoading(true);

    try {
      const nextMarketId = contractService.getNextMarketId();

      const result = await contractService.callFunction('create_market', [
        nextMarketId,
        walletState?.address || 'mock_sheriff',
        marketName,
        parseInt(sheriffFee, 10),
      ]);

      if (result.success) {
        toast.success(result.message || 'Market created successfully!');
        router.push('/markets');
      } else {
        toast.error(result.message || 'Market creation failed');
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Action failed');
    } finally {
      setLoading(false);
    }
  };

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-midnight-black via-gray-900 to-midnight-blue flex flex-col p-4">
        <header className="w-full max-w-6xl flex justify-between items-center py-4">
          <Link href="/" className="text-4xl font-bold text-midnight-blue hover:underline">
            Night Mode
          </Link>
          <div className="flex items-center space-x-4">
            <WalletConnect />
            <ThemeToggle />
          </div>
        </header>
        <main className="flex-grow flex flex-col justify-center items-center w-full max-w-md py-8">
          <Card className="w-full bg-gray-900/50 text-white border border-gray-700/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-2xl text-center">Become a Sheriff</CardTitle>
              <CardDescription className="text-center">Connect wallet to create your market.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-center text-gray-400">Please connect your wallet to proceed.</p>
            </CardContent>
          </Card>
        </main>
        <footer className="w-full max-w-4xl text-center py-4 text-gray-500 text-sm">
          © 2024 Night Mode. All rights reserved.
        </footer>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-midnight-black via-gray-900 to-midnight-blue flex flex-col p-4">
      <header className="w-full max-w-6xl flex justify-between items-center py-4">
        <Link href="/" className="text-4xl font-bold text-midnight-blue hover:underline">
          Night Mode
        </Link>
        <div className="flex items-center space-x-4">
          <WalletConnect />
          <ThemeToggle />
        </div>
      </header>
      <main className="flex-grow flex flex-col justify-center items-center w-full max-w-md py-8">
        <Card className="w-full bg-gray-900/50 text-white border border-gray-700/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-2xl text-center">Become a Sheriff</CardTitle>
            <CardDescription className="text-center">Create your market and earn fees as Sheriff.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block text-gray-300">Market ID (Auto-generated)</label>
                <Input type="text" value={marketId} disabled className="bg-gray-800/50" />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block text-gray-300">Market Name</label>
                <Input
                  type="text"
                  value={marketName}
                  onChange={(e) => {
                    setMarketName(e.target.value);
                    computeHashAndPrice(e.target.value);
                  }}
                  placeholder="e.g., 'Sheriff of Reddington Fly Rods LA'"
                  disabled={loading}
                  required
                />
                {previewPrice > 0 && (
                  <p className="text-xs text-gray-400 mt-1">
                    Est. Mint Cost: {previewPrice} $NIGHT | {nameAvailable ? 'Available' : 'Taken'}
                  </p>
                )}
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block text-gray-300">Sheriff Fee (%)</label>
                <Input
                  type="number"
                  value={sheriffFee}
                  onChange={(e) => setSheriffFee(e.target.value)}
                  placeholder="e.g., 1 for 1%"
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
                    Processing...
                  </>
                ) : (
                  'Create Market (Free - Season 1)'
                )}
              </Button>
            </form>

            {walletState?.address === 'mn_addr_preprod14svvcfsm22emrjml0fr28l3rp0frycej3gpju5qmtl9kz2ecjnaq6c2nlq' && (
              <div className="mt-8 pt-8 border-t border-gray-700">
                <h3 className="text-lg font-medium mb-4 text-white">Owner: Set Platform Fee</h3>
                <div className="flex space-x-4 items-end">
                  <div className="flex-1">
                    <label className="text-sm font-medium mb-2 block text-gray-300">Platform Fee (%)</label>
                    <Input
                      type="number"
                      step="0.01"
                      value={platformFee}
                      onChange={(e) => setPlatformFee(e.target.value)}
                      placeholder="e.g., 1 for 1%"
                      className="w-full"
                    />
                  </div>
                  <Button
                    onClick={async () => {
                      if (!platformFee) return toast.error('Enter a fee');
                      setLoading(true);
                      try {
                        const feeBps = Math.round(parseFloat(platformFee) * 100);
                        const result = await contractService.callFunction('set_platform_fee', [feeBps, walletState?.address]);
                        if (result.success) {
                          toast.success(`Platform fee set to ${platformFee}%`);
                          setPlatformFee('');
                        } else {
                          toast.error(result.message || 'Fee set failed');
                        }
                      } catch {
                        toast.error('Fee set failed');
                      } finally {
                        setLoading(false);
                      }
                    }}
                    disabled={loading}
                  >
                    {loading ? 'Setting...' : 'Set Platform Fee'}
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </main>
      <footer className="w-full max-w-4xl text-center py-4 text-gray-500 text-sm">
        © 2025 Night Mode. All rights reserved.
      </footer>
    </div>
  );
}

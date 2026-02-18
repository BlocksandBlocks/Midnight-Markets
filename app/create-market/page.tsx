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
import { useEffect } from 'react'; // For mode fetch
import { contractService } from '@/lib/CONTRACT_SERVICE'; // For mode read

export default function CreateMarket() {
  const router = useRouter();
  const { isConnected, walletState } = useWalletStore(); // Added walletState for auto-fill
  const [loading, setLoading] = useState(false);
  const [marketId, setMarketId] = useState('Auto'); // Auto-generated, read-only
  const [sheriffId, setSheriffId] = useState(''); // Temporary, real from mint
  const [marketName, setMarketName] = useState('');
  const [sheriffFee, setSheriffFee] = useState('');
  const [sheriffMode, setSheriffMode] = useState(0); // 0=Free, 1=Subscription, 2=NFT
  const [nameHash, setNameHash] = useState(''); // Computed hash
  const [previewPrice, setPreviewPrice] = useState(0); // Tiered price
  const [nameAvailable, setNameAvailable] = useState(true); // Availability check
  const [sheriffNftId, setSheriffNftId] = useState(''); // From mint response
  const [step, setStep] = useState(1); // 1: Name + Preview/Mint, 2: Create with NFT ID

  // Auto-populate sheriffId from wallet
  useEffect(() => {
    if (isConnected && walletState?.address) {
      setSheriffId(walletState.address.slice(-6)); // Mock short ID
    }
  }, [isConnected, walletState]);

  const computeHashAndPrice = async (name: string) => {
    if (!name) return;
  
    // Hash name (SHA-256 hex for Bytes<32>)
    const encoder = new TextEncoder();
    const data = encoder.encode(name);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hash = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    setNameHash(hash);
  
    // Tiered price (base 10 + geo 50 - niche 20/word >3)
    const wordCount = name.split(' ').length;
    const isGeo = name.toLowerCase().includes('la') || name.toLowerCase().includes('los angeles'); // Mock geo detect
    const nicheScore = wordCount > 3 ? (wordCount - 3) * 20 : 0; // Discount for specificity
    const geoPremium = isGeo ? 50 : 0;
    const price = 10 + geoPremium - nicheScore;
    setPreviewPrice(Math.max(price, 0));
  
    // Availability check (mock—real: contractService call to sheriff_names.member(nameHash))
    setNameAvailable(true); // Mock available
  };

  useEffect(() => {
  const fetchMode = async () => {
    try {
      // Mock mode for testing—real: contract read sheriff_mode
      setSheriffMode(0); // Mock Season 1 free—real: await contractService.getSheriffMode()
    } catch (error) {
      console.error('Mode fetch failed');
    }
  };
  fetchMode();
}, []);
  
  const computeHashAndPrice = async (name: string) => {
  if (!name) return;

  // Hash name (SHA-256 hex for Bytes<32>)
  const encoder = new TextEncoder();
  const data = encoder.encode(name);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hash = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  setNameHash(hash);

  // Tiered price (base 10 + geo 50 - niche 20/word >3)
  const wordCount = name.split(' ').length;
  const isGeo = name.toLowerCase().includes('la') || name.toLowerCase().includes('los angeles');
  const nicheScore = wordCount > 3 ? (wordCount - 3) * 20 : 0;
  const geoPremium = isGeo ? 50 : 0;
  const price = 10 + geoPremium - nicheScore;
  setPreviewPrice(Math.max(price, 0));

  setNameAvailable(true); // Mock—real contract check
};
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isConnected) {
      toast.error('Please connect your wallet first');
      return;
    }
    setLoading(true);
  
    try {
      if (step === 1) {
        // Step 1: Mint Sheriff NFT
        await computeHashAndPrice(marketName);
        const result = await contractService.callFunction('mint_sheriff_nft', [
          parseInt(sheriffId),
          nameHash,
          marketName.split(' ').length,
          true, // Mock geo
          2, // Mock niche count
          previewPrice,
        ]);
        if (result.success) {
          setSheriffNftId(result.data.nft_id || '1');
          setStep(2);
          toast.success('Sheriff NFT minted! Now create market.');
        } else {
          toast.error(result.message);
        }
        return;
      }
  
      if (step === 2) {
        // Step 2: Create Market with NFT ID
        // Auto Market ID (mock next—real: await contractService.getNextMarketId())
        const nextMarketId = 1; // Mock; real: from contract total_markets + 1
        
        const result = await contractService.callFunction('create_market', [
          nextMarketId,
          parseInt(sheriffNftId),
          marketName,
          parseInt(sheriffFee),
        ]);
        if (result.success) {
          toast.success(result.message || 'Market created successfully!');
          router.push('/markets');
        } else {
          toast.error(result.message);
        }
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
              <CardDescription className="text-center">
                Connect wallet to create your market.
              </CardDescription>
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
            <CardDescription className="text-center">
              Create your market and earn fees as Sheriff.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block text-gray-300">Market ID (Auto-generated)</label>
                <Input
                  type="text"
                  value={marketId}
                  disabled
                  className="bg-gray-800/50"
                />
              </div>
                {sheriffMode === 2 && (
                <div>
                  <label className="text-sm font-medium mb-2 block text-gray-300">Sheriff NFT ID (from mint)</label>
                  <Input
                    type="number"
                    value={sheriffNftId}
                    onChange={(e) => setSheriffNftId(e.target.value)}
                    placeholder="e.g., 1"
                    disabled={loading}
                    required
                  />
                </div>
              )}
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
                  disabled={loading || step > 1}
                  required
                />
                {previewPrice > 0 && (
                  <p className="text-xs text-gray-400 mt-1">
                    Est. Mint Cost: {previewPrice} $NIGHT | {nameAvailable ? 'Available' : 'Taken'}
                  </p>
                )}
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
                    Processing...
                  </>
                ) : sheriffMode === 0 ? (
                  'Create Market (Free - Season 1)'
                ) : sheriffMode === 2 ? (
                  'Mint Sheriff NFT & Create Market'
                ) : (
                  'Create Market' // Subscription mode placeholder
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </main>
      <footer className="w-full max-w-4xl text-center py-4 text-gray-500 text-sm">
        © 2024 Night Mode. All rights reserved.
      </footer>
    </div>
  );
}

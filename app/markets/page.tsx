'use client';

import Link from 'next/link';
import Image from 'next/image'; // Add this import for Next.js Image component
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { WalletConnect } from '@/components/wallet/WalletConnect';
import { ThemeToggle } from '@/components/theme/theme-toggle';
import { useState, useEffect } from 'react'; // For dynamic markets state
import { contractService } from '@/lib/CONTRACT_SERVICE'; // For mock state
import { useWalletStore } from '@/lib/stores/walletStore';
import { toast } from 'sonner';

const OWNER_WALLET_ADDRESS = 'mn_addr_preprod14svvcfsm22emrjml0fr28l3rp0frycej3gpju5qmtl9kz2ecjnaq6c2nlq';
const HIDDEN_MARKETS_STORAGE_KEY = 'nightmode.hiddenMarkets';

export default function Markets() {
    const { walletState } = useWalletStore();
    const isOwner = walletState?.address === OWNER_WALLET_ADDRESS;
    const [markets, setMarkets] = useState<Array<{
      id: number;
      name: string;
      sheriff: string;
      description: string;
      offersCount: number;
      image: string;
    }>>([]);
    const [hiddenMarketIds, setHiddenMarketIds] = useState<number[]>([]);

    useEffect(() => {
      const storedHiddenMarkets = localStorage.getItem(HIDDEN_MARKETS_STORAGE_KEY);
      if (!storedHiddenMarkets) return;

      try {
        const parsed = JSON.parse(storedHiddenMarkets) as number[];
        setHiddenMarketIds(parsed);
      } catch {
        setHiddenMarketIds([]);
      }
    }, []);

    useEffect(() => {
      // Fetch from mock state (updates on create)
      const state = contractService.getState();
      // Convert mock maps to array for render (adjust keys as needed)
      const dynamicMarkets = Object.entries(state.market_sheriffs).map(([idStr, sheriff_id]) => {
          const id = Number(idStr);
          const name = `Market ${id}`; // Mock name (real: from contract market_names map)
          return {
            id,
            name,
            sheriff: `Sheriff ${sheriff_id}`,
            description: name, // Use name as description (or add market_descriptions later)
            offersCount: 0, // Mock—real: count offers per market
            image: '/moon.png',
          };
        });
      setMarkets(dynamicMarkets);
    }, []);

    const updateHiddenMarkets = (ids: number[]) => {
      setHiddenMarketIds(ids);
      localStorage.setItem(HIDDEN_MARKETS_STORAGE_KEY, JSON.stringify(ids));
    };

    const toggleMarketHidden = (marketId: number, currentlyHidden: boolean) => {
      if (!isOwner) return;

      if (currentlyHidden) {
        const next = hiddenMarketIds.filter((id) => id !== marketId);
        updateHiddenMarkets(next);
        toast.success(`Market ${marketId} restored`);
      } else {
        const next = [...hiddenMarketIds, marketId];
        updateHiddenMarkets(next);
        toast.success(`Market ${marketId} hidden from frontend`);
      }
    };

    const visibleMarkets = isOwner
      ? markets
      : markets.filter((market) => !hiddenMarketIds.includes(market.id));

  return (
    <div className="min-h-screen bg-gradient-to-br from-midnight-black via-gray-900 to-midnight-blue flex flex-col items-center p-4">
      {/* Header */}
      <header className="w-full max-w-6xl flex justify-between items-center py-4">
        <Link href="/" className="text-4xl font-bold text-midnight-blue hover:underline">
          Night Mode
        </Link>
        <div className="flex items-center space-x-4">
          <WalletConnect />
          <ThemeToggle />
        </div>
      </header>

      {/* Instruction + Create Button */}
      <div className="w-full max-w-4xl text-center py-8">
        <h2 className="text-2xl font-bold text-white mb-4">Browse Existing Markets</h2>
        <p className="text-gray-300 mb-6">Don't see the market you need? Create one and become its Sheriff to earn fees.</p>
        <Link href="/create-market">
          <Button size="lg" className="bg-gradient-to-r from-midnight-blue to-blue-600 text-white shadow-lg"> {/* Solid gradient for brightness */}
            Create a Market (Become Sheriff)
          </Button>
        </Link>
      </div>

      {/* Markets Grid */}
      <main className="flex-grow w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-8">
        {visibleMarkets.map((market) => {
          const isHidden = hiddenMarketIds.includes(market.id);

          return (
          <Link key={market.id} href={`/markets/${market.id}`}>
            <Card className="bg-gray-900/50 text-white border border-gray-700/50 backdrop-blur-sm hover:border-midnight-blue/70 transition-all cursor-pointer">
              <CardHeader className="pb-4">
                <div className="relative w-full h-32 mb-4">
                  <Image
                    src={market.image}
                    alt={market.name}
                    fill
                    className="object-cover rounded-md opacity-50"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                </div>
                <CardTitle className="text-xl">{market.name}</CardTitle>
                <CardDescription className="text-gray-400">
                  {market.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="flex justify-between items-center mb-3">
                  <Badge variant="secondary" className="text-xs">
                    Sheriff: {market.sheriff}
                  </Badge>
                  <Badge variant={isHidden ? 'destructive' : 'outline'} className="text-xs">
                    {isHidden ? 'Hidden' : `${market.offersCount} Offers`}
                  </Badge>
                </div>

                {isOwner && (
                  <Button
                    variant={isHidden ? 'secondary' : 'destructive'}
                    size="sm"
                    className="w-full"
                    onClick={(event) => {
                      event.preventDefault();
                      event.stopPropagation();
                      toggleMarketHidden(market.id, isHidden);
                    }}
                  >
                    {isHidden ? 'Unhide Market' : 'Hide Market'}
                  </Button>
                )}
              </CardContent>
            </Card>
          </Link>
        )})}
      </main>

      {/* Footer */}
      <footer className="w-full max-w-4xl text-center py-4 text-gray-500 text-sm">
        © 2025 Night Mode. All rights reserved.
      </footer>
    </div>
  );
}

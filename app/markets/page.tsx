'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useCallback, useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { WalletConnect } from '@/components/wallet/WalletConnect';
import { ThemeToggle } from '@/components/theme/theme-toggle';
import { contractService } from '@/lib/CONTRACT_SERVICE';
import { useWalletStore } from '@/lib/stores/walletStore';
import { toast } from 'sonner';

const OWNER_WALLET_ADDRESS = 'mn_addr_preprod14svvcfsm22emrjml0fr28l3rp0frycej3gpju5qmtl9kz2ecjnaq6c2nlq';

interface MarketCard {
  id: number;
  name: string;
  sheriff: string;
  description: string;
  offersCount: number;
  image: string;
  isHidden: boolean;
}

export default function Markets() {
  const { walletState } = useWalletStore();
  const isOwner = walletState?.address === OWNER_WALLET_ADDRESS;
  const [markets, setMarkets] = useState<MarketCard[]>([]);

  const refreshMarkets = useCallback(() => {
    const state = contractService.getState();

    const dynamicMarkets = Object.entries(state.market_sheriffs).map(([idStr, sheriffId]) => {
      const id = Number(idStr);
      const name = state.market_names?.[id] || `Market ${id}`;
      const offersCount = Object.values(state.offers).filter((offer) => offer.market_id === id).length;
      const isHidden = Boolean(state.market_hidden?.[id]);

      return {
        id,
        name,
        sheriff: `Sheriff ${sheriffId}`,
        description: name,
        offersCount,
        image: '/moon.png',
        isHidden,
      };
    });

    setMarkets(dynamicMarkets);
  }, []);

  useEffect(() => {
    refreshMarkets();
  }, [refreshMarkets]);

  const toggleMarketHidden = async (marketId: number, currentlyHidden: boolean) => {
    if (!isOwner || !walletState?.address) return;

    const result = await contractService.callFunction('set_market_hidden', [
      marketId,
      !currentlyHidden,
      walletState.address,
    ]);

    if (!result.success) {
      toast.error(result.message || 'Failed to update market visibility');
      return;
    }

    toast.success(currentlyHidden ? `Market ${marketId} restored` : `Market ${marketId} hidden`);
    refreshMarkets();
  };

  const visibleMarkets = isOwner ? markets : markets.filter((market) => !market.isHidden);

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
        <p className="text-gray-300 mb-6">
          Don't see the market you need? Create one and become its Sheriff to earn fees.
        </p>
        <Link href="/create-market">
          <Button size="lg" className="bg-gradient-to-r from-midnight-blue to-blue-600 text-white shadow-lg">
            Create a Market (Become Sheriff)
          </Button>
        </Link>
      </div>

      {/* Markets Grid */}
      <main className="flex-grow w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-8">
        {visibleMarkets.map((market) => (
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
                <CardDescription className="text-gray-400">{market.description}</CardDescription>
              </CardHeader>

              <CardContent className="pt-0">
                <div className="flex justify-between items-center mb-3">
                  <Badge variant="secondary" className="text-xs">
                    Sheriff: {market.sheriff}
                  </Badge>
                  <Badge variant={market.isHidden ? 'destructive' : 'outline'} className="text-xs">
                    {market.isHidden ? 'Hidden' : `${market.offersCount} Offers`}
                  </Badge>
                </div>

                {isOwner && (
                  <Button
                    variant={market.isHidden ? 'secondary' : 'destructive'}
                    size="sm"
                    className="w-full"
                    onClick={(event) => {
                      event.preventDefault();
                      event.stopPropagation();
                      toggleMarketHidden(market.id, market.isHidden);
                    }}
                  >
                    {market.isHidden ? 'Unhide Market' : 'Hide Market'}
                  </Button>
                )}
              </CardContent>
            </Card>
          </Link>
        ))}
      </main>

      {/* Footer */}
      <footer className="w-full max-w-4xl text-center py-4 text-gray-500 text-sm">
        © 2025 Night Mode. All rights reserved.
      </footer>
    </div>
  );
}

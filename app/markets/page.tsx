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

export default function Markets() {
    const [markets, setMarkets] = useState([]); // Dynamic markets from state

    useEffect(() => {
      // Fetch from mock state (updates on create)
      const state = contractService.getState();
      // Convert mock maps to array for render (adjust keys as needed)
      const dynamicMarkets = Object.entries(state.market_sheriffs).map(([idStr, sheriff_id]) => {
          const id = Number(idStr);
          return {
            id,
            name: state.market_names[id] || 'Unnamed Market',
            sheriff: `Sheriff ${sheriff_id}`,
            description: 'Mock description',
            offersCount: 0,
            image: '/moon.png',
          };
        });
        id: Number(id),
        name: state.market_names[id] || 'Unnamed Market',
        sheriff: `Sheriff ${sheriff_id}`,
        description: 'Mock description',
        offersCount: 0, // Mock—real from offers map
        image: '/moon.png',
      }));
      setMarkets(dynamicMarkets);
    }, []);
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
        {markets.map((market) => (
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
                <div className="flex justify-between items-center">
                  <Badge variant="secondary" className="text-xs">
                    Sheriff: {market.sheriff}
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    {market.offersCount} Offers
                  </Badge>
                </div>
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

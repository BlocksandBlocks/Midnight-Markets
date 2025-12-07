'use client';

import Link from 'next/link';
import Image from 'next/image'; // Add this import for Next.js Image component
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { WalletConnect } from '@/components/wallet/WalletConnect';
import { NetworkStatus } from '@/components/network/NetworkStatus';
import { ThemeToggle } from '@/components/theme/theme-toggle';

// Mock markets data (replace with real API fetch later)
const markets = [
  {
    id: 1,
    name: 'Electronics',
    sheriff: 'SheriffTechPro',
    description: 'Gadgets, phones, laptops—tech deals secured.',
    offersCount: 15,
    image: '/moon.png', // Reuse moon or add category icons
  },
  {
    id: 2,
    name: 'Freelance Services',
    sheriff: 'SheriffGigMaster',
    description: 'Design, writing, coding—hire talent privately.',
    offersCount: 28,
    image: '/moon.png',
  },
  {
    id: 3,
    name: 'Art & Collectibles',
    sheriff: 'SheriffArtGuard',
    description: 'Digital art, NFTs, rarities—creative trades.',
    offersCount: 9,
    image: '/moon.png',
  },
  // Add more mocks as needed
];

export default function Markets() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-midnight-black via-gray-900 to-midnight-blue flex flex-col items-center p-4">
      {/* Header */}
      <header className="w-full max-w-6xl flex justify-between items-center py-4">
        <h1 className="text-4xl font-bold text-midnight-blue">Night Mode Markets</h1>
        <div className="flex items-center space-x-4">
          <NetworkStatus />
          <WalletConnect />
          <ThemeToggle />
        </div>
      </header>

      {/* Instruction + Create Button */}
      <div className="w-full max-w-4xl text-center py-8">
        <h2 className="text-2xl font-bold text-white mb-4">Browse Existing Markets</h2>
        <p className="text-gray-300 mb-6">Don't see the market you need? Create one and become its Sheriff to earn fees.</p>
        <Link href="/create-market">
          <Button size="lg" variant="outline" className="border-midnight-blue text-midnight-blue hover:bg-midnight-blue hover:text-white">
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
        © 2024 Night Mode. All rights reserved.
      </footer>
    </div>
  );
}

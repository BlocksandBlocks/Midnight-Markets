'use client';

import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';
import { WalletConnect } from '@/components/wallet/WalletConnect';
import { NetworkStatus } from '@/components/network/NetworkStatus';
import { ThemeToggle } from '@/components/theme/theme-toggle';

// Mock markets data (same as /markets page—fetch real from API later)
const markets = [
  {
    id: 1,
    name: 'Electronics',
    sheriff: 'SheriffTechPro',
    description: 'Gadgets, phones, laptops—tech deals secured.',
    offersCount: 15,
    image: '/moon.png',
    offers: [
      { id: 101, seller: 'UserA', amount: 500, title: 'iPhone 15 Pro' },
      { id: 102, seller: 'UserB', amount: 200, title: 'Wireless Headphones' },
    ],
  },
  {
    id: 2,
    name: 'Freelance Services',
    sheriff: 'SheriffGigMaster',
    description: 'Design, writing, coding—hire talent privately.',
    offersCount: 28,
    image: '/moon.png',
    offers: [
      { id: 201, seller: 'DesignerX', amount: 300, title: 'Logo Design' },
      { id: 202, seller: 'WriterY', amount: 150, title: 'Blog Post' },
    ],
  },
  {
    id: 3,
    name: 'Art & Collectibles',
    sheriff: 'SheriffArtGuard',
    description: 'Digital art, NFTs, rarities—creative trades.',
    offersCount: 9,
    image: '/moon.png',
    offers: [
      { id: 301, seller: 'ArtistZ', amount: 1000, title: 'NFT Artwork' },
    ],
  },
];

interface Market {
  id: number;
  name: string;
  sheriff: string;
  description: string;
  offersCount: number;
  image: string;
  offers: Array<{ id: number; seller: string; amount: number; title: string }>;
}

export default async function MarketPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const marketId = parseInt(id);
  const market = markets.find((m) => m.id === marketId) as Market;

  if (!market) {
    notFound(); // Next.js 404 if market not found
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-midnight-black via-gray-900 to-midnight-blue flex flex-col p-4">
      {/* Header */}
      <header className="w-full max-w-6xl mx-auto flex justify-between items-center py-4">
        <Link href="/markets" className="text-xl font-bold text-midnight-blue hover:underline">
          ← Back to Markets
        </Link>
        <div className="flex items-center space-x-4">
          <NetworkStatus />
          <WalletConnect />
          <ThemeToggle />
        </div>
      </header>

      {/* Market Hero */}
      <div className="w-full max-w-6xl mx-auto mb-8">
        <div className="relative w-full h-48 mb-4">
          <Image
            src={market.image}
            alt={`${market.name} Banner`}
            fill
            className="object-cover opacity-40 rounded-md"
            sizes="100vw"
          />
        </div>
        <div className="text-center">
          <h1 className="text-3xl font-bold text-white mb-2">{market.name}</h1>
          <p className="text-gray-300 mb-4">{market.description}</p>
          <Badge variant="secondary" className="text-sm">
            Sheriff: {market.sheriff} | {market.offersCount} Active Offers
          </Badge>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="w-full max-w-6xl mx-auto flex flex-col md:flex-row gap-4 mb-8 justify-center">
        <Link href={`/markets/${marketId}/post-offer`}>
          <Button size="lg" className="w-full md:w-auto bg-gradient-to-r from-midnight-blue to-blue-600 text-white shadow-lg">
            Post Offer
          </Button>
        </Link>
        <Button size="lg" variant="outline" className="w-full md:w-auto border-midnight-blue text-midnight-blue hover:bg-midnight-blue hover:text-white">
          Accept Offer
        </Button>
        <Button size="lg" variant="destructive" className="w-full md:w-auto bg-red-600 hover:bg-red-700 text-white">
          Cancel Offer
        </Button>
        <Button size="lg" variant="secondary" className="w-full md:w-auto bg-purple-600 hover:bg-purple-700 text-white">
          Submit Proof
        </Button>
      </div>

      {/* Offers List */}
      <main className="flex-grow w-full max-w-6xl grid grid-cols-1 gap-6 pb-8">
        <h2 className="text-2xl font-bold text-white col-span-full">Active Offers</h2>
        {market.offers.map((offer) => (
          <Card key={offer.id} className="bg-gray-900/50 text-white border border-gray-700/50">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg">{offer.title}</CardTitle>
              <CardDescription className="text-gray-400">
                Seller: {offer.seller} | Amount: {offer.amount} $Night
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="flex justify-end space-x-2">
                <Button variant="outline" size="sm">Accept</Button>
                <Button variant="destructive" size="sm">Cancel</Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </main>

      {/* Footer */}
      <footer className="w-full max-w-4xl text-center py-4 text-gray-500 text-sm">
        © 2024 Night Mode. All rights reserved.
      </footer>
    </div>
  );
}

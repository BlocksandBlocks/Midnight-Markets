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
    name: 'Cardano/Midnight Dev Work',
    sheriff: 'SheriffDevs',
    description: 'Aiken, Plutus, Typescript, Compact, etc',
    offersCount: 15,
    image: '/moon.png',
    offers: [
      { id: 101, seller: 'UserA', amount: 500, title: 'Aiken Dev For Hire' },
      { id: 102, seller: 'UserB', amount: 200, title: 'Three Person Typescript Dev Team For Hire' },
    ],
  },
  {
    id: 2,
    name: 'Freelance Design/Writing Services',
    sheriff: 'SheriffGigMaster',
    description: 'Design, writing, graphics',
    offersCount: 28,
    image: '/moon.png',
    offers: [
      { id: 201, seller: 'DesignerX', amount: 300, title: 'Logo Design' },
      { id: 202, seller: 'WriterY', amount: 150, title: 'Blog Post' },
    ],
  },
  {
    id: 3,
    name: 'Professional Services',
    sheriff: 'SheriffProfessionalServices',
    description: 'Accountants, Attorneys, Bookkeepers, etc',
    offersCount: 9,
    image: '/moon.png',
    offers: [
      { id: 301, seller: 'ADALawyer', amount: 1000, title: 'Cardano Attorney' },
      { id: 302, seller: 'NightAccountant', amount: 500, title: 'Midnight Project Accounting' },
    ],
  },
  {
    id: 4,
    name: 'Home Services',
    sheriff: 'SheriffHomeServices',
    description: 'Electricians | Plumbers | HVAC | etc',
    offersCount: 9,
    image: '/moon.png',
    offers: [
      { id: 301, seller: 'ADAElectro', amount: 1000, title: 'Electrician Accepting ADA' },
      { id: 302, seller: 'NightPlumber', amount: 500, title: 'Plumber Accepting Djed/Moneta/ADA/Night' },
    ],
  },
  {
    id: 5,
    name: 'Language Lessons',
    sheriff: 'SheriffLanguageLessons',
    description: 'Language lessons over video call',
    offersCount: 9,
    image: '/moon.png',
    offers: [
      { id: 301, seller: 'SpanishTeacher', amount: 1000, title: 'Spanish Lessons' },
      { id: 302, seller: 'KoreanProf', amount: 500, title: 'Korean Lessons' },
    ],
  },
  {
    id: 6,
    name: 'Fitness Coaching',
    sheriff: 'SheriffFitnessCoaching',
    description: 'Fitness coaching over video call',
    offersCount: 9,
    image: '/moon.png',
    offers: [
      { id: 301, seller: 'KettlebellAndy', amount: 300, title: 'Kettlebell Class' },
      { id: 302, seller: 'NickCalesthenics', amount: 50, title: 'Daily Fitness Bootcamp in your Living Room' },
    ],
  },
  {
    id: 7,
    name: 'Misc. Zoom Lessons',
    sheriff: 'SheriffMisc.ZoomLessons',
    description: 'Guitar | Cooking | Crafts',
    offersCount: 9,
    image: '/moon.png',
    offers: [
      { id: 301, seller: 'GuitarwithMarco', amount: 1000, title: 'Spanish Guitar' },
      { id: 302, seller: 'JuliaCooking', amount: 500, title: 'Macaron Baking Class' },
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

      {/* Action Buttons – Only Post Offer at Top */}
      <div className="w-full max-w-6xl mx-auto flex flex-col md:flex-row gap-4 mb-8 justify-center">
        <Link href={`/markets/${marketId}/post-offer`}>
          <Button size="lg" className="w-full md:w-auto bg-gradient-to-r from-midnight-blue to-blue-600 text-white shadow-lg">
            Post Offer
          </Button>
        </Link>
      </div>

      {/* Offers List with Per-Offer Buttons */}
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
                <Link href={`/markets/${marketId}/accept-offer?offerId=${offer.id}`}>
                  <Button variant="outline" size="sm">Accept</Button>
                </Link>
                <Link href={`/markets/${marketId}/cancel-offer?offerId=${offer.id}`}>
                  <Button variant="destructive" size="sm">Cancel</Button>
                </Link>
                <Link href={`/markets/${marketId}/submit-proof?offerId=${offer.id}`}>
                  <Button variant="secondary" size="sm">Submit Proof</Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        ))}
      </main>

      {/* Footer */}
      <footer className="w-full max-w-4xl text-center py-4 text-gray-500 text-sm">
        © 2025 Night Mode. All rights reserved.
      </footer>
    </div>
  );
}

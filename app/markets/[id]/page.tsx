'use client';

import { useParams } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';
import { WalletConnect } from '@/components/wallet/WalletConnect';
import { ThemeToggle } from '@/components/theme/theme-toggle';
import { contractService } from '@/lib/CONTRACT_SERVICE';
import { useWalletStore } from '@/lib/stores/walletStore';
import { toast } from 'sonner';

const OWNER_WALLET_ADDRESS = 'mn_addr_preprod14svvcfsm22emrjml0fr28l3rp0frycej3gpju5qmtl9kz2ecjnaq6c2nlq';

// Keep existing seeded demo markets for now
const markets = [
  {
    id: 1,
    name: 'Cardano/Midnight Dev Work',
    sheriff: 'SheriffDevs',
    description: 'Aiken | Plutus | Typescript | Compact | etc',
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
    description: 'Design | writing | graphics',
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
    description: 'Accountants | Attorneys | Bookkeepers | etc',
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
      { id: 401, seller: 'ADAElectro', amount: 1000, title: 'Electrician Accepting ADA' },
      { id: 402, seller: 'NightPlumber', amount: 500, title: 'Plumber Accepting Djed/Moneta/ADA/Night' },
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
      { id: 501, seller: 'SpanishTeacher', amount: 1000, title: 'Spanish Lessons' },
      { id: 502, seller: 'KoreanProf', amount: 500, title: 'Korean Lessons' },
      { id: 503, seller: 'PolishLinguist', amount: 500, title: 'Polish Lessons' },
    ],
  },
  {
    id: 6,
    name: 'Fitness/Sport Coaching',
    sheriff: 'SheriffFitnessCoaching',
    description: 'Fitness coaching over video call',
    offersCount: 9,
    image: '/moon.png',
    offers: [
      { id: 601, seller: 'KettlebellAndy', amount: 300, title: 'Kettlebell Class' },
      { id: 602, seller: 'NickCalesthenics', amount: 400, title: 'Daily Fitness Bootcamp in your Living Room' },
      { id: 603, seller: 'CoachKevin', amount: 750, title: 'Shadow Boxing' },
      { id: 604, seller: 'KruLek', amount: 650, title: 'Muay Thai Technique' },
      { id: 605, seller: 'Mark', amount: 350, title: 'Grappling Roll Analysis' },
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
      { id: 701, seller: 'GuitarwithMarco', amount: 2000, title: 'Spanish Guitar' },
      { id: 702, seller: 'JuliaCooking', amount: 600, title: 'Macaron Baking Class' },
    ],
  },
  {
    id: 8,
    name: 'Vibecoding Academy',
    sheriff: 'SheriffVibecodingAcademy',
    description: 'Vibecode Everything',
    offersCount: 9,
    image: '/moon.png',
    offers: [
      { id: 801, seller: 'CodemMaster', amount: 2000, title: 'Vibecode in Typescript' },
      { id: 802, seller: 'LeetLord', amount: 600, title: 'AI and Aiken for You' },
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

export default function MarketPage() {
  const params = useParams();
  const marketId = parseInt(params.id as string, 10);
  const market = markets.find((m) => m.id === marketId) as Market;

  const { isConnected, walletState } = useWalletStore();
  const [actionLoading, setActionLoading] = useState<number | null>(null);
  const [hiddenOfferIds, setHiddenOfferIds] = useState<number[]>([]);

  const refreshHiddenOffers = useCallback(() => {
    const state = contractService.getState();
    const hidden = Object.entries(state.offer_hidden || {})
      .filter(([, isHidden]) => isHidden)
      .map(([id]) => Number(id));
    setHiddenOfferIds(hidden);
  }, []);

  useEffect(() => {
    refreshHiddenOffers();
  }, [refreshHiddenOffers]);

  if (!market) {
    notFound();
  }

  const isOwner = walletState?.address === OWNER_WALLET_ADDRESS;
  const state = contractService.getState();
  const marketSheriff = state.market_sheriffs?.[marketId];
  const isSheriff = Boolean(walletState?.address && marketSheriff && String(marketSheriff) === walletState.address);
  const canModerateOffers = isOwner || isSheriff;

  const toggleOfferHidden = async (offerId: number, currentlyHidden: boolean) => {
    if (!canModerateOffers || !walletState?.address) return;

    const functionName = isOwner ? 'set_offer_hidden' : 'set_offer_hidden_by_sheriff';
    const params = isOwner
      ? [offerId, !currentlyHidden, walletState.address]
      : [offerId, marketId, walletState.address, !currentlyHidden];

    const result = await contractService.callFunction(functionName, params);

    if (!result.success) {
      toast.error(result.message || 'Failed to update offer visibility');
      return;
    }

    toast.success(currentlyHidden ? `Offer ${offerId} restored` : `Offer ${offerId} hidden`);
    refreshHiddenOffers();
  };

  const isTimeout = () => {
    return true; // mock timeout behavior for now
  };

  const handleBuyerRefund = async (offerId: number) => {
    if (!isConnected) {
      toast.error('Connect wallet first');
      return;
    }
    setActionLoading(offerId);
    try {
      const result = await contractService.callFunction('buyer_refund_timeout', [offerId]);
      if (result.success) {
        toast.success('Escrow refunded!');
      } else {
        toast.error(result.message || 'Refund failed');
      }
    } catch {
      toast.error('Refund failed');
    } finally {
      setActionLoading(null);
    }
  };

  const handleSellerClaim = async (offerId: number) => {
    if (!isConnected) {
      toast.error('Connect wallet first');
      return;
    }
    setActionLoading(offerId);
    try {
      const result = await contractService.callFunction('seller_refund_timeout', [offerId]);
      if (result.success) {
        toast.success('Funds claimed!');
      } else {
        toast.error(result.message || 'Claim failed');
      }
    } catch {
      toast.error('Claim failed');
    } finally {
      setActionLoading(null);
    }
  };

  const visibleOffers = canModerateOffers
    ? market.offers
    : market.offers.filter((offer) => !hiddenOfferIds.includes(offer.id));

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

      {/* Action Buttons */}
      <div className="w-full max-w-6xl mx-auto flex flex-col md:flex-row gap-4 mb-8 justify-center">
        <Link href={`/markets/${marketId}/post-offer`}>
          <Button size="lg" className="w-full md:w-auto bg-gradient-to-r from-midnight-blue to-blue-600 text-white shadow-lg">
            Post Offer
          </Button>
        </Link>
      </div>

      {/* Offers */}
      <main className="flex-grow w-full max-w-6xl grid grid-cols-1 gap-6 pb-8">
        <h2 className="text-2xl font-bold text-white col-span-full">Active Offers</h2>
        {visibleOffers.map((offer) => {
          const isHidden = hiddenOfferIds.includes(offer.id);

          return (
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

                  {walletState?.address && isTimeout() && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleBuyerRefund(offer.id)}
                      disabled={actionLoading === offer.id}
                    >
                      {actionLoading === offer.id ? 'Refunding...' : 'Refund Escrow'}
                    </Button>
                  )}

                  {walletState?.address && isTimeout() && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleSellerClaim(offer.id)}
                      disabled={actionLoading === offer.id}
                    >
                      {actionLoading === offer.id ? 'Claiming...' : 'Claim Funds'}
                    </Button>
                  )}

                  {canModerateOffers && (
                    <Button
                      variant={isHidden ? 'secondary' : 'destructive'}
                      size="sm"
                      onClick={() => toggleOfferHidden(offer.id, isHidden)}
                    >
                      {isHidden ? 'Unhide Offer' : 'Hide Offer'}
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </main>

      {/* Footer */}
      <footer className="w-full max-w-4xl text-center py-4 text-gray-500 text-sm">
        © 2025 Night Mode. All rights reserved.
      </footer>
    </div>
  );
}

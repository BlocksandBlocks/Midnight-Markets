'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation'; // For redirect
import { useParams, useSearchParams } from 'next/navigation'; // For marketId and query params
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { WalletConnect } from '@/components/wallet/WalletConnect';
import { NetworkStatus } from '@/components/network/NetworkStatus';
import { ThemeToggle } from '@/components/theme/theme-toggle';
import { useWalletStore } from '@/lib/stores/walletStore';
import { contractService } from '@/lib/CONTRACT_SERVICE';
import { toast } from 'sonner';
import { Loader2, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

// Mock markets for back link lookup
const markets = [
  { id: 1, name: 'Electronics' },
  { id: 2, name: 'Freelance Services' },
  { id: 3, name: 'Art & Collectibles' },
];

export default function CancelOffer() {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams(); // Reads ?offerId from URL
  const marketId = parseInt(params.id as string);
  const market = markets.find((m) => m.id === marketId);
  const { isConnected } = useWalletStore();
  const [loading, setLoading] = useState(false);
  const [offerId, setOfferId] = useState(searchParams.get('offerId') || ''); // Autofill from query param
  const [sellerId, setSellerId] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isConnected) {
      toast.error('Please connect your wallet first');
      return;
    }
    setLoading(true);
    try {
      const result = await contractService.callFunction('cancel_offer_by_seller', [
        parseInt(offerId),
        parseInt(sellerId),
      ]);
      if (result.success) {
        toast.success(result.message || 'Offer canceled successfully!');
        router.push(`/markets/${marketId}`);
      } else {
        toast.error(result.message || 'Failed to cancel offer');
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Cancel failed');
    } finally {
      setLoading(false);
    }
  };

  if (!market) {
    return <div>Market not found</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-midnight-black via-gray-900 to-midnight-blue flex flex-col p-4">
      {/* Header */}
      <header className="w-full max-w-4xl mx-auto flex justify-between

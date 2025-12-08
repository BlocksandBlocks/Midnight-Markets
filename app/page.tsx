'use client';

import Image from 'next/image';
import Link from 'next/link'; // For navigation
import { Button } from '@/components/ui/button';
import { WalletConnect } from '@/components/wallet/WalletConnect';
import { NetworkStatus } from '@/components/network/NetworkStatus';
import { ThemeToggle } from '@/components/theme/theme-toggle';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-midnight-black via-gray-900 to-midnight-blue flex flex-col items-center p-4">
      {/* Header */}
      <header className="w-full max-w-6xl flex justify-between items-center py-4">
        <h1 className="text-4xl font-bold text-white drop-shadow-lg">Night Mode</h1>
        <div className="flex items-center space-x-4">
          <NetworkStatus />
          <WalletConnect />
          <ThemeToggle />
        </div>
      </header>

      {/* Hero Moon Banner – Full rectangular prominent */}
      <div className="w-full mb-12">
        <div className="relative w-full h-[900px]"> {/* Tall for full uncropped rectangular */}
          <Image
            src="/moon.png"
            alt="Crescent Moon – Symbol of Night Mode"
            fill
            className="object-contain opacity-60" // Full image, brighter
            priority
            sizes="100vw"
          />
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-grow flex flex-col justify-center items-center w-full max-w-4xl py-8 text-center">
        {/* Hook Title */}
        <h2 className="text-2xl font-bold text-white mb-4">Your day job sucks. Your night job can be better.</h2>
        <p className="text-gray-300 mb-8 leading-relaxed">
          Night Mode is a world of decentralized marketplaces where you can trade anything from services to real-world goods. 
          Each category is a dedicated market run by a Sheriff.
        </p>

        {/* How It Works */}
        <div className="space-y-6 mb-12">
          <div className="bg-gray-800/50 p-6 rounded-lg">
            <h3 className="text-xl font-semibold text-white mb-2">Initiate or Accept Offers</h3>
            <p className="text-gray-300">Buyers or sellers post offers. Anyone can accept—the purchase price is locked in a smart contract.</p>
          </div>
          <div className="bg-gray-800/50 p-6 rounded-lg">
            <h3 className="text-xl font-semibold text-white mb-2">Sheriff-Verified Delivery</h3>
            <p className="text-gray-300">Seller submits proof of delivery. The market's Sheriff reviews and releases funds—smooth and private.</p>
          </div>
        </div>

        {/* Prominent Buttons */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <Link href="/markets">
            <Button size="lg" className="w-full md:w-auto bg-gradient-to-r from-midnight-blue to-blue-600 text-white shadow-lg">
              Browse Markets
            </Button>
          </Link>
          <Link href="/create-market">
            <Button size="lg" className="w-full md:w-auto bg-gradient-to-r from-midnight-blue to-blue-600 text-white shadow-lg">
              Create a Market (Become Sheriff)
            </Button>
          </Link>
        </div>

        {/* Instruction Text */}
        <p className="text-gray-500 text-sm">
          Don't see the market you need? Create one and become its Sheriff to earn fees.
        </p>
      </main>

      {/* Footer */}
      <footer className="w-full max-w-4xl text-center py-4 text-gray-500 text-sm">
        © 2024 Night Mode. All rights reserved.
      </footer>
    </div>
  );
}

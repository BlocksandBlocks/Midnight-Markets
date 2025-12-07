import { ContractInterface } from '@/components/contract/ContractInterface';
import { WalletConnect } from '@/components/wallet/WalletConnect';
import { NetworkStatus } from '@/components/network/NetworkStatus';
import { ThemeToggle } from '@/components/theme/theme-toggle';

export default function Home() {
  return (
    <div className="min-h-screen bg-midnight-black text-midnight-white flex flex-col items-center p-4">
      <header className="w-full max-w-4xl flex justify-between items-center py-4">
        <h1 className="text-4xl font-bold text-midnight-blue">Night Mode</h1> 
        <div className="flex items-center space-x-4">
          <NetworkStatus />
          <WalletConnect />
          <ThemeToggle />
        </div>
      </header>

      <main className="flex-grow flex flex-col justify-center items-center w-full max-w-4xl py-8">
        <ContractInterface />
      </main>

      <footer className="w-full max-w-4xl text-center py-4 text-gray-500 text-sm">
        © 2025 Night Mode. All rights reserved.
      </footer>
    </div>
  );
}

'use client'

import { Button } from '@/components/ui/button'
import { useWalletStore } from '@/lib/stores/walletStore'
import { Loader2, Wallet } from 'lucide-react'
import { DAppConnectorAPI } from '@midnight-ntwrk/dapp-connector-api'; // Lace API
import { useWalletStore } from '@/lib/stores/walletStore'; // For state
import { toast } from 'sonner'; // For errors

function WalletConnect() {
  const { isConnected, isConnecting, connect, disconnect, walletState } = useWalletStore()

  const handleConnect = async () => {
    try {
      await connect()
    } catch (error) {
      console.error('Failed to connect wallet:', error)
    }
  }

  function WalletConnect() {
  const { isConnected, walletState, setWallet } = useWalletStore(); // Assume setWallet in store for address

  const handleConnect = async () => {
    try {
      const api = await (window.midnight?.lace?.enable() || Promise.resolve(null));
      if (!api) {
        toast.error('Lace wallet not found. Install the extension.');
        return;
      }
      const accounts = await api.getAccounts();
      if (accounts.length > 0) {
        setWallet(accounts[0]); // Update store with address
        toast.success(`Connected: ${accounts[0].address.slice(0, 6)}...${accounts[0].address.slice(-4)}`);
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Connect failed');
    }
  };

  const handleDisconnect = () => {
    setWallet(null); // Clear store
    toast.success('Disconnected');
  };

  return (
    <Button variant="outline" size="sm" onClick={isConnected ? handleDisconnect : handleConnect}>
      {isConnected ? `${walletState.address.slice(0, 6)}...${walletState.address.slice(-4)}` : 'Connect Wallet'}
    </Button>
  );
}

export { WalletConnect }

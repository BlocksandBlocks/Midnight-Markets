'use client';

import { Button } from '@/components/ui/button';
import { useWalletStore } from '@/lib/stores/walletStore';
import { toast } from 'sonner';

function WalletConnect() {
  const { isConnected, walletState, connect, disconnect } = useWalletStore();

  const handleConnect = async () => {
    try {
      await connect(); // Use store's connect (real Lace in store)
      if (walletState?.address) {
        toast.success(`Connected: ${walletState.address.slice(0, 6)}...${walletState.address.slice(-4)}`);
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Connect failed');
    }
  };

  const handleDisconnect = () => {
    disconnect(); // Use store's disconnect
    toast.success('Disconnected');
  };

  return (
    <Button variant="outline" size="sm" onClick={isConnected ? handleDisconnect : handleConnect}>
      {isConnected ? `${walletState?.address?.slice(0, 6)}...${walletState?.address?.slice(-4)}` : 'Connect Wallet'}
    </Button>
  );
}

export { WalletConnect };

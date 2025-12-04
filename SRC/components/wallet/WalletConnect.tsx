'use client'

import { Button } from '@/components/ui/button'
import { useWalletStore } from '@/lib/stores/walletStore'
import { Loader2, Wallet } from 'lucide-react'

export function WalletConnect() {
  const { isConnected, isConnecting, connect, disconnect, walletState } = useWalletStore()

  const handleConnect = async () => {
    try {
      await connect()
    } catch (error) {
      console.error('Failed to connect wallet:', error)
    }
  }

  const handleDisconnect = async () => {
    try {
      await disconnect()
    } catch (error) {
      console.error('Failed to disconnect wallet:', error)
    }
  }

  if (isConnected && walletState) {
    return (
      <Button
        onClick={handleDisconnect}
        variant="outline"
        size="sm"
        className="flex items-center gap-2"
      >
        <div className="h-2 w-2 rounded-full bg-green-500" />
        <span className="text-xs">
          {walletState.address?.slice(0, 6)}...{walletState.address?.slice(-4)}
        </span>
      </Button>
    )
  }

  return (
    <Button
      onClick={handleConnect}
      disabled={isConnecting}
      variant="default"
      size="sm"
      className="flex items-center gap-2"
    >
      {isConnecting ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin" />
          <span className="text-xs">Connecting...</span>
        </>
      ) : (
        <>
          <Wallet className="h-4 w-4" />
          <span className="text-xs">Connect Midnight</span>
        </>
      )}
    </Button>
  )
}
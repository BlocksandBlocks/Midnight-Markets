'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useWalletStore } from '@/lib/stores/walletStore'
import { Loader2, Wallet, CheckCircle, XCircle } from 'lucide-react'

export function MidnightWalletConnect() {
  const { isConnected, isConnecting, connect, disconnect, walletState, error } = useWalletStore()

  const handleConnect = async () => {
    try {
      await connect()
    } catch (error) {
      console.error('Failed to connect wallet:', error)
    }
  }

  if (isConnected && walletState) {
    return (
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-green-500" />
            Midnight Lace Connected
          </CardTitle>
          <CardDescription>
            Your wallet is connected to the Midnight network
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm font-medium">Address:</span>
              <span className="text-sm font-mono">
                {walletState.address?.slice(0, 8)}...{walletState.address?.slice(-6)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm font-medium">Network:</span>
              <Badge variant="outline">{walletState.chainId}</Badge>
            </div>
            <div className="flex justify-between">
              <span className="text-sm font-medium">Status:</span>
              <Badge variant="success">Connected</Badge>
            </div>
          </div>
          <Button
            onClick={disconnect}
            variant="outline"
            size="sm"
            className="w-full"
          >
            Disconnect Wallet
          </Button>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <XCircle className="h-5 w-5 text-red-500" />
            Connection Failed
          </CardTitle>
          <CardDescription className="text-red-600">
            {error}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button
            onClick={handleConnect}
            variant="default"
            size="sm"
            className="w-full"
          >
            <Wallet className="mr-2 h-4 w-4" />
            Try Again
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Wallet className="h-5 w-5" />
          Connect Midnight Lace
        </CardTitle>
        <CardDescription>
          Connect your Midnight Lace wallet to interact with privacy-preserving smart contracts
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Button
          onClick={handleConnect}
          disabled={isConnecting}
          variant="default"
          size="sm"
          className="w-full"
        >
          {isConnecting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Connecting...
            </>
          ) : (
            <>
              <Wallet className="mr-2 h-4 w-4" />
              Connect Midnight Lace
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  )
}
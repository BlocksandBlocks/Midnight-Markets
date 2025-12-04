'use client'

import { Badge } from '@/components/ui/badge'
import { useWalletStore } from '@/lib/stores/walletStore'
import { Wifi, WifiOff } from 'lucide-react'

export function NetworkStatus() {
  const { isConnected } = useWalletStore()

  if (!isConnected) {
    return (
      <div className="flex items-center gap-2">
        <WifiOff className="h-4 w-4 text-muted-foreground" />
        <Badge variant="secondary">Offline</Badge>
      </div>
    )
  }

  return (
    <div className="flex items-center gap-2">
      <Wifi className="h-4 w-4 text-green-500" />
      <Badge variant="success">Midnight</Badge>
    </div>
  )
}
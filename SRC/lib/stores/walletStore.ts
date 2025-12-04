import { create } from 'zustand'

interface WalletState {
  address: string | null
  publicKey: string | null
  chainId: string
  balances: any[]
  isConnected: boolean
  isLocked: boolean
}

interface WalletStore {
  // State
  isConnected: boolean
  isConnecting: boolean
  walletState: WalletState | null
  error: string | null
  
  // Actions
  connect: () => Promise<void>
  disconnect: () => Promise<void>
  refreshState: () => Promise<void>
  clearError: () => void
}

export const useWalletStore = create<WalletStore>((set, get) => ({
  // Initial state
  isConnected: false,
  isConnecting: false,
  walletState: null,
  error: null,

  // Actions
  connect: async () => {
    set({ isConnecting: true, error: null })
    
    try {
      // Check if Midnight Lace wallet is available
      if (typeof window === 'undefined' || !window.midnight?.mnLace) {
        throw new Error('Midnight Lace wallet not found. Please install the extension.')
      }

      const api = window.midnight.mnLace
      
      // Check if already enabled
      const isEnabled = await api.isEnabled()
      
      if (!isEnabled) {
        // Request permission
        await api.enable()
      }

      // Get wallet state
      const walletState: WalletState = {
        address: 'midnight1234...5678', // Placeholder
        publicKey: null,
        chainId: 'midnight-testnet',
        balances: [],
        isConnected: true,
        isLocked: false,
      }

      set({ 
        isConnected: true, 
        isConnecting: false, 
        walletState,
        error: null 
      })
    } catch (error) {
      set({ 
        isConnecting: false, 
        error: error instanceof Error ? error.message : 'Failed to connect wallet' 
      })
      throw error
    }
  },

  disconnect: async () => {
    set({ 
      isConnected: false, 
      walletState: null, 
      error: null 
    })
  },

  refreshState: async () => {
    const { isConnected } = get()
    if (isConnected) {
      // Refresh wallet state logic here
    }
  },

  clearError: () => {
    set({ error: null })
  },
}))

// Global type declarations removed - using official types from @midnight-ntwrk/dapp-connector-api
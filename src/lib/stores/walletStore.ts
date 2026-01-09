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
  set({ isConnecting: true, error: null });
  
  try {
    if (typeof window === 'undefined' || !window.midnight?.mnLace) {
      throw new Error('Midnight Lace wallet not found. Please install the extension.');
    }

    const api = await (window.midnight.mnLace as any).connect('preview');
    if (!api) throw new Error('Connect failed');

    const accounts = await api.getAccounts();
    if (!accounts || accounts.length === 0) throw new Error('No accounts found');

    const walletState: WalletState = {
      address: accounts[0].address,
      publicKey: accounts[0].publicKey || null,
      chainId: 'midnight-testnet',
      balances: [],
      isConnected: true,
      isLocked: false,
    };

    set({ 
      isConnected: true, 
      isConnecting: false, 
      walletState,
      error: null 
    });
  } catch (error) {
    set({ 
      isConnecting: false, 
      error: error instanceof Error ? error.message : 'Failed to connect wallet' 
    });
    throw error;
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

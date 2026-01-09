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

    // Connect with network
    const connected = await (window.midnight.mnLace as any).connect('preview');
    if (!connected) throw new Error('Connect failed');

    console.log('Connected object:', connected); // Debug—what is it?

    // Get accounts (cast to bypass type, or try nested if needed)
    const addressObj = await connected.getUnshieldedAddress(); // Returns object
    if (!addressObj) throw new Error('No unshielded address found');
    
    // Extract string address (Bech32 format)
    const address = typeof addressObj === 'string' ? addressObj : addressObj.toString(); // Safe conversion
    
    const walletState: WalletState = {
      address: address,
      publicKey: null,
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
    console.error('Connect error:', error); // Debug
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

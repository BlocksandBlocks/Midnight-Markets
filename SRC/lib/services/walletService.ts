import type { DAppConnectorAPI, DAppConnectorWalletAPI, ServiceUriConfig, DAppConnectorWalletState } from '@midnight-ntwrk/dapp-connector-api';
import semver from 'semver';

interface WalletState {
  address: string | null;
  publicKey: string | null;
  chainId: string;
  balances: any[];
  isConnected: boolean;
  isLocked: boolean;
}

export class WalletService {
  private api: DAppConnectorAPI | null = null;
  private wallet: DAppConnectorWalletAPI | null = null;
  private serviceUris: ServiceUriConfig | null = null;
  private connectionListeners: Set<(connected: boolean) => void> = new Set();
  private stateListeners: Set<(state: WalletState | null) => void> = new Set();
  private statePollingInterval?: NodeJS.Timeout;
  
  // Version compatibility
  private readonly compatibleConnectorAPIVersion = '1.x';

  constructor() {
    this.detectWallet();
    // Poll for wallet availability if not immediately detected
    if (!this.api) {
      this.pollForWallet();
    }
  }

  /**
   * Detect if Midnight Lace wallet is available
   */
  private detectWallet(): boolean {
    if (typeof window === 'undefined') return false;
    
    this.api = window.midnight?.mnLace || null;
    return !!this.api;
  }

  /**
   * Poll for wallet availability (in case extension loads after page)
   */
  private pollForWallet(): void {
    const pollInterval = setInterval(() => {
      if (this.detectWallet()) {
        clearInterval(pollInterval);
        console.log('Midnight Lace wallet detected after polling');
      }
    }, 5000); // Check every 5 seconds instead of 1 second

    // Stop polling after 30 seconds
    setTimeout(() => clearInterval(pollInterval), 30000);
  }

  /**
   * Check if wallet extension is detected
   */
  isWalletDetected(): boolean {
    return !!this.api;
  }

  /**
   * Check if wallet is currently connected
   */
  async isConnected(): Promise<boolean> {
    if (!this.api || !this.wallet) return false;
    
    try {
      return await this.api.isEnabled();
    } catch (error) {
      console.error('Error checking wallet connection:', error);
      return false;
    }
  }

  /**
   * Connect to the wallet using the official API flow
   */
  async connect(): Promise<{ wallet: DAppConnectorWalletAPI; uris: ServiceUriConfig }> {
    if (!this.api) {
      throw new Error('Midnight Lace wallet not detected. Please install the extension.');
    }

    try {
      // Check version compatibility
      if (!semver.satisfies(this.api.apiVersion, this.compatibleConnectorAPIVersion)) {
        throw new Error(
          `Incompatible wallet version. Expected ${this.compatibleConnectorAPIVersion}, got ${this.api.apiVersion}`
        );
      }

      // Follow the official connection flow
      await this.api.isEnabled();
      const wallet = await this.api.enable();
      const uris = await this.api.serviceUriConfig();

      // Store references
      this.wallet = wallet;
      this.serviceUris = uris;

      // Start polling for wallet state changes
      this.startStatePolling();

      this.notifyConnectionListeners(true);
      return { wallet, uris };
    } catch (error) {
      console.error('Failed to connect to wallet:', error);
      throw new Error(
        error instanceof Error 
          ? error.message 
          : 'Failed to connect to Midnight Lace wallet'
      );
    }
  }

  /**
   * Disconnect from the wallet
   */
  async disconnect(): Promise<void> {
    try {
      // Stop state polling
      this.stopStatePolling();

      // Clear references
      this.wallet = null;
      this.serviceUris = null;

      this.notifyConnectionListeners(false);
      this.notifyStateListeners(null);
    } catch (error) {
      console.error('Error disconnecting wallet:', error);
      throw new Error('Failed to disconnect from wallet');
    }
  }

  /**
   * Get current wallet state
   */
  async getWalletState(): Promise<WalletState | null> {
    if (!this.wallet) return null;

    try {
      const state = await this.wallet.state();
      return this.transformWalletState(state);
    } catch (error) {
      console.error('Error getting wallet state:', error);
      return null;
    }
  }

  /**
   * Get service URI configuration for network services
   */
  async getServiceUriConfig(): Promise<ServiceUriConfig | null> {
    return this.serviceUris;
  }

  /**
   * Get API version for debugging
   */
  getApiVersion(): string | null {
    return this.api?.apiVersion || null;
  }

  /**
   * Start polling for wallet state changes
   */
  private startStatePolling(): void {
    if (this.statePollingInterval) return;

    this.statePollingInterval = setInterval(async () => {
      try {
        const state = await this.getWalletState();
        this.notifyStateListeners(state);
      } catch (error) {
        console.error('Error polling wallet state:', error);
      }
    }, 15000); // Poll every 15 seconds (much less aggressive)
  }

  /**
   * Stop polling for wallet state changes
   */
  private stopStatePolling(): void {
    if (this.statePollingInterval) {
      clearInterval(this.statePollingInterval);
      this.statePollingInterval = undefined;
    }
  }

  /**
   * Transform wallet state to our internal format
   */
  private transformWalletState(walletState: DAppConnectorWalletState): WalletState {
    return {
      address: walletState.address || null,
      publicKey: walletState.coinPublicKey || null,
      chainId: 'midnight-testnet', // Default chain ID
      balances: [], // Balance info would come from additional API calls
      isConnected: !!walletState.address,
      isLocked: false, // Not available in connector state
    };
  }

  /**
   * Subscribe to connection state changes
   */
  onConnectionChange(callback: (connected: boolean) => void): () => void {
    this.connectionListeners.add(callback);
    return () => this.connectionListeners.delete(callback);
  }

  /**
   * Subscribe to wallet state changes
   */
  onStateChange(callback: (state: WalletState | null) => void): () => void {
    this.stateListeners.add(callback);
    return () => this.stateListeners.delete(callback);
  }

  /**
   * Notify connection listeners
   */
  private notifyConnectionListeners(connected: boolean): void {
    this.connectionListeners.forEach(callback => {
      try {
        callback(connected);
      } catch (error) {
        console.error('Error in connection listener:', error);
      }
    });
  }

  /**
   * Notify state listeners
   */
  private notifyStateListeners(state: WalletState | null): void {
    this.stateListeners.forEach(callback => {
      try {
        callback(state);
      } catch (error) {
        console.error('Error in state listener:', error);
      }
    });
  }

  /**
   * Clean up resources
   */
  destroy(): void {
    this.stopStatePolling();
    this.connectionListeners.clear();
    this.stateListeners.clear();
    this.wallet = null;
    this.serviceUris = null;
    this.api = null;
  }
}

// Export WalletState interface for use in other files
export type { WalletState };
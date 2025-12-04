
'use client'

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useWalletStore } from '@/lib/stores/walletStore';
import { contractService } from '@/lib/CONTRACT_SERVICE';
import { CONTRACT_CONFIG } from '@/lib/CONTRACT_CONFIG';
import { toast } from 'sonner';
import { Loader2, PlusCircle, Handshake, CheckCircle, DollarSign, XCircle, Settings } from 'lucide-react';

export function ContractInterface() {
  const { isConnected, walletState } = useWalletStore();
  const [contractState, setContractState] = useState(contractService.getState());
  const [loading, setLoading] = useState(false);
  const [marketId, setMarketId] = useState('');
  const [sheriffId, setSheriffId] = useState('');
  const [marketName, setMarketName] = useState('');
  const [sheriffFee, setSheriffFee] = useState('');
  const [offerId, setOfferId] = useState('');
  const [sellerId, setSellerId] = useState('');
  const [amount, setAmount] = useState('');
  const [offerDetailsHash, setOfferDetailsHash] = useState('');
  const [buyerId, setBuyerId] = useState('');
  const [depositedAmount, setDepositedAmount] = useState('');
  const [proofHash, setProofHash] = useState('');
  const [newPlatformFee, setNewPlatformFee] = useState('');

  useEffect(() => {
    const interval = setInterval(() => {
      setContractState(contractService.getState());
    }, 2000); // Refresh state every 2 seconds
    return () => clearInterval(interval);
  }, []);

  const executeFunction = async (functionName: string, params: any[]) => {
    if (!isConnected) {
      toast.error('Please connect your Midnight Lace wallet');
      return;
    }
    setLoading(true);
    try {
      const result = await contractService.callFunction(functionName, params);
      if (result.success) {
        toast.success(`${functionName} executed successfully! ${result.message || ''}`);
        setContractState(contractService.getState());
      } else {
        toast.error(`Execution of ${functionName} failed.`);
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Contract execution failed');
    } finally {
      setLoading(false);
    }
  };

  const currentUserId = walletState?.address || '0'; // Mock current user ID

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="text-3xl font-bold text-center text-midnight-blue">
          {CONTRACT_CONFIG.name}
        </CardTitle>
        <CardDescription className="text-center text-gray-400">
          Decentralized marketplace for goods and services, secured by Sheriffs.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="bg-midnight-black text-midnight-white border-midnight-blue">
            <CardHeader>
              <CardTitle className="text-xl flex items-center">
                <PlusCircle className="w-5 h-5 mr-2" /> Create Market
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <label className="text-sm font-medium mb-1 block">Market ID</label>
                <input
                  type="number"
                  className="w-full p-2 rounded-md bg-gray-800 text-midnight-white border border-gray-700"
                  value={marketId}
                  onChange={(e) => setMarketId(e.target.value)}
                  placeholder="e.g., 1"
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Sheriff ID</label>
                <input
                  type="number"
                  className="w-full p-2 rounded-md bg-gray-800 text-midnight-white border border-gray-700"
                  value={sheriffId}
                  onChange={(e) => setSheriffId(e.target.value)}
                  placeholder="e.g., 101 (Your ID)"
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Market Name</label>
                <input
                  type="text"
                  className="w-full p-2 rounded-md bg-gray-800 text-midnight-white border border-gray-700"
                  value={marketName}
                  onChange={(e) => setMarketName(e.target.value)}
                  placeholder="e.g., 'Electronics Bazaar'"
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Sheriff Fee (bps)</label>
                <input
                  type="number"
                  className="w-full p-2 rounded-md bg-gray-800 text-midnight-white border border-gray-700"
                  value={sheriffFee}
                  onChange={(e) => setSheriffFee(e.target.value)}
                  placeholder="e.g., 100 (for 1%)"
                />
              </div>
              <Button
                onClick={() => executeFunction('create_market', [parseInt(marketId), parseInt(sheriffId), marketName, parseInt(sheriffFee)])}
                disabled={loading || !isConnected}
                className="w-full bg-midnight-blue hover:bg-blue-700 text-white"
              >
                {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <PlusCircle className="mr-2 h-4 w-4" />}
                Create Market
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-midnight-black text-midnight-white border-midnight-blue">
            <CardHeader>
              <CardTitle className="text-xl flex items-center">
                <Handshake className="w-5 h-5 mr-2" /> Post Offer
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <label className="text-sm font-medium mb-1 block">Offer ID</label>
                <input
                  type="number"
                  className="w-full p-2 rounded-md bg-gray-800 text-midnight-white border border-gray-700"
                  value={offerId}
                  onChange={(e) => setOfferId(e.target.value)}
                  placeholder="e.g., 1001"
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Market ID</label>
                <input
                  type="number"
                  className="w-full p-2 rounded-md bg-gray-800 text-midnight-white border border-gray-700"
                  value={marketId}
                  onChange={(e) => setMarketId(e.target.value)}
                  placeholder="e.g., 1"
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Seller ID</label>
                <input
                  type="number"
                  className="w-full p-2 rounded-md bg-gray-800 text-midnight-white border border-gray-700"
                  value={sellerId}
                  onChange={(e) => setSellerId(e.target.value)}
                  placeholder="e.g., 201 (Your ID)"
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Amount ($Night)</label>
                <input
                  type="number"
                  className="w-full p-2 rounded-md bg-gray-800 text-midnight-white border border-gray-700"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="e.g., 1000"
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Offer Details Hash</label>
                <input
                  type="text"
                  className="w-full p-2 rounded-md bg-gray-800 text-midnight-white border border-gray-700"
                  value={offerDetailsHash}
                  onChange={(e) => setOfferDetailsHash(e.target.value)}
                  placeholder="e.g., 0xabc123..."
                />
              </div>
              <Button
                onClick={() => executeFunction('post_offer', [parseInt(offerId), parseInt(marketId), parseInt(sellerId), parseInt(amount), offerDetailsHash])}
                disabled={loading || !isConnected}
                className="w-full bg-midnight-blue hover:bg-blue-700 text-white"
              >
                {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Handshake className="mr-2 h-4 w-4" />}
                Post Offer
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-midnight-black text-midnight-white border-midnight-blue">
            <CardHeader>
              <CardTitle className="text-xl flex items-center">
                <CheckCircle className="w-5 h-5 mr-2" /> Accept Offer
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <label className="text-sm font-medium mb-1 block">Offer ID</label>
                <input
                  type="number"
                  className="w-full p-2 rounded-md bg-gray-800 text-midnight-white border border-gray-700"
                  value={offerId}
                  onChange={(e) => setOfferId(e.target.value)}
                  placeholder="e.g., 1001"
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Buyer ID</label>
                <input
                  type="number"
                  className="w-full p-2 rounded-md bg-gray-800 text-midnight-white border border-gray-700"
                  value={buyerId}
                  onChange={(e) => setBuyerId(e.target.value)}
                  placeholder="e.g., 301 (Your ID)"
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Market ID</label>
                <input
                  type="number"
                  className="w-full p-2 rounded-md bg-gray-800 text-midnight-white border border-gray-700"
                  value={marketId}
                  onChange={(e) => setMarketId(e.target.value)}
                  placeholder="e.g., 1"
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Deposited Amount ($Night)</label>
                <input
                  type="number"
                  className="w-full p-2 rounded-md bg-gray-800 text-midnight-white border border-gray-700"
                  value={depositedAmount}
                  onChange={(e) => setDepositedAmount(e.target.value)}
                  placeholder="e.g., 1000"
                />
              </div>
              <Button
                onClick={() => executeFunction('accept_offer', [parseInt(offerId), parseInt(buyerId), parseInt(marketId), parseInt(depositedAmount)])}
                disabled={loading || !isConnected}
                className="w-full bg-midnight-blue hover:bg-blue-700 text-white"
              >
                {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <CheckCircle className="mr-2 h-4 w-4" />}
                Accept Offer
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-midnight-black text-midnight-white border-midnight-blue">
            <CardHeader>
              <CardTitle className="text-xl flex items-center">
                <DollarSign className="w-5 h-5 mr-2" /> Release Funds (Sheriff)
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <label className="text-sm font-medium mb-1 block">Offer ID</label>
                <input
                  type="number"
                  className="w-full p-2 rounded-md bg-gray-800 text-midnight-white border border-gray-700"
                  value={offerId}
                  onChange={(e) => setOfferId(e.target.value)}
                  placeholder="e.g., 1001"
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Sheriff ID</label>
                <input
                  type="number"
                  className="w-full p-2 rounded-md bg-gray-800 text-midnight-white border border-gray-700"
                  value={sheriffId}
                  onChange={(e) => setSheriffId(e.target.value)}
                  placeholder="e.g., 101 (Your ID)"
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Market ID</label>
                <input
                  type="number"
                  className="w-full p-2 rounded-md bg-gray-800 text-midnight-white border border-gray-700"
                  value={marketId}
                  onChange={(e) => setMarketId(e.target.value)}
                  placeholder="e.g., 1"
                />
              </div>
              <Button
                onClick={() => executeFunction('release_funds', [parseInt(offerId), parseInt(sheriffId), parseInt(marketId)])}
                disabled={loading || !isConnected}
                className="w-full bg-midnight-blue hover:bg-blue-700 text-white"
              >
                {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <DollarSign className="mr-2 h-4 w-4" />}
                Release Funds
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-midnight-black text-midnight-white border-midnight-blue">
            <CardHeader>
              <CardTitle className="text-xl flex items-center">
                <Settings className="w-5 h-5 mr-2" /> Set Platform Fee (Owner)
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <label className="text-sm font-medium mb-1 block">New Platform Fee (bps)</label>
                <input
                  type="number"
                  className="w-full p-2 rounded-md bg-gray-800 text-midnight-white border border-gray-700"
                  value={newPlatformFee}
                  onChange={(e) => setNewPlatformFee(e.target.value)}
                  placeholder="e.g., 100 (for 1%)"
                />
              </div>
              <Button
                onClick={() => executeFunction('set_platform_fee', [parseInt(newPlatformFee), parseInt(currentUserId)])}
                disabled={loading || !isConnected}
                className="w-full bg-midnight-blue hover:bg-blue-700 text-white"
              >
                {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Settings className="mr-2 h-4 w-4" />}
                Set Fee
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-midnight-black text-midnight-white border-midnight-blue">
            <CardHeader>
              <CardTitle className="text-xl flex items-center">
                <XCircle className="w-5 h-5 mr-2" /> Cancel Offer (Sheriff)
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <label className="text-sm font-medium mb-1 block">Offer ID</label>
                <input
                  type="number"
                  className="w-full p-2 rounded-md bg-gray-800 text-midnight-white border border-gray-700"
                  value={offerId}
                  onChange={(e) => setOfferId(e.target.value)}
                  placeholder="e.g., 1001"
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Sheriff ID</label>
                <input
                  type="number"
                  className="w-full p-2 rounded-md bg-gray-800 text-midnight-white border border-gray-700"
                  value={sheriffId}
                  onChange={(e) => setSheriffId(e.target.value)}
                  placeholder="e.g., 101 (Your ID)"
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Market ID</label>
                <input
                  type="number"
                  className="w-full p-2 rounded-md bg-gray-800 text-midnight-white border border-gray-700"
                  value={marketId}
                  onChange={(e) => setMarketId(e.target.value)}
                  placeholder="e.g., 1"
                />
              </div>
              <Button
                onClick={() => executeFunction('cancel_offer_by_sheriff', [parseInt(offerId), parseInt(sheriffId), parseInt(marketId)])}
                disabled={loading || !isConnected}
                className="w-full bg-red-600 hover:bg-red-700 text-white"
              >
                {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <XCircle className="mr-2 h-4 w-4" />}
                Cancel Offer
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-midnight-black text-midnight-white border-midnight-blue">
            <CardHeader>
              <CardTitle className="text-xl flex items-center">
                <XCircle className="w-5 h-5 mr-2" /> Cancel Offer (Seller)
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <label className="text-sm font-medium mb-1 block">Offer ID</label>
                <input
                  type="number"
                  className="w-full p-2 rounded-md bg-gray-800 text-midnight-white border border-gray-700"
                  value={offerId}
                  onChange={(e) => setOfferId(e.target.value)}
                  placeholder="e.g., 1001"
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Seller ID</label>
                <input
                  type="number"
                  className="w-full p-2 rounded-md bg-gray-800 text-midnight-white border border-gray-700"
                  value={sellerId}
                  onChange={(e) => setSellerId(e.target.value)}
                  placeholder="e.g., 201 (Your ID)"
                />
              </div>
              <Button
                onClick={() => executeFunction('cancel_offer_by_seller', [parseInt(offerId), parseInt(sellerId)])}
                disabled={loading || !isConnected}
                className="w-full bg-red-600 hover:bg-red-700 text-white"
              >
                {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <XCircle className="mr-2 h-4 w-4" />}
                Cancel Offer
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-midnight-black text-midnight-white border-midnight-blue">
            <CardHeader>
              <CardTitle className="text-xl flex items-center">
                <CheckCircle className="w-5 h-5 mr-2" /> Submit Proof
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <label className="text-sm font-medium mb-1 block">Offer ID</label>
                <input
                  type="number"
                  className="w-full p-2 rounded-md bg-gray-800 text-midnight-white border border-gray-700"
                  value={offerId}
                  onChange={(e) => setOfferId(e.target.value)}
                  placeholder="e.g., 1001"
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Seller ID</label>
                <input
                  type="number"
                  className="w-full p-2 rounded-md bg-gray-800 text-midnight-white border border-gray-700"
                  value={sellerId}
                  onChange={(e) => setSellerId(e.target.value)}
                  placeholder="e.g., 201 (Your ID)"
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Proof Hash</label>
                <input
                  type="text"
                  className="w-full p-2 rounded-md bg-gray-800 text-midnight-white border border-gray-700"
                  value={proofHash}
                  onChange={(e) => setProofHash(e.target.value)}
                  placeholder="e.g., 0xdef456..."
                />
              </div>
              <Button
                onClick={() => executeFunction('submit_proof', [parseInt(offerId), parseInt(sellerId), proofHash])}
                disabled={loading || !isConnected}
                className="w-full bg-midnight-blue hover:bg-blue-700 text-white"
              >
                {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <CheckCircle className="mr-2 h-4 w-4" />}
                Submit Proof
              </Button>
            </CardContent>
          </Card>
        </div>

        <Card className="bg-midnight-black text-midnight-white border-midnight-blue">
          <CardHeader>
            <CardTitle className="text-xl">Current Contract State</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <p><strong>Owner ID:</strong> <Badge variant="outline">{contractState.owner_id}</Badge></p>
            <p><strong>Platform Fee:</strong> <Badge variant="outline">{contractState.platform_fee_percentage / 100}%</Badge></p>
            
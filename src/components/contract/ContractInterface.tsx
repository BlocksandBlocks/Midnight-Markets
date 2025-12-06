'use client'

import { useState, useEffect } from 'react';
import Image from 'next/image'; // For optimized images
import { motion } from 'framer-motion'; // For smooth animations
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useWalletStore } from '@/lib/stores/walletStore';
import { contractService } from '@/lib/CONTRACT_SERVICE';
import { CONTRACT_CONFIG } from '@/lib/CONTRACT_CONFIG';
import { toast } from 'sonner';
import { Loader2, PlusCircle, Handshake, CheckCircle, DollarSign, XCircle, Settings } from 'lucide-react';

function ContractInterface() {
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

  // Framer Motion variants for modern animations
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.1, duration: 0.6, ease: 'easeOut' }
    }),
    hover: { scale: 1.02, boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.3), 0 10px 10px -5px rgba(0, 0, 0, 0.1)' }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      className="min-h-screen bg-gradient-to-br from-midnight-black via-gray-900 to-midnight-blue p-4" // Modern gradient background
    >
      {/* Standalone Moon Hero – Full-width banner style */}
      <div className="w-full mb-12"> {/* Full width, mb-12 for space below */}
        <div className="relative w-full h-48"> {/* Banner height for rectangular full image */}
          <Image
            src="/moon.png" // Your uploaded local image
            alt="Crescent Moon – Symbol of Midnight Blockchain"
            fill // Fills container responsively
            className="object-contain opacity-40" // Full rectangular, no cropping; object-contain shows entire image preserving aspect ratio
            priority // Loads immediately
            sizes="100vw" // Full viewport width for perf
          />
        </div>
      </div>
      <Card className="w-full max-w-6xl mx-auto overflow-hidden shadow-2xl border-0 bg-gradient-to-br from-midnight-black via-gray-900 to-midnight-blue/80 backdrop-blur-sm"> {/* Enhanced card with gradient & blur */}
        <CardHeader className="relative pb-8 pt-0"> {/* No pt needed—moon is outside; pb-8 for title space */}
          <CardTitle className="text-4xl font-bold text-center text-white drop-shadow-lg"> {/* Title now clear below moon */}
            {CONTRACT_CONFIG.name}
          </CardTitle>
          <CardDescription className="text-center text-gray-300 mt-2"> {/* Softer text */}
            Decentralized marketplace for goods and services, secured by Sheriffs.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-8 p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6"> {/* Improved responsive grid */}
            {/* Create Market Card – Animated */}
            <motion.div
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              whileHover="hover"
              custom={0}
              className="group" // For hover interactions
            >
              <Card className="bg-gray-900/50 text-white border border-gray-700/50 backdrop-blur-sm hover:border-midnight-blue/70 transition-colors"> {/* Subtle transparency & hover */}
                <CardHeader className="pb-4">
                  <CardTitle className="text-xl flex items-center text-white group-hover:text-midnight-blue transition-colors">
                    <PlusCircle className="w-5 h-5 mr-2" /> Create Market
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4"> {/* More spacing */}
                  <div>
                    <label className="text-sm font-medium mb-2 block text-gray-300">Market ID</label>
                    <input
                      type="number"
                      className="w-full p-3 rounded-lg bg-gray-800/70 text-white border border-gray-600 focus:border-midnight-blue focus:ring-2 focus:ring-midnight-blue/20 transition-all" // Modern input styling
                      value={marketId}
                      onChange={(e) => setMarketId(e.target.value)}
                      placeholder="e.g., 1"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block text-gray-300">Sheriff ID</label>
                    <input
                      type="number"
                      className="w-full p-3 rounded-lg bg-gray-800/70 text-white border border-gray-600 focus:border-midnight-blue focus:ring-2 focus:ring-midnight-blue/20 transition-all"
                      value={sheriffId}
                      onChange={(e) => setSheriffId(e.target.value)}
                      placeholder="e.g., 101 (Your ID)"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block text-gray-300">Market Name</label>
                    <input
                      type="text"
                      className="w-full p-3 rounded-lg bg-gray-800/70 text-white border border-gray-600 focus:border-midnight-blue focus:ring-2 focus:ring-midnight-blue/20 transition-all"
                      value={marketName}
                      onChange={(e) => setMarketName(e.target.value)}
                      placeholder="e.g., 'Electronics Bazaar'"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block text-gray-300">Sheriff Fee (bps)</label>
                    <input
                      type="number"
                      className="w-full p-3 rounded-lg bg-gray-800/70 text-white border border-gray-600 focus:border-midnight-blue focus:ring-2 focus:ring-midnight-blue/20 transition-all"
                      value={sheriffFee}
                      onChange={(e) => setSheriffFee(e.target.value)}
                      placeholder="e.g., 100 (for 1%)"
                    />
                  </div>
                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}> {/* Button animation */}
                    <Button
                      onClick={() => executeFunction('create_market', [parseInt(marketId), parseInt(sheriffId), marketName, parseInt(sheriffFee)])}
                      disabled={loading || !isConnected}
                      className="w-full bg-gradient-to-r from-midnight-blue to-blue-600 hover:from-blue-600 hover:to-midnight-blue text-white shadow-lg transition-all" // Gradient button
                    >
                      {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <PlusCircle className="mr-2 h-4 w-4" />}
                      Create Market
                    </Button>
                  </motion.div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Post Offer Card */}
            <motion.div
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              whileHover="hover"
              custom={1}
              className="group"
            >
              <Card className="bg-gray-900/50 text-white border border-gray-700/50 backdrop-blur-sm hover:border-midnight-blue/70 transition-colors">
                <CardHeader className="pb-4">
                  <CardTitle className="text-xl flex items-center text-white group-hover:text-midnight-blue transition-colors">
                    <Handshake className="w-5 h-5 mr-2" /> Post Offer
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block text-gray-300">Offer ID</label>
                    <input
                      type="number"
                      className="w-full p-3 rounded-lg bg-gray-800/70 text-white border border-gray-600 focus:border-midnight-blue focus:ring-2 focus:ring-midnight-blue/20 transition-all"
                      value={offerId}
                      onChange={(e) => setOfferId(e.target.value)}
                      placeholder="e.g., 1001"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block text-gray-300">Market ID</label>
                    <input
                      type="number"
                      className="w-full p-3 rounded-lg bg-gray-800/70 text-white border border-gray-600 focus:border-midnight-blue focus:ring-2 focus:ring-midnight-blue/20 transition-all"
                      value={marketId}
                      onChange={(e) => setMarketId(e.target.value)}
                      placeholder="e.g., 1"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block text-gray-300">Seller ID</label>
                    <input
                      type="number"
                      className="w-full p-3 rounded-lg bg-gray-800/70 text-white border border-gray-600 focus:border-midnight-blue focus:ring-2 focus:ring-midnight-blue/20 transition-all"
                      value={sellerId}
                      onChange={(e) => setSellerId(e.target.value)}
                      placeholder="e.g., 201 (Your ID)"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block text-gray-300">Amount ($Night)</label>
                    <input
                      type="number"
                      className="w-full p-3 rounded-lg bg-gray-800/70 text-white border border-gray-600 focus:border-midnight-blue focus:ring-2 focus:ring-midnight-blue/20 transition-all"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      placeholder="e.g., 1000"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block text-gray-300">Offer Details Hash</label>
                    <input
                      type="text"
                      className="w-full p-3 rounded-lg bg-gray-800/70 text-white border border-gray-600 focus:border-midnight-blue focus:ring-2 focus:ring-midnight-blue/20 transition-all"
                      value={offerDetailsHash}
                      onChange={(e) => setOfferDetailsHash(e.target.value)}
                      placeholder="e.g., 0xabc123..."
                    />
                  </div>
                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Button
                      onClick={() => executeFunction('post_offer', [parseInt(offerId), parseInt(marketId), parseInt(sellerId), parseInt(amount), offerDetailsHash])}
                      disabled={loading || !isConnected}
                      className="w-full bg-gradient-to-r from-midnight-blue to-blue-600 hover:from-blue-600 hover:to-midnight-blue text-white shadow-lg transition-all"
                    >
                      {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Handshake className="mr-2 h-4 w-4" />}
                      Post Offer
                    </Button>
                  </motion.div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Accept Offer Card */}
            <motion.div
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              whileHover="hover"
              custom={2}
              className="group"
            >
              <Card className="bg-gray-900/50 text-white border border-gray-700/50 backdrop-blur-sm hover:border-midnight-blue/70 transition-colors">
                <CardHeader className="pb-4">
                  <CardTitle className="text-xl flex items-center text-white group-hover:text-midnight-blue transition-colors">
                    <CheckCircle className="w-5 h-5 mr-2" /> Accept Offer
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block text-gray-300">Offer ID</label>
                    <input
                      type="number"
                      className="w-full p-3 rounded-lg bg-gray-800/70 text-white border border-gray-600 focus:border-midnight-blue focus:ring-2 focus:ring-midnight-blue/20 transition-all"
                      value={offerId}
                      onChange={(e) => setOfferId(e.target.value)}
                      placeholder="e.g., 1001"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block text-gray-300">Buyer ID</label>
                    <input
                      type="number"
                      className="w-full p-3 rounded-lg bg-gray-800/70 text-white border border-gray-600 focus:border-midnight-blue focus:ring-2 focus:ring-midnight-blue/20 transition-all"
                      value={buyerId}
                      onChange={(e) => setBuyerId(e.target.value)}
                      placeholder="e.g., 301 (Your ID)"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block text-gray-300">Market ID</label>
                    <input
                      type="number"
                      className="w-full p-3 rounded-lg bg-gray-800/70 text-white border border-gray-600 focus:border-midnight-blue focus:ring-2 focus:ring-midnight-blue/20 transition-all"
                      value={marketId}
                      onChange={(e) => setMarketId(e.target.value)}
                      placeholder="e.g., 1"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block text-gray-300">Deposited Amount ($Night)</label>
                    <input
                      type="number"
                      className="w-full p-3 rounded-lg bg-gray-800/70 text-white border border-gray-600 focus:border-midnight-blue focus:ring-2 focus:ring-midnight-blue/20 transition-all"
                      value={depositedAmount}
                      onChange={(e) => setDepositedAmount(e.target.value)}
                      placeholder="e.g., 1000"
                    />
                  </div>
                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Button
                      onClick={() => executeFunction('accept_offer', [parseInt(offerId), parseInt(buyerId), parseInt(marketId), parseInt(depositedAmount)])}
                      disabled={loading || !isConnected}
                      className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-emerald-600 hover:to-green-600 text-white shadow-lg transition-all" // Green gradient for accept
                    >
                      {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <CheckCircle className="mr-2 h-4 w-4" />}
                      Accept Offer
                    </Button>
                  </motion.div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Release Funds (Sheriff) Card */}
            <motion.div
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              whileHover="hover"
              custom={3}
              className="group"
            >
              <Card className="bg-gray-900/50 text-white border border-gray-700/50 backdrop-blur-sm hover:border-midnight-blue/70 transition-colors">
                <CardHeader className="pb-4">
                  <CardTitle className="text-xl flex items-center text-white group-hover:text-midnight-blue transition-colors">
                    <DollarSign className="w-5 h-5 mr-2" /> Release Funds (Sheriff)
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block text-gray-300">Offer ID</label>
                    <input
                      type="number"
                      className="w-full p-3 rounded-lg bg-gray-800/70 text-white border border-gray-600 focus:border-midnight-blue focus:ring-2 focus:ring-midnight-blue/20 transition-all"
                      value={offerId}
                      onChange={(e) => setOfferId(e.target.value)}
                      placeholder="e.g., 1001"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block text-gray-300">Sheriff ID</label>
                    <input
                      type="number"
                      className="w-full p-3 rounded-lg bg-gray-800/70 text-white border border-gray-600 focus:border-midnight-blue focus:ring-2 focus:ring-midnight-blue/20 transition-all"
                      value={sheriffId}
                      onChange={(e) => setSheriffId(e.target.value)}
                      placeholder="e.g., 101 (Your ID)"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block text-gray-300">Market ID</label>
                    <input
                      type="number"
                      className="w-full p-3 rounded-lg bg-gray-800/70 text-white border border-gray-600 focus:border-midnight-blue focus:ring-2 focus:ring-midnight-blue/20 transition-all"
                      value={marketId}
                      onChange={(e) => setMarketId(e.target.value)}
                      placeholder="e.g., 1"
                    />
                  </div>
                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Button
                      onClick={() => executeFunction('release_funds', [parseInt(offerId), parseInt(sheriffId), parseInt(marketId)])}
                      disabled={loading || !isConnected}
                      className="w-full bg-gradient-to-r from-midnight-blue to-blue-600 hover:from-blue-600 hover:to-midnight-blue text-white shadow-lg transition-all"
                    >
                      {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <DollarSign className="mr-2 h-4 w-4" />}
                      Release Funds
                    </Button>
                  </motion.div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Set Platform Fee Card */}
            <motion.div
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              whileHover="hover"
              custom={4}
              className="group"
            >
              <Card className="bg-gray-900/50 text-white border border-gray-700/50 backdrop-blur-sm hover:border-midnight-blue/70 transition-colors">
                <CardHeader className="pb-4">
                  <CardTitle className="text-xl flex items-center text-white group-hover:text-midnight-blue transition-colors">
                    <Settings className="w-5 h-5 mr-2" /> Set Platform Fee (Owner)
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block text-gray-300">New Platform Fee (bps)</label>
                    <input
                      type="number"
                      className="w-full p-3 rounded-lg bg-gray-800/70 text-white border border-gray-600 focus:border-midnight-blue focus:ring-2 focus:ring-midnight-blue/20 transition-all"
                      value={newPlatformFee}
                      onChange={(e) => setNewPlatformFee(e.target.value)}
                      placeholder="e.g., 100 (for 1%)"
                    />
                  </div>
                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Button
                      onClick={() => executeFunction('set_platform_fee', [parseInt(newPlatformFee), parseInt(currentUserId)])}
                      disabled={loading || !isConnected}
                      className="w-full bg-gradient-to-r from-purple-600 to-violet-600 hover:from-violet-600 hover:to-purple-600 text-white shadow-lg transition-all" // Purple for settings
                    >
                      {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Settings className="mr-2 h-4 w-4" />}
                      Set Fee
                    </Button>
                  </motion.div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Cancel Offer (Sheriff) Card */}
            <motion.div
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              whileHover="hover"
              custom={5}
              className="group"
            >
              <Card className="bg-gray-900/50 text-white border border-gray-700/50 backdrop-blur-sm hover:border-red-500/70 transition-colors">
                <CardHeader className="pb-4">
                  <CardTitle className="text-xl flex items-center text-white group-hover:text-red-400 transition-colors">
                    <XCircle className="w-5 h-5 mr-2" /> Cancel Offer (Sheriff)
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block text-gray-300">Offer ID</label>
                    <input
                      type="number"
                      className="w-full p-3 rounded-lg bg-gray-800/70 text-white border border-gray-600 focus:border-red-500 focus:ring-2 focus:ring-red-500/20 transition-all"
                      value={offerId}
                      onChange={(e) => setOfferId(e.target.value)}
                      placeholder="e.g., 1001"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block text-gray-300">Sheriff ID</label>
                    <input
                      type="number"
                      className="w-full p-3 rounded-lg bg-gray-800/70 text-white border border-gray-600 focus:border-red-500 focus:ring-2 focus:ring-red-500/20 transition-all"
                      value={sheriffId}
                      onChange={(e) => setSheriffId(e.target.value)}
                      placeholder="e.g., 101 (Your ID)"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block text-gray-300">Market ID</label>
                    <input
                      type="number"
                      className="w-full p-3 rounded-lg bg-gray-800/70 text-white border border-gray-600 focus:border-red-500 focus:ring-2 focus:ring-red-500/20 transition-all"
                      value={marketId}
                      onChange={(e) => setMarketId(e.target.value)}
                      placeholder="e.g., 1"
                    />
                  </div>
                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Button
                      onClick={() => executeFunction('cancel_offer_by_sheriff', [parseInt(offerId), parseInt(sheriffId), parseInt(marketId)])}
                      disabled={loading || !isConnected}
                      className="w-full bg-gradient-to-r from-red-600 to-rose-600 hover:from-rose-600 hover:to-red-600 text-white shadow-lg transition-all"
                    >
                      {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <XCircle className="mr-2 h-4 w-4" />}
                      Cancel Offer
                    </Button>
                  </motion.div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Cancel Offer (Seller) Card – Span full width on md+ */}
            <motion.div
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              whileHover="hover"
              custom={6}
              className="md:col-span-2 group"
            >
              <Card className="bg-gray-900/50 text-white border border-gray-700/50 backdrop-blur-sm hover:border-red-500/70 transition-colors">
                <CardHeader className="pb-4">
                  <CardTitle className="text-xl flex items-center text-white group-hover:text-red-400 transition-colors">
                    <XCircle className="w-5 h-5 mr-2" /> Cancel Offer (Seller)
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4"> {/* Sub-grid for better layout */}
                    <div>
                      <label className="text-sm font-medium mb-2 block text-gray-300">Offer ID</label>
                      <input
                        type="number"
                        className="w-full p-3 rounded-lg bg-gray-800/70 text-white border border-gray-600 focus:border-red-500 focus:ring-2 focus:ring-red-500/20 transition-all"
                        value={offerId}
                        onChange={(e) => setOfferId(e.target.value)}
                        placeholder="e.g., 1001"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-2 block text-gray-300">Seller ID</label>
                      <input
                        type="number"
                        className="w-full p-3 rounded-lg bg-gray-800/70 text-white border border-gray-600 focus:border-red-500 focus:ring-2 focus:ring-red-500/20 transition-all"
                        value={sellerId}
                        onChange={(e) => setSellerId(e.target.value)}
                        placeholder="e.g., 201 (Your ID)"
                      />
                    </div>
                  </div>
                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Button
                      onClick={() => executeFunction('cancel_offer_by_seller', [parseInt(offerId), parseInt(sellerId)])}
                      disabled={loading || !isConnected}
                      className="w-full bg-gradient-to-r from-red-600 to-rose-600 hover:from-rose-600 hover:to-red-600 text-white shadow-lg transition-all"
                    >
                      {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <XCircle className="mr-2 h-4 w-4" />}
                      Cancel Offer
                    </Button>
                  </motion.div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Submit Proof Card – Span full width */}
            <motion.div
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              whileHover="hover"
              custom={7}
              className="md:col-span-2 group"
            >
              <Card className="bg-gray-900/50 text-white border border-gray-700/50 backdrop-blur-sm hover:border-midnight-blue/70 transition-colors">
                <CardHeader className="pb-4">
                  <CardTitle className="text-xl flex items-center text-white group-hover:text-midnight-blue transition-colors">
                    <Handshake className="w-5 h-5 mr-2" /> Submit Proof
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="text-sm font-medium mb-2 block text-gray-300">Offer ID</label>
                      <input
                        type="number"
                        className="w-full p-3 rounded-lg bg-gray-800/70 text-white border border-gray-600 focus:border-midnight-blue focus:ring-2 focus:ring-midnight-blue/20 transition-all"
                        value={offerId}
                        onChange={(e) => setOfferId(e.target.value)}
                        placeholder="e.g., 1001"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-2 block text-gray-300">Seller ID</label>
                      <input
                        type="number"
                        className="w-full p-3 rounded-lg bg-gray-800/70 text-white border border-gray-600 focus:border-midnight-blue focus:ring-2 focus:ring-midnight-blue/20 transition-all"
                        value={sellerId}
                        onChange={(e) => setSellerId(e.target.value)}
                        placeholder="e.g., 201 (Your ID)"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-2 block text-gray-300">Proof Hash</label>
                      <input
                        type="text"
                        className="w-full p-3 rounded-lg bg-gray-800/70 text-white border border-gray-600 focus:border-midnight-blue focus:ring-2 focus:ring-midnight-blue/20 transition-all"
                        value={proofHash}
                        onChange={(e) => setProofHash(e.target.value)}
                        placeholder="e.g., 0xdef456..."
                      />
                    </div>
                  </div>
                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Button
                      onClick={() => executeFunction('submit_proof', [parseInt(offerId), parseInt(sellerId), proofHash])}
                      disabled={loading || !isConnected}
                      className="w-full bg-gradient-to-r from-midnight-blue to-blue-600 hover:from-blue-600 hover:to-midnight-blue text-white shadow-lg transition-all"
                    >
                      {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Handshake className="mr-2 h-4 w-4" />}
                      Submit Proof
                    </Button>
                  </motion.div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Contract State Display – Enhanced footer card */}
          <motion.div
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            custom={8}
            className="group"
          >
            <Card className="bg-gray-900/50 text-white border border-gray-700/50 backdrop-blur-sm hover:border-midnight-blue/70 transition-colors">
              <CardHeader>
                <CardTitle className="text-xl text-white">Contract State</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-3 text-sm"> {/* Better spacing */}
                  <div className="flex justify-between">
                    <span className="text-gray-400">Owner ID:</span>
                    <Badge variant="secondary" className="bg-midnight-blue/20 text-midnight-blue">{contractState.owner_id}</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Platform Fee:</span>
                    <Badge variant="secondary" className="bg-green-500/20 text-green-400">{contractState.platform_fee_percentage / 100}%</Badge>
                  </div>
                  {/* Add more state badges as needed */}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

export { ContractInterface }

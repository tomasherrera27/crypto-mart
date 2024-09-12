'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from "@/app/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/app/components/ui/card"
import { Input } from "@/app/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/app/components/ui/dialog"
import { Badge } from "@/app/components/ui/badge"
import { Loader2Icon, ShoppingCartIcon, TagIcon, Zap, Search, X, CheckCircle } from 'lucide-react'
import { Web3ReactProvider } from '@web3-react/core'
import { connectors } from '@/app/lib/web3Config'
import { Header } from './Header'
import { SupportedCurrencies } from './SupportedCurrencies'
import CryptoBackground3D from './CryptoBackground3D'
import { formatEther } from 'ethers'
import { Bitcoin, Currency } from 'lucide-react'

type NFT = {
  id: string;
  name: string;
  price: string;
  image: string;
  description: string;
}

type CartItem = NFT & {
  quantity: number;
}

type LoadingState = 'not-loaded' | 'loading' | 'loaded' | 'error'

export default function CryptoMart() {
  const [nfts, setNfts] = useState<NFT[]>([])
  const [loadingState, setLoadingState] = useState<LoadingState>('not-loaded')
  const [cart, setCart] = useState<CartItem[]>([])
  const [searchTerm, setSearchTerm] = useState<string>('')
  const [selectedNFT, setSelectedNFT] = useState<NFT | null>(null)
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false)
  const [notification, setNotification] = useState({ message: '', isVisible: false })

  useEffect(() => {
    loadNFTs()
  }, [])

  async function loadNFTs() {
    setLoadingState('loading')
    try {
      const response = await fetch('/api/nfts')
      if (!response.ok) {
        throw new Error('Failed to fetch NFTs')
      }
      const data: NFT[] = await response.json()
      setNfts(data)
      setLoadingState('loaded')
    } catch (error) {
      console.error('Error loading NFTs:', error)
      setLoadingState('error')
    }
  }

  function addToCart(nft: NFT) {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.id === nft.id)
      if (existingItem) {
        return prevCart.map(item => 
          item.id === nft.id ? { ...item, quantity: item.quantity + 1 } : item
        )
      } else {
        return [...prevCart, { ...nft, quantity: 1 }]
      }
    })
    
    // Show notification
    setNotification({ message: `${nft.name} added to cart!`, isVisible: true })
    // Hide notification after 3 seconds
    setTimeout(() => setNotification({ message: '', isVisible: false }), 3000)
  }

  function removeFromCart(nftId: string) {
    setCart(prevCart => prevCart.filter(item => item.id !== nftId))
  }

  function updateQuantity(nftId: string, newQuantity: number) {
    if (newQuantity < 1) {
      removeFromCart(nftId)
    } else {
      setCart(prevCart => prevCart.map(item => 
        item.id === nftId ? { ...item, quantity: newQuantity } : item
      ))
    }
  }

  const filteredNFTs = nfts.filter(nft => 
    nft.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const totalItems = cart.reduce((total, item) => total + item.quantity, 0)
  const totalPrice = cart.reduce((total, item) => total + parseFloat(item.price) * item.quantity, 0)

  function formatETH(priceInWei: string): string {
    return parseFloat(formatEther(priceInWei)).toFixed(2)
  }

  return (
    <Web3ReactProvider connectors={connectors}>
      <div className="relative min-h-screen text-gray-100">
        <CryptoBackground3D />
        <div className="absolute inset-0">
          <Header />
          <main className="container mx-auto px-4 py-20 relative z-10">
            <motion.section 
              initial={{ opacity: 0, y: -50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mb-12 text-center"
            >
              <h2 className="text-6xl font-bold mb-4 text-gradient bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-500 to-red-500">
                Welcome to CryptoMart
              </h2>
              <p className="text-xl mb-8 text-gray-300">Discover and collect unique digital assets</p>
              <div className="flex justify-center space-x-4 mb-8">
                <Button variant="outline" className="hover:bg-purple-700 transition-colors">
                  Connect Wallet
                </Button>
                <Button className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 transition-colors">
                  Start Trading
                </Button>
              </div>
            </motion.section>

            <motion.div 
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mb-12 relative"
            >
              <Input
                type="text"
                placeholder="Search NFTs..."
                value={searchTerm}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
                className="w-full max-w-md mx-auto bg-gray-800 bg-opacity-50 border-gray-700 text-white placeholder-gray-400 pr-10"
              />
              {searchTerm ? (
                <X 
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 cursor-pointer hover:text-white transition-colors"
                  onClick={() => setSearchTerm('')}
                />
              ) : (
                <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              )}
            </motion.div>

            {loadingState === 'loading' && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-center"
              >
                <Loader2Icon className="animate-spin h-12 w-12 mx-auto text-purple-500" />
                <p className="mt-4 text-lg">Loading NFTs...</p>
              </motion.div>
            )}

            {loadingState === 'error' && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-center text-red-500"
              >
                <p className="text-lg">Error loading NFTs. Please try again later.</p>
              </motion.div>
            )}

            {loadingState === 'loaded' && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
              >
                {filteredNFTs.map((nft, index) => (
                  <motion.div
                    key={nft.id}
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <Card className="bg-gray-800 bg-opacity-80 text-white border-gray-700 overflow-hidden transition-transform hover:scale-105 flex flex-col h-full">
                      <CardHeader className="p-0 relative">
                        <img src={nft.image} alt={nft.name} className="w-full h-48 object-cover" />
                        <Badge variant="secondary" className="absolute top-2 right-2 bg-purple-600 text-white">
                          {formatETH(nft.price)} ETH
                        </Badge>
                      </CardHeader>
                      <CardContent className="p-4 flex-grow flex flex-col">
                        <CardTitle className="text-lg font-bold truncate mb-2">{nft.name}</CardTitle>
                        <div className="flex-grow">
                          <p className="text-sm text-gray-300 mb-2 line-clamp-3">
                            {nft.description}
                          </p>
                          {nft.description.length > 100 && (
                            <Button variant="link" size="sm" onClick={() => setSelectedNFT(nft)} className="p-0 h-auto text-purple-400 hover:text-purple-300">
                              Read More
                            </Button>
                          )}
                        </div>
                      </CardContent>
                      <CardFooter className="flex justify-between p-4 bg-gray-900 bg-opacity-80">
                        <Button variant="outline" size="sm" onClick={() => setSelectedNFT(nft)} className="text-purple-400 border-purple-400 hover:bg-purple-400 hover:text-white transition-colors">
                          <TagIcon className="mr-2 h-4 w-4" /> Details
                        </Button>
                        <Button size="sm" onClick={() => addToCart(nft)} className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 transition-colors">
                          <ShoppingCartIcon className="mr-2 h-4 w-4" /> Add to Cart
                        </Button>
                      </CardFooter>
                    </Card>
                  </motion.div>
                ))}
              </motion.div>
            )}

            <SupportedCurrencies />
          </main>

          <Button 
            variant="outline" 
            className="fixed top-4 right-4 flex items-center z-50 bg-gray-800 bg-opacity-80 text-white border-gray-700 hover:bg-gray-700" 
            onClick={() => setIsCartOpen(true)}
          >
            <ShoppingCartIcon className="mr-2 h-4 w-4" />
            Cart ({totalItems})
          </Button>

          <Dialog open={selectedNFT !== null} onOpenChange={() => setSelectedNFT(null)}>
            <DialogContent className="bg-gray-800 bg-opacity-90 text-white border-gray-700">
              <DialogHeader>
                <DialogTitle className="text-2xl font-bold">{selectedNFT?.name}</DialogTitle>
              </DialogHeader>
              <img src={selectedNFT?.image} alt={selectedNFT?.name} className="w-full h-64 object-cover mb-4 rounded" />
              <DialogDescription>
                <p className="text-lg font-semibold mb-2 text-purple-400">Price: {selectedNFT && formatETH(selectedNFT.price)} ETH</p>
                <p className="mb-4 text-gray-300">{selectedNFT?.description}</p>
                <div className="flex justify-between items-center">
                  <Badge variant="secondary" className="bg-purple-600 text-white">NFT</Badge>
                  <Button onClick={() => {
                    if (selectedNFT) addToCart(selectedNFT);
                    setSelectedNFT(null);
                  }} className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 transition-colors">
                    Add to Cart
                  </Button>
                </div>
              </DialogDescription>
            </DialogContent>
          </Dialog>

          <Dialog open={isCartOpen} onOpenChange={setIsCartOpen}>
            <DialogContent className="bg-gray-800 bg-opacity-90 text-white border-gray-700">
              <DialogHeader>
                <DialogTitle className="text-2xl font-bold">Your Cart</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 max-h-[60vh] overflow-y-auto">
                {cart.length === 0 ? (
                  <p className="text-center text-gray-400">Your cart is empty</p>
                ) : (
                  cart.map(item => (
                    <div key={item.id} className="flex items-center justify-between bg-gray-900 bg-opacity-80 p-4 rounded">
                      <div className="flex items-center space-x-4">
                        <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded" />
                        <div>
                          <h4 className="font-semibold">{item.name}</h4>
                          <p className="text-sm text-purple-400">{formatETH(item.price)} ETH</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button size="sm" variant="outline" onClick={() => updateQuantity(item.id, item.quantity - 1)} className="text-white border-gray-600">-</Button>
                        <span>{item.quantity}</span>
                        <Button size="sm" variant="outline" onClick={() => updateQuantity(item.id, item.quantity + 1)} className="text-white border-gray-600">+</Button>
                        <Button size="sm" variant="destructive" onClick={() => removeFromCart(item.id)}>Remove</Button>
                      </div>
                    </div>
                  ))
                )}
              </div>
              <div className="mt-4 flex justify-between items-center text-lg font-semibold">
                <span>Total:</span>
                <span className="text-purple-400">{formatETH(totalPrice.toString())} ETH</span>
              </div>
              <Button className="w-full mt-4 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 transition-colors" disabled={cart.length === 0}>
                <Zap className="mr-2 h-4 w-4" /> Checkout
              </Button>
            </DialogContent>
          </Dialog>
          <AnimatePresence>
            {notification.isVisible && (
              <motion.div
                initial={{ opacity: 0, y: 50, x: '100%' }}
                animate={{ opacity: 1, y: 0, x: 0 }}
                exit={{ opacity: 0, y: 50, x: '100%' }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                className="fixed bottom-4 right-4 bg-gradient-to-r from-purple-600 to-blue-500 text-white px-6 py-3 rounded-lg shadow-lg flex items-center space-x-3 z-50 border border-purple-300"
              >
                <div className="bg-white rounded-full p-1">
                  <Currency className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <p className="font-bold text-sm">NFT Added to Cart!</p>
                  <p className="text-xs opacity-90">{notification.message}</p>
                </div>
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  className="ml-2"
                >
                  <Bitcoin className="h-5 w-5 text-yellow-400" />
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </Web3ReactProvider>
  )
}
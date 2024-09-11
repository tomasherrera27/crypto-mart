'use client'

import React, { useState, useEffect, useRef } from 'react'
import { Button } from "@/app/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/app/components/ui/card"
import { Input } from "@/app/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/app/components/ui/dialog"
import { Badge } from "@/app/components/ui/badge"
import { Loader2Icon, ShoppingCartIcon, TagIcon, Zap, XIcon } from 'lucide-react'
import { Web3ReactProvider } from '@web3-react/core'
import { connectors } from '@/app/lib/web3Config'
import { Header } from './Header'
import { SupportedCurrencies } from './SupportedCurrencies'
import dynamic from 'next/dynamic'

const CryptoBackground3D = dynamic(() => import('./CryptoBackground3D').then((mod) => mod.CryptoBackground3D), {
  ssr: false,
  loading: () => <div className="fixed inset-0 bg-gradient-to-br from-purple-600 to-blue-800">Loading 3D background...</div>
})

export default function CryptoMart() {
  const [nfts, setNfts] = useState([])
  const [loadingState, setLoadingState] = useState('not-loaded')
  const [cart, setCart] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedNFT, setSelectedNFT] = useState(null)
  const [isCartOpen, setIsCartOpen] = useState(false)
  const cartButtonRef = useRef(null)

  type NFT = {
    id: string
    name: string
    image: string
    price: string
    description: string
  }

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
      const data = await response.json()
      setNfts(data)
      setLoadingState('loaded')
    } catch (error) {
      console.error('Error loading NFTs:', error)
      setLoadingState('error')
    }
  }

  function addToCart(nft) {
    const existingItem = cart.find(item => item.id === nft.id)
    if (existingItem) {
      setCart(cart.map(item => 
        item.id === nft.id ? { ...item, quantity: item.quantity + 1 } : item
      ))
    } else {
      setCart([...cart, { ...nft, quantity: 1 }])
    }
  }

  function removeFromCart(nftId: string) {
    setCart(cart.filter(item => item.id !== nftId))
  }

  function updateQuantity(nftId: string, newQuantity: number) {
    if (newQuantity < 1) {
      removeFromCart(nftId)
    } else {
      setCart((prevCart) => prevCart.map(item => 
        item.id === nftId ? { ...item, quantity: newQuantity } : item
      ))
    }
  }

  function openNFTDetails(nft: NFT) {
    setSelectedNFT(nft)
  }

  const filteredNFTs = nfts.filter((nft: NFT) => 
    nft.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const totalItems = cart.reduce((sum, item) => sum + (item.quantity || 0), 0)
  const totalPrice = cart.reduce((sum, item) => sum + (parseFloat(item.price || '0') * (item.quantity || 0)), 0).toFixed(2)

  return (
    <Web3ReactProvider connectors={connectors}>
      <div className="relative min-h-screen text-gray-100 overflow-hidden">
        <CryptoBackground3D />
  <div className="relative z-10 bg-black bg-opacity-30 min-h-screen backdrop-blur-sm">
    <Header />
    <main className="container mx-auto px-4 py-20">
      <section className="mb-16 text-center">
        <h2 className="text-5xl font-bold mb-24 mt-24 text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-blue-500 to-purple-600 animate-pulse">
          Welcome to the Crypto Marketplace
        </h2>
        <p className="text-xl text-gray-200 mb-8">
          Buy, sell, and trade unique digital assets on the blockchain
        </p>
              <div className="flex justify-center space-x-4">
                <Button className="bg-purple-600 hover:bg-purple-700 transition-colors duration-200">
                  <ShoppingCartIcon className="mr-2 h-4 w-4" /> Start Shopping
                </Button>
                <Button variant="outline" className="border-pink-500 text-pink-500 hover:bg-pink-500 hover:text-white transition-all duration-200">
                  <TagIcon className="mr-2 h-4 w-4" /> List an Item
                </Button>
              </div>
            </section>

            <section className="mb-12">
              <div className="flex justify-between items-center mb-6">
                <Input
                  type="text"
                  placeholder="Search NFTs..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="max-w-xs bg-gray-800 border-gray-700 text-white"
                />
              </div>
            </section>

            <section className="mb-20">
              <h3 className="text-3xl font-semibold mb-8 text-center">Featured NFTs</h3>
              {loadingState === 'loading' ? (
                <div className="flex justify-center items-center h-64">
                  <Loader2Icon className="h-8 w-8 animate-spin text-purple-500" />
                </div>
              ) : loadingState === 'error' ? (
                <div className="text-center text-red-500">
                  Failed to load NFTs. Please try again later.
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {filteredNFTs.map((nft: NFT) => (
                    <Card key={nft.id} className="bg-gray-800/80 border-gray-700 overflow-hidden group backdrop-blur-sm">
                      <CardHeader className="p-0">
                        <div className="relative overflow-hidden">
                          <img src={nft.image} alt={nft.name} className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-110" />
                          <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent opacity-0 group-hover:opacity-70 transition-opacity duration-300"></div>
                        </div>
                      </CardHeader>
                      <CardContent className="p-4">
                        <CardTitle className="text-lg font-semibold mb-2">{nft.name}</CardTitle>
                        <p className="text-sm text-gray-400">{nft.price} ETH</p>
                      </CardContent>
                      <CardFooter className="p-4 flex justify-between">
                        <Button 
                          className="flex-1 mr-2 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 transition-all duration-200"
                          onClick={() => addToCart(nft)}
                        >
                          Add to Cart
                        </Button>
                        <Button 
                          variant="outline" 
                          className="flex-1 ml-2"
                          onClick={() => openNFTDetails(nft)}
                        >
                          Details
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              )}
            </section>

            <SupportedCurrencies />
          </main>
        </div>

        <Button 
          ref={cartButtonRef}
          variant="outline" 
          className="fixed top-4 right-4 flex items-center z-50" 
          onClick={() => setIsCartOpen(true)}
        >
          <ShoppingCartIcon className="mr-2 h-4 w-4" />
          Cart ({totalItems})
        </Button>

        <Dialog open={selectedNFT !== null} onOpenChange={() => setSelectedNFT(null)}>
          <DialogContent className="bg-gray-800/90 backdrop-blur-md text-white">
            <DialogHeader>
              <DialogTitle>{selectedNFT?.name}</DialogTitle>
            </DialogHeader>
            <img src={selectedNFT?.image} alt={selectedNFT?.name} className="w-full h-64 object-cover mb-4" />
            <DialogDescription className="text-gray-300">
              <p className="text-lg font-semibold mb-2">Price: {selectedNFT?.price} ETH</p>
              <p className="mb-4">{selectedNFT?.description || 'This is a unique digital asset on the blockchain. Own a piece of the future!'}</p>
              <div className="flex justify-between items-center">
                <Badge variant="secondary">NFT</Badge>
                <Button onClick={() => {
                  addToCart(selectedNFT);
                  setSelectedNFT(null);
                }}>Add to Cart</Button>
              </div>
            </DialogDescription>
          </DialogContent>
        </Dialog>

        <Dialog open={isCartOpen} onOpenChange={setIsCartOpen}>
          <DialogContent className="bg-gray-800/90 backdrop-blur-md text-white">
            <DialogHeader>
              <DialogTitle>Your Cart</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 max-h-[60vh] overflow-y-auto">
              {cart.length === 0 ? (
                <p className="text-center text-gray-400">Your cart is empty</p>
              ) : (
                cart.map(item => (
                  <div key={item.id} className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded" />
                      <div>
                        <h4 className="font-semibold">{item.name}</h4>
                        <p className="text-sm text-gray-400">{item.price} ETH</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button size="sm" variant="outline" onClick={() => updateQuantity(item.id, item.quantity - 1)}>-</Button>
                      <span>{item.quantity}</span>
                      <Button size="sm" variant="outline" onClick={() => updateQuantity(item.id, item.quantity + 1)}>+</Button>
                      <Button size="sm" variant="destructive" onClick={() => removeFromCart(item.id)}>
                        <XIcon className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </div>
            <div className="mt-4 flex justify-between items-center">
              <span className="font-semibold">Total:</span>
              <span>{totalPrice} ETH</span>
            </div>
            <Button className="w-full mt-4" disabled={cart.length === 0}>
              Checkout
            </Button>
          </DialogContent>
        </Dialog>
      </div>
    </Web3ReactProvider>
  )
}
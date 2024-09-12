'use client'

import React, { useState, useEffect } from 'react'
import { Button } from "@/app/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/app/components/ui/card"
import { Input } from "@/app/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/app/components/ui/dialog"
import { Badge } from "@/app/components/ui/badge"
import { Loader2Icon, ShoppingCartIcon, TagIcon, Zap } from 'lucide-react'
import { Web3ReactProvider } from '@web3-react/core'
import { connectors } from '@/app/lib/web3Config'
import { Header } from './Header'
import { SupportedCurrencies } from './SupportedCurrencies'

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

  function formatETH(price: string): string {
    return parseFloat(price).toFixed(4)
  }

  return (
    <Web3ReactProvider connectors={connectors}>
      <div className="relative min-h-screen text-gray-100">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <section className="mb-8 text-center">
            <h2 className="text-4xl font-bold mb-4">Welcome to CryptoMart</h2>
            <p className="text-xl mb-6">Discover and collect unique digital assets</p>
            <div className="flex justify-center space-x-4 mb-8">
              <Button variant="outline">Connect Wallet</Button>
              <Button>Start Trading</Button>
            </div>
            <SupportedCurrencies />
          </section>

          <div className="mb-8">
            <Input
              type="text"
              placeholder="Search NFTs..."
              value={searchTerm}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
              className="w-full max-w-md mx-auto"
            />
          </div>

          {loadingState === 'loading' && (
            <div className="text-center">
              <Loader2Icon className="animate-spin h-8 w-8 mx-auto" />
              <p>Loading NFTs...</p>
            </div>
          )}

          {loadingState === 'error' && (
            <div className="text-center text-red-500">
              <p>Error loading NFTs. Please try again later.</p>
            </div>
          )}

          {loadingState === 'loaded' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredNFTs.map(nft => (
                <Card key={nft.id} className="bg-gray-800 text-white">
                  <CardHeader>
                    <CardTitle className="flex justify-between items-center">
                      <span className="text-lg">{nft.name}</span>
                      <Badge variant="secondary">{formatETH(nft.price)} ETH</Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <img src={nft.image} alt={nft.name} className="w-full h-40 object-cover mb-4 rounded" />
                    <p className="text-sm mb-2 h-12 overflow-hidden">{nft.description}</p>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Button variant="outline" size="sm" onClick={() => setSelectedNFT(nft)}>
                      <TagIcon className="mr-2 h-4 w-4" /> Details
                    </Button>
                    <Button size="sm" onClick={() => addToCart(nft)}>
                      <ShoppingCartIcon className="mr-2 h-4 w-4" /> Add to Cart
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </main>

        <Button 
          variant="outline" 
          className="fixed top-4 right-4 flex items-center z-50" 
          onClick={() => setIsCartOpen(true)}
        >
          <ShoppingCartIcon className="mr-2 h-4 w-4" />
          Cart ({totalItems})
        </Button>

        <Dialog open={selectedNFT !== null} onOpenChange={() => setSelectedNFT(null)}>
          <DialogContent className="bg-gray-800 text-white">
            <DialogHeader>
              <DialogTitle>{selectedNFT?.name}</DialogTitle>
            </DialogHeader>
            <img src={selectedNFT?.image} alt={selectedNFT?.name} className="w-full h-64 object-cover mb-4 rounded" />
            <DialogDescription>
              <p className="text-lg font-semibold mb-2">Price: {selectedNFT && formatETH(selectedNFT.price)} ETH</p>
              <p className="mb-4">{selectedNFT?.description}</p>
              <div className="flex justify-between items-center">
                <Badge variant="secondary">NFT</Badge>
                <Button onClick={() => {
                  if (selectedNFT) addToCart(selectedNFT);
                  setSelectedNFT(null);
                }}>Add to Cart</Button>
              </div>
            </DialogDescription>
          </DialogContent>
        </Dialog>

        <Dialog open={isCartOpen} onOpenChange={setIsCartOpen}>
          <DialogContent className="bg-gray-800 text-white">
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
                        <p className="text-sm text-gray-400">{formatETH(item.price)} ETH</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button size="sm" variant="outline" onClick={() => updateQuantity(item.id, item.quantity - 1)}>-</Button>
                      <span>{item.quantity}</span>
                      <Button size="sm" variant="outline" onClick={() => updateQuantity(item.id, item.quantity + 1)}>+</Button>
                      <Button size="sm" variant="destructive" onClick={() => removeFromCart(item.id)}>Remove</Button>
                    </div>
                  </div>
                ))
              )}
            </div>
            <div className="mt-4 flex justify-between items-center">
              <span className="font-semibold">Total:</span>
              <span>{formatETH(totalPrice.toString())} ETH</span>
            </div>
            <Button className="w-full mt-4" disabled={cart.length === 0}>
              <Zap className="mr-2 h-4 w-4" /> Checkout
            </Button>
          </DialogContent>
        </Dialog>
      </div>
    </Web3ReactProvider>
  )
}
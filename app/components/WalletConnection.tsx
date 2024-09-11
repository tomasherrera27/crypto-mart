import { useState, useEffect } from 'react'
import { useWeb3React } from '@web3-react/core'
import { Button } from "@/app/components/ui/button"
import { metaMask } from '@/app/lib/web3Config'
import { motion } from 'framer-motion'
import { Loader2 } from 'lucide-react'

export function WalletConnection() {
  const { account, isActive, connector } = useWeb3React()
  const [error, setError] = useState('')
  const [isConnecting, setIsConnecting] = useState(false)

  async function connect() {
    setError('')
    setIsConnecting(true)
    try {
      if (typeof window.ethereum === 'undefined') {
        setError('Please install MetaMask!')
        return
      }
      await metaMask.activate()
      localStorage.setItem('isWalletConnected', 'true')
    } catch (ex) {
      console.error('Failed to connect wallet:', ex)
      if (ex.code === 4001) {
        setError('Connection rejected. Please try again.')
      } else if (ex.code === -32002) {
        setError('Please open MetaMask and accept the connection request.')
      } else {
        setError('Failed to connect wallet. Please try again.')
      }
    } finally {
      setIsConnecting(false)
    }
  }

  async function disconnect() {
    try {
      if (connector?.deactivate) {
        await connector.deactivate()
      } else {
        await connector.resetState()
      }
      localStorage.removeItem('isWalletConnected')
    } catch (ex) {
      console.error('Failed to disconnect wallet:', ex)
      setError('Failed to disconnect wallet. Please try again.')
    }
  }

  useEffect(() => {
    const connectWalletOnPageLoad = async () => {
      if (localStorage?.getItem('isWalletConnected') === 'true') {
        try {
          await metaMask.connectEagerly()
        } catch (ex) {
          console.error('Failed to connect wallet on page load:', ex)
        }
      }
    }
    connectWalletOnPageLoad()
  }, [])

  function truncateAddress(address: string) {
    return `${address.slice(0, 6)}...${address.slice(-4)}`
  }

  return (
    <div>
      {isActive && account ? (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-full py-2 px-4 flex items-center space-x-2 shadow-lg hover:shadow-xl transition-shadow duration-300"
        >
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
          <span className="text-white font-medium">
            {truncateAddress(account)}
          </span>
          <svg width="20" height="20" viewBox="0 0 784.37 1277.39" className="text-white">
            <path fill="currentColor" d="m392.07 0-8.57 29.11v844.63l8.57 8.55 392.06-231.75z"/>
            <path fill="currentColor" d="m392.07 0-392.07 650.54 392.07 231.75v-418.94z"/>
            <path fill="currentColor" d="m392.07 956.52-4.83 5.89v300.87l4.83 14.1 392.3-552.49z"/>
            <path fill="currentColor" d="m392.07 1277.38v-320.86l-392.07-231.63z"/>
          </svg>
          <Button 
            onClick={disconnect} 
            variant="ghost" 
            size="sm"
            className="text-white hover:text-gray-200 transition-colors duration-200"
          >
            Disconnect
          </Button>
        </motion.div>
      ) : (
        <Button 
          onClick={connect} 
          disabled={isConnecting}
          className="bg-gradient-to-r from-purple-600 to-pink-600 text-white font-medium py-2 px-4 rounded-full shadow-lg hover:shadow-xl transition-shadow duration-300"
        >
          {isConnecting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Connecting...
            </>
          ) : (
            'Connect Wallet'
          )}
        </Button>
      )}
      {error && <p className="text-red-500 mt-2 text-sm">{error}</p>}
    </div>
  )
}
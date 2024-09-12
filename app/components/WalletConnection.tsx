import React, { useState, useEffect } from 'react'
import { useWeb3React } from '@web3-react/core'
import { Button } from "@/app/components/ui/button"
import { metaMask } from '@/app/lib/web3Config'
import { motion } from 'framer-motion'
import { Loader2 } from 'lucide-react'

export function WalletConnection() {
  const { account, isActive, connector } = useWeb3React()
  const [error, setError] = useState<string>('')
  const [isConnecting, setIsConnecting] = useState<boolean>(false)

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
      if (ex instanceof Error) {
        if ('code' in ex) {
          switch (ex.code) {
            case 4001:
              setError('Connection rejected. Please try again.')
              break
            case -32002:
              setError('Please open MetaMask and accept the connection request.')
              break
            default:
              setError('Failed to connect wallet. Please try again.')
          }
        } else {
          setError(ex.message || 'Failed to connect wallet. Please try again.')
        }
      } else {
        setError('An unknown error occurred. Please try again.')
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
      if (ex instanceof Error) {
        setError(ex.message || 'Failed to disconnect wallet. Please try again.')
      } else {
        setError('An unknown error occurred while disconnecting. Please try again.')
      }
    }
  }

  useEffect(() => {
    const connectWalletOnPageLoad = async () => {
      if (localStorage?.getItem('isWalletConnected') === 'true') {
        try {
          await metaMask.activate()
        } catch (ex) {
          console.error('Failed to connect wallet on page load:', ex)
        }
      }
    }
    connectWalletOnPageLoad()
  }, [])

  return (
    <>
      {isActive ? (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Button onClick={disconnect} variant="outline">
            Disconnect {account && `(${account.slice(0, 6)}...${account.slice(-4)})`}
          </Button>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Button onClick={connect} disabled={isConnecting}>
            {isConnecting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Connecting...
              </>
            ) : (
              'Connect Wallet'
            )}
          </Button>
        </motion.div>
      )}
      {error && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="text-red-500 mt-2"
        >
          {error}
        </motion.p>
      )}
    </>
  )
}
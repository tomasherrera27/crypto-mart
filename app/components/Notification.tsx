import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Bitcoin, Currency } from 'lucide-react'

type NotificationProps = {
  message: string
  isVisible: boolean
}

export function Notification({ message, isVisible }: NotificationProps) {
  return (
    <AnimatePresence>
      {isVisible && (
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
            <p className="text-xs opacity-90">{message}</p>
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
  )
}
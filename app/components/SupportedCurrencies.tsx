import React from 'react'
import { motion } from 'framer-motion'
import { Coins, Bitcoin, DollarSign } from 'lucide-react'

const currencies = [
  { name: 'Ethereum', icon: Coins, color: 'text-blue-400', bgColor: 'bg-blue-400/20' },
  { name: 'Bitcoin', icon: Bitcoin, color: 'text-yellow-500', bgColor: 'bg-yellow-500/20' },
  { name: 'Stablecoins', icon: DollarSign, color: 'text-green-500', bgColor: 'bg-green-500/20' },
]

export function SupportedCurrencies() {
  return (
    <motion.section 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="py-16 bg-gray-900/50 backdrop-blur-md"
    >
      <div className="container mx-auto px-4">
        <h3 className="text-3xl font-bold mb-12 text-center text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
          Supported Cryptocurrencies
        </h3>
        <div className="flex flex-wrap justify-center gap-8">
          {currencies.map((currency, index) => (
            <motion.div 
              key={currency.name}
              className="flex flex-col items-center"
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: index * 0.2, duration: 0.5 }}
            >
              <motion.div 
                className={`p-4 rounded-full ${currency.bgColor}`}
                whileHover={{ scale: 1.1, rotate: 360 }}
                transition={{ type: "spring", stiffness: 300, damping: 10 }}
              >
                <currency.icon className={`h-12 w-12 ${currency.color}`} />
              </motion.div>
              <motion.span 
                className="mt-4 font-medium text-gray-300"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: index * 0.2 + 0.3, duration: 0.5 }}
              >
                {currency.name}
              </motion.span>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.section>
  )
}
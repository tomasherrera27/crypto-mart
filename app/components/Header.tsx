import { motion } from 'framer-motion'
import { Button } from "@/app/components/ui/button"
import { WalletConnection } from './WalletConnection'
import Link from 'next/link'

export function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-gray-800 backdrop-blur-md bg-gray-900/70">
      <div className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Link href="/">
              <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
                CryptoMart
              </h1>
            </Link>
          </motion.div>
          <nav className="flex items-center space-x-6">
            <Button variant="ghost" className="text-gray-300 hover:text-white transition-colors duration-200">
              Explore
            </Button>
            <Button variant="ghost" className="text-gray-300 hover:text-white transition-colors duration-200">
              Create
            </Button>
            <WalletConnection />
          </nav>
        </div>
      </div>
    </header>
  )
}
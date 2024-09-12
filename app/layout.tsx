import './globals.css'
import type { Metadata } from 'next'
import dynamic from 'next/dynamic'

export const metadata: Metadata = {
  title: 'CryptoMart - Buy, Sell, and Trade Digital Assets',
  description: 'CryptoMart is a marketplace for buying, selling, and trading unique digital assets on the blockchain.',
}

const CryptoBackground3D = dynamic(() => import('./components/CryptoBackground3D'), {
  ssr: false,
  loading: () => <div className="fixed inset-0 bg-black">Loading 3D background...</div>
})

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-transparent">
        <CryptoBackground3D />
        <main className="relative z-10">{children}</main>
      </body>
    </html>
  );
}
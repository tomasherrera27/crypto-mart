import { Web3ReactHooks, initializeConnector } from '@web3-react/core'
import { MetaMask } from '@web3-react/metamask'

const [metaMask, metaMaskHooks] = initializeConnector<MetaMask>(
  (actions) => new MetaMask({ actions })
)

export { metaMask, metaMaskHooks }

export const connectors: [MetaMask, Web3ReactHooks][] = [
  [metaMask, metaMaskHooks]
]
export class MetaMaskAdapter {
  id = 'metamask';
  name = 'MetaMask';
  icon = '/MetaMask-icon-fox.svg';

  isAvailable(): boolean {
    return typeof window !== 'undefined' && !!(window as any).ethereum && (window as any).ethereum.isMetaMask;
  }

  async connect(): Promise<string | null> {
    const ethereum = (window as any).ethereum;
    if (!ethereum) return null;
    try {
      const accounts = await ethereum.request({ method: 'eth_requestAccounts' }) as string[] | undefined | null;
      if (Array.isArray(accounts) && accounts.length > 0) {
        return accounts[0];
      }
      return null;
    } catch {
      return null;
    }
  }

  // Switch to Sepolia, add it if not yet in MetaMask
  async switchToSepolia(): Promise<boolean> {
    const ethereum = (window as any).ethereum;
    if (!ethereum) return false;
    try {
      await ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: '0xaa36a7' }],
      });
      return true;
    } catch (error: any) {
      // 4902 = chain not added yet
      if (error.code === 4902) {
        try {
          await ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [{
              chainId: '0xaa36a7',
              chainName: 'Sepolia Testnet',
              rpcUrls: ['https://rpc.sepolia.org'],
              nativeCurrency: { name: 'ETH', symbol: 'ETH', decimals: 18 },
              blockExplorerUrls: ['https://sepolia.etherscan.io'],
            }],
          });
          return true;
        } catch {
          return false;
        }
      }
      return false;
    }
  }
}
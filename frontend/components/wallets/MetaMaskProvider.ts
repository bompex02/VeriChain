export class MetaMaskAdapter {
  id = 'metamask';
  name = 'MetaMask';
  icon = '/MetaMask-icon-fox.svg';

  // check if MetaMask is available in the browser
  isAvailable(): boolean {
    return typeof window !== 'undefined' && !!(window as any).ethereum && (window as any).ethereum.isMetaMask;
  }

  // connect to MetaMask and return the first account address
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
}
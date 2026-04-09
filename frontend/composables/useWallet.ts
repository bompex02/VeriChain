import { ref, readonly, inject, provide } from 'vue'

const walletSymbol = Symbol('wallet')

// provider to set wallet info in the app
export function provideWallet(account: string | null, provider: any) {
  provide(walletSymbol, {
    account: readonly(ref(account)),
    provider,
  })
}

// hook to access wallet info in components
export function useWallet() {
  const wallet = inject<{ account: string | null; provider: any }>(walletSymbol)
  if (!wallet) throw new Error('Wallet not provided')
  return wallet
}

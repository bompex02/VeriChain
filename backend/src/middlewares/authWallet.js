// backend/src/middlewares/authWallet.js
// Middleware für Wallet-basierte Authentifizierung (Sign-In with Ethereum)
import { ApiError } from '../errors/ApiError.js'
import { ethers } from 'ethers'

export async function authWallet(req, res, next) {
  // Erwartet: req.headers['x-wallet-address'], req.headers['x-wallet-signature'], req.headers['x-wallet-nonce']
  const address = req.headers['x-wallet-address']
  const signature = req.headers['x-wallet-signature']
  const nonce = req.headers['x-wallet-nonce']
  if (!address || !signature || !nonce) {
    return next(new ApiError('Wallet authentication required', 401))
  }
  try {
    const recovered = ethers.verifyMessage(nonce, signature)
    if (recovered.toLowerCase() !== address.toLowerCase()) {
      return next(new ApiError('Invalid wallet signature', 401))
    }
    req.user = { address }
    next()
  } catch (e) {
    return next(new ApiError('Wallet authentication failed', 401))
  }
}

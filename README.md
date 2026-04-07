# VeriChain Monorepo

This repository contains three subsystems:

1. frontend: Nuxt 3 app for issuing, dashboard, verify, and revoke
2. backend: Express API with controller-service architecture
3. blockchain: Hardhat + Solidity contract for credentials

## Requirements

1. Node.js 18+
2. npm
3. Git

## Project Structure

1. frontend: UI, IPFS upload, and display
2. backend: REST endpoints and blockchain integration
3. blockchain: contract, Hardhat configuration, deploy script
4. shared/abi.json: ABI shared by backend and frontend

## Setup

1. Install dependencies:

```bash
cd frontend && npm install
cd ../backend && npm install
cd ../blockchain && npm install
```

2. Create env files:

frontend/.env

```env
NEXT_PUBLIC_API_URL=http://localhost:5000
PINATA_JWT=YOUR_PINATA_JWT_HERE
PINATA_API_URL=https://api.pinata.cloud/pinning/pinFileToIPFS
```

backend/.env

```env
BACKEND_PORT=5000
RPC_URL=http://127.0.0.1:8545
FRONTEND_URL=http://localhost:3000
PRIVATE_KEY=0xYOUR_PRIVATE_KEY_HERE
CONTRACT_ADDRESS=YOUR_DEPLOYED_CONTRACT_ADDRESS
```

blockchain/.env

```env
RPC_URL=http://127.0.0.1:8545
```

## Local Startup Order

1. Start Hardhat node:

```bash
cd blockchain
npx hardhat node
```

2. Deploy contract:

```bash
cd blockchain
npx hardhat run scripts/deploy.ts --network localhost
```

3. Put the deployed contract address into backend/.env as CONTRACT_ADDRESS.

4. Start backend:

```bash
cd backend
node src/app.js
```

5. Start frontend:

```bash
cd frontend
npm run dev
```

## Architecture Updates

### Backend

The API is now layered:

1. routes -> controller binding
2. controllers -> HTTP layer
3. services -> business logic and validation
4. contract gateway -> ethers contract access
5. middlewares -> asyncHandler and global errorHandler

### Frontend

TypeScript code was refactored into services and domain types:

1. services/http/ApiClient.ts
2. services/credentials/CredentialService.ts
3. services/ipfs/PinataUploader.ts
4. types/credential.ts and types/http.ts

### IPFS Data Model

Issuing always stores credential.json on IPFS. This metadata includes form data plus optional originalFileUri. The dashboard shows metadata in View and displays Open original file when originalFileUri exists.

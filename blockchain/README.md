# Blockchain

Hardhat project for the credentials smart contract.

## Requirements

1. Node.js 18+
2. npm

## Environment

File: blockchain/.env

```env
RPC_URL=http://127.0.0.1:8545
```

## Local Development

1. Start Hardhat node:

```bash
cd blockchain
npx hardhat node
```

2. Run deploy:

```bash
cd blockchain
npx hardhat run scripts/deploy.ts --network localhost
```

3. Put the printed contract address into backend/.env as CONTRACT_ADDRESS.

## Key Files

1. contracts/Credentials.sol
2. scripts/deploy.ts
3. hardhat.config.ts
4. ../shared/abi.json is used by backend and frontend

*** Delete File: /home/marcus/repos/VeriChain/backend/README_BACKEND.md
*** Delete File: /home/marcus/repos/VeriChain/frontend/README_FRONTEND.md
*** Delete File: /home/marcus/repos/VeriChain/blockchain/README_BLOCKCHAIN.md

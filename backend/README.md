# Backend

Express backend for credential operations on the smart contract.

## Requirements

1. Node.js 18+
2. npm

## Environment

File: backend/.env

```env
BACKEND_PORT=5000
RPC_URL=http://127.0.0.1:8545
FRONTEND_URL=http://localhost:3000
PRIVATE_KEY=0xYOUR_PRIVATE_KEY_HERE
CONTRACT_ADDRESS=YOUR_DEPLOYED_CONTRACT_ADDRESS
```

Notes:

1. All variables are required.
2. PRIVATE_KEY must be a 0x-prefixed 64-hex string.
3. Never commit PRIVATE_KEY or .env files.

## Start

```bash
cd backend
npm install
node src/app.js
```

## Current Architecture

1. src/routes/credentials.js: routing and binding
2. src/controllers/CredentialController.js: HTTP controller
3. src/services/CredentialService.js: business logic + validation
4. src/services/contractService.js: ContractGateway for ethers access
5. src/middlewares/asyncHandler.js: async error forwarding
6. src/middlewares/errorHandler.js: global error response
7. src/errors/ApiError.js: standardized API errors

## Endpoints

1. GET /credentials/all
2. POST /credentials/issue
3. POST /credentials/revoke
4. POST /credentials/activate
5. GET /credentials/verify/:id

## Validation Rules

1. recipient must be a valid Ethereum address.
2. uri must be a non-empty string.
3. id must be a non-negative integer.

# Frontend

Nuxt 3 frontend for credential issuing, dashboard, verify, and revoke.

## Requirements

1. Node.js 18+
2. npm

## Environment

File: frontend/.env

```env
NEXT_PUBLIC_API_URL=http://localhost:5000
PINATA_JWT=YOUR_PINATA_JWT_HERE
PINATA_API_URL=https://api.pinata.cloud/pinning/pinFileToIPFS
```

## Start

```bash
cd frontend
npm install
npm run dev
```

Note: The current dev script starts nuxt dev and then ipfs daemon. Make sure ipfs is installed, or start Nuxt directly with npx nuxt dev.

## Refactored TypeScript Architecture

1. composables/usePinataClient.ts
2. services/http/ApiClient.ts
3. services/credentials/CredentialService.ts
4. services/ipfs/PinataUploader.ts
5. types/credential.ts
6. types/http.ts

## Current Issuing Flow

1. Optional original file is uploaded to IPFS.
2. credential.json is always uploaded to IPFS afterward.
3. credential.json contains form data plus optional originalFileUri.
4. The on-chain URI points to credential.json.

## Dashboard View Behavior

1. View shows content from credential.json.
2. Open original file appears when originalFileUri exists.
3. Legacy entries with direct file URI are still supported.

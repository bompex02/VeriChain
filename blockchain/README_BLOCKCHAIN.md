# Blockchain — Entwicklung

Hardhat/Deployment-Anweisungen

Prereqs
- Node.js (>=18)

Environment
- Lege `blockchain/.env` an mit:
  ```env
  RPC_URL=http://localhost:8545
  ```

Lokales Testnetz & Deploy
1. Starte Hardhat-Node:
   ```bash
   cd blockchain
   npx hardhat node
   ```
2. Deploy-Skript ausführen:
   ```bash
   # prüfe package.json scripts oder
   npx hardhat run scripts/deploy.ts --network localhost
   ```

Hinweis
- `deploy.ts` erwartet `RPC_URL` in der Umgebung; es gibt keine Fallbacks.
- Ignoriere `.env` per `.gitignore` und verwalte Schlüssel sicher.

# Backend — Entwicklung

Express-basiertes Backend. Schnellstart:

Prereqs
- Node.js (>=18)

Environment (wichtig)
- Lege `backend/.env` an mit folgenden Variablen:
  ```env
  RPC_URL=http://localhost:8545
  FRONTEND_URL=http://localhost:3000
  BACKEND_PORT=5000
  PRIVATE_KEY=0x<deine-private-key>
  CONTRACT_ADDRESS=0x<deployed-contract-address>
  ```
- `PRIVATE_KEY` ist sensibel — nicht in Git einchecken.

Install & Run
```bash
cd backend
npm install
node src/app.js
```

Notes
- Das Backend erwartet alle genannten Env-Variablen; es gibt keine Fallbacks.
- Falls du lokales Hardhat-Node nutzt, setze `RPC_URL` auf `http://localhost:8545`.

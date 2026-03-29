# Entwicklung (Root)

Kurz: Anweisungen zum lokalen Entwickeln aller Teilsysteme (frontend, backend, blockchain).

Voraussetzungen
- Node.js (>=18) und npm
- Git

Schnellstart
1. Installiere Abhängigkeiten für alle Subprojekte:
   ```bash
   cd frontend && npm install
   cd ../backend && npm install
   cd ../blockchain && npm install
   ```
2. Legen Sie lokale Environment-Dateien an (nicht in VCS prüfen):
   - `frontend/.env.local` — z.B. `NEXT_PUBLIC_API_URL=http://localhost:5000`
   - `backend/.env` — z.B. `RPC_URL=http://localhost:8545`, `FRONTEND_URL=http://localhost:3000`, `BACKEND_PORT=5000`, `PRIVATE_KEY=0x...`, `CONTRACT_ADDRESS=0x...`
   - `blockchain/.env` — z.B. `RPC_URL=http://localhost:8545`

Wichtig: Entferne niemals Produktions-Schlüssel oder `.env`-Dateien aus Verzeichnissen in Git. Stelle sicher, dass `.gitignore` die `.env*`-Dateien enthält.

Starten (empfohlenes Ablaufbeispiel)
1. Lokales Blockchain-Testnetz (Hardhat):
   ```bash
   cd blockchain
   npx hardhat node
   ```
2. Backend starten:
   ```bash
   cd backend
   node src/app.js
   ```
3. Frontend starten:
   ```bash
   cd frontend
   npm run dev
   ```

Weitere Hinweise
- CORS: Backend liest `FRONTEND_URL` und `BACKEND_PORT` aus `backend/.env`.
- Wenn du CI/CD oder Secrets-Manager verwendest, lade sensible Werte dort statt per `.env`.

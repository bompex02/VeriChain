# Frontend — Entwicklung

Dieses Verzeichnis enthält die Next.js App. Kurzanleitung zum Entwickeln:

Prereqs
- Node.js (>=18)

Environment
- Lege `frontend/.env.local` an (wird von Next.js geladen):
  ```
  NEXT_PUBLIC_API_URL=http://localhost:5000
  ```
  - `NEXT_PUBLIC_API_URL` sollte auf das Backend zeigen.

Install & Run
```bash
cd frontend
npm install
npm run dev
```

Wichtige Hinweise
- Client-seitige Umgebungsvariablen müssen mit `NEXT_PUBLIC_` beginnen.
- `.env.local` darf nicht committet werden — stelle sicher, dass `.gitignore` `.env*` enthält.

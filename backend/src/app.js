import express from "express";
import credentialsRoutes from "./routes/credentials.js";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

// Require env variables, do not fall back to defaults
const CORS_ORIGIN = process.env.FRONTEND_URL;
const PORT = process.env.BACKEND_PORT;

if (!CORS_ORIGIN) {
  console.error("Environment variable FRONTEND_URL is required but not set.");
  process.exit(1);
}
if (!PORT) {
  console.error("Environment variable BACKEND_PORT is required but not set.");
  process.exit(1);
}

const app = express();
app.use(cors({
  origin: CORS_ORIGIN,
  credentials: true,
}));

// Handle preflight requests explicitly without using app.options with wildcard
app.use((req, res, next) => {
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', CORS_ORIGIN);
    res.setHeader('Access-Control-Allow-Methods', 'GET,HEAD,PUT,PATCH,POST,DELETE');
    const requestHeaders = req.header('Access-Control-Request-Headers');
    if (requestHeaders) res.setHeader('Access-Control-Allow-Headers', requestHeaders);
    return res.sendStatus(204);
  }
  next();
});

app.use(express.json());
app.use("/credentials", credentialsRoutes);

app.listen(Number(PORT), () => {
  console.log(`Backend running on port ${PORT}`);
});
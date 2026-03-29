import { ethers } from "ethers";
import abiJson from "../../../shared/abi.json" with { type: "json" };
import dotenv from "dotenv";

dotenv.config();

// Require RPC_URL, PRIVATE_KEY and CONTRACT_ADDRESS from environment
const RPC_URL = process.env.RPC_URL;
const PRIVATE_KEY = process.env.PRIVATE_KEY;
const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS;

if (!RPC_URL) {
  console.error("Environment variable RPC_URL is required but not set.");
  process.exit(1);
}
if (!PRIVATE_KEY) {
  console.error("Environment variable PRIVATE_KEY is required but not set.");
  process.exit(1);
}
if (!/^0x[0-9a-fA-F]{64}$/.test(PRIVATE_KEY)) {
  console.error("Environment variable PRIVATE_KEY is not a valid 0x-prefixed 64-hex string.");
  process.exit(1);
}
if (!CONTRACT_ADDRESS) {
  console.error("Environment variable CONTRACT_ADDRESS is required but not set.");
  process.exit(1);
}

const provider = new ethers.JsonRpcProvider(RPC_URL);
const signer = new ethers.Wallet(PRIVATE_KEY, provider);
const contract = new ethers.Contract(CONTRACT_ADDRESS, abiJson.abi, signer);

export default contract;
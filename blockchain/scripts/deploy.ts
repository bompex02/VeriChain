import { ethers } from "ethers";
import * as fs from "fs";
import * as path from "path";
import { fileURLToPath } from "url";
import dotenv from 'dotenv'; 
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function main() {
  if (!process.env.RPC_URL) {
    console.error("Environment variable RPC_URL is required for deployment but not set.");
    process.exit(1);
  }
  const provider = new ethers.JsonRpcProvider(process.env.RPC_URL); //RPX = Remote Procedure Call
  const signer = await provider.getSigner();

  const artifactPath = path.resolve(
    __dirname,
    "../artifacts/contracts/Credentials.sol/Credentials.json"
  );
  const artifact = JSON.parse(fs.readFileSync(artifactPath, "utf8"));

  const factory = new ethers.ContractFactory(artifact.abi, artifact.bytecode, signer);
  const contract = await factory.deploy();

  await contract.waitForDeployment();

  console.log("Contract deployed to:", await contract.getAddress());
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
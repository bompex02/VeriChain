import { ethers } from "ethers";
import abiJson from "../../../shared/abi.json" with { type: "json" };
import dotenv from "dotenv";

dotenv.config();

export class ContractGateway {
  constructor(env = process.env) {
    this.rpcUrl = env.RPC_URL;
    this.privateKey = env.PRIVATE_KEY;
    this.contractAddress = env.CONTRACT_ADDRESS;

    this.validateEnv();

    const provider = new ethers.JsonRpcProvider(this.rpcUrl);
    const signer = new ethers.Wallet(this.privateKey, provider);
    this.contract = new ethers.Contract(this.contractAddress, abiJson.abi, signer);
  }

  validateEnv() {
    if (!this.rpcUrl) {
      console.error("Environment variable RPC_URL is required but not set.");
      process.exit(1);
    }
    if (!this.privateKey) {
      console.error("Environment variable PRIVATE_KEY is required but not set.");
      process.exit(1);
    }
    if (!/^0x[0-9a-fA-F]{64}$/.test(this.privateKey)) {
      console.error("Environment variable PRIVATE_KEY is not a valid 0x-prefixed 64-hex string.");
      process.exit(1);
    }
    if (!this.contractAddress) {
      console.error("Environment variable CONTRACT_ADDRESS is required but not set.");
      process.exit(1);
    }
  }

  getContract() {
    return this.contract;
  }
}

const contractGateway = new ContractGateway();
export default contractGateway;
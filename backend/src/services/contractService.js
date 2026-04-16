import { ethers } from "ethers";
import abiJson from "../../../shared/abi.json" with { type: "json" };
import dotenv from "dotenv";

dotenv.config();

// gateway to interact with the smart contract, handles connection and contract instance
class ContractGateway {
  constructor(env = process.env) {
    this.rpcUrl = env.RPC_URL;
    this.contractAddress = env.CONTRACT_ADDRESS;

    if (!this.rpcUrl) {
      console.error("Environment variable RPC_URL is required but not set.");
      process.exit(1);
    }
    if (!this.contractAddress) {
      console.error("Environment variable CONTRACT_ADDRESS is required but not set.");
      process.exit(1);
    }

    this.provider = new ethers.JsonRpcProvider(this.rpcUrl);
    this.contract = new ethers.Contract(this.contractAddress, abiJson.abi, this.provider);
  }

  getContract() {
    return this.contract;
  }
}

const contractGateway = new ContractGateway();
export default contractGateway;
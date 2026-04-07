import contractGateway from './contractService.js';
import { ApiError } from '../errors/ApiError.js';
import { isAddress } from 'ethers';

export class CredentialService {
  constructor(gateway = contractGateway) {
    this.gateway = gateway;
  }

  // fetch all credentials from the blockchain and return as an array of JSON objects
  async getAllCredentials() {
    const contract = this.gateway.getContract();
    const count = await contract.credentialCount();
    const credentials = [];

    // goes through all credential IDs and fetch their details from the contract, 
    // then formats them as JSON objects
    for (let i = 0; i < Number(count); i++) {
      const credential = await contract.credentials(i);
      credentials.push({
        id: i,
        issuer: credential.issuer,
        recipient: credential.recipient,
        metadataURI: credential.metadataURI,
        timestamp: Number(credential.timestamp),
        revoked: credential.revoked,
      });
    }

    return credentials;
  }

  // issue a new credential on the blockchain with the given recipient and metadata URI
  async issueCredential(recipient, uri) {
    if (!recipient || !isAddress(recipient)) {
      throw new ApiError('Field "recipient" is required and must be a valid Ethereum address.', 400);
    }
    if (!uri || typeof uri !== 'string') {
      throw new ApiError('Field "uri" is required.', 400);
    }

    const contract = this.gateway.getContract();
    const tx = await contract.issueCredential(recipient, uri);
    await tx.wait();

    return { success: true, txHash: tx.hash };
  }

  // revoke a credential on the blockchain with the given ID
  async revokeCredential(id) {
    const parsedId = this.parseId(id);
    const contract = this.gateway.getContract();
    const tx = await contract.revokeCredential(parsedId);
    await tx.wait();

    return { success: true, txHash: tx.hash };
  }

  // activate a credential on the blockchain with the given ID
  async activateCredential(id) {
    const parsedId = this.parseId(id);
    const contract = this.gateway.getContract();
    const tx = await contract.activateCredential(parsedId);
    await tx.wait();

    return { success: true, txHash: tx.hash };
  }

  // verify a credential on the blockchain with the given ID and return its status
  async verifyCredential(id) {
    const parsedId = this.parseId(id);
    const contract = this.gateway.getContract();
    const valid = await contract.verifyCredential(parsedId);

    return { valid };
  }

  // parse and validate a credential ID from a string input, ensuring it is a non-negative integer
  parseId(id) {
    const parsedId = Number(id);
    if (!Number.isInteger(parsedId) || parsedId < 0) {
      throw new ApiError('Field "id" must be a non-negative integer.', 400);
    }

    return parsedId;
  }
}

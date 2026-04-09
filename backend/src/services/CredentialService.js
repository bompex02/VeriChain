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
    for (let i = 0; i < Number(count); i++) {
      const credential = await contract.credentials(i);
      // Erweiterung: Hole optionale Freigabeinfos aus Offchain-DB
      const sharing = await this.getCredentialSharing(i);
      credentials.push({
        id: i,
        issuer: credential.issuer,
        recipient: credential.recipient,
        metadataURI: credential.metadataURI,
        timestamp: Number(credential.timestamp),
        revoked: credential.revoked,
        isPublic: sharing.isPublic,
        sharedWith: sharing.sharedWith,
      });
    }
    return credentials;
  }

  // fetch credentials for a specific owner (default: nur eigene)
  async getCredentialsForOwner(ownerAddress) {
    const contract = this.gateway.getContract();
    const count = await contract.credentialCount();
    const credentials = [];
    for (let i = 0; i < Number(count); i++) {
      const credential = await contract.credentials(i);
      if (credential.recipient.toLowerCase() !== ownerAddress.toLowerCase()) continue;
      const sharing = await this.getCredentialSharing(i);
      credentials.push(
        new Credential(
        i,
        credential.issuer,
        credential.recipient,
        credential.metadataURI,
        Number(credential.timestamp),
        credential.revoked,
        sharing.isPublic,
        sharing.sharedWith,
      ));
    }
    return credentials;
  }

  // fetch a credential if it is public
  async getPublicCredential(id) {
    const contract = this.gateway.getContract();
    const credential = await contract.credentials(id);
    const sharing = await this.getCredentialSharing(id);
    if (!sharing.isPublic) throw new ApiError('Credential is not public', 403);
    return new Credential(
      id,
      credential.issuer,
      credential.recipient,
      credential.metadataURI,
      Number(credential.timestamp),
      credential.revoked,
      true,
      sharing.sharedWith,
    );
  }

  // fetch a credential if it is shared with the given address
  async getSharedCredential(id, address) {
    const contract = this.gateway.getContract();
    const credential = await contract.credentials(id);
    const sharing = await this.getCredentialSharing(id);
    if (!sharing.sharedWith.includes(address.toLowerCase())) throw new ApiError('Credential not shared with you', 403);
    return new Credential(
      id,
      credential.issuer,
      credential.recipient,
      credential.metadataURI,
      Number(credential.timestamp),
      credential.revoked,
      sharing.isPublic,
      sharing.sharedWith,
    );
  }

  // Dummy: Fetch sharing info from Offchain-DB (here: in-memory, TODO: DB)
  async getCredentialSharing(id) {
    // TODO: Replace with DB (e.g., MongoDB, Postgres, etc.)
    if (!this._sharing) this._sharing = {};
    if (!this._sharing[id]) {
      this._sharing[id] = { isPublic: false, sharedWith: [] };
    }
    return this._sharing[id];
  }

  // set sharing status of a credential (only owner, Offchain-DB)
  async setCredentialSharing(id, { isPublic, sharedWith, ownerAddress }) {
    const contract = this.gateway.getContract();
    const credential = await contract.credentials(id);
    if (credential.recipient.toLowerCase() !== ownerAddress.toLowerCase()) {
      throw new ApiError('Only the owner can change sharing status', 403);
    }
    if (!this._sharing) this._sharing = {};
    this._sharing[id] = {
      isPublic: !!isPublic,
      sharedWith: Array.isArray(sharedWith) ? sharedWith.map(a => a.toLowerCase()) : [],
    };
    return this._sharing[id];
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

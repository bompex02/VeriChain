import contractGateway from './contractService.js';
import { ApiError } from '../errors/ApiError.js';
import { getMongoDb } from '../db/mongoClient.js';

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

  // fetch a credential if it is public
  async getPublicCredential(id) {
    const contract = this.gateway.getContract();
    const credential = await contract.credentials(id);
    const sharing = await this.getCredentialSharing(id);
    if (!sharing.isPublic) throw new ApiError('Credential is not public', 403);
    return {
      id,
      issuer: credential.issuer,
      recipient: credential.recipient,
      metadataURI: credential.metadataURI,
      timestamp: Number(credential.timestamp),
      revoked: credential.revoked,
      isPublic: true,
      sharedWith: sharing.sharedWith,
    };
  }

  // fetch a credential if it is shared with the given address
  async getSharedCredential(id, address) {
    const contract = this.gateway.getContract();
    const credential = await contract.credentials(id);
    const sharing = await this.getCredentialSharing(id);
    if (!sharing.sharedWith.includes(address.toLowerCase())) throw new ApiError('Credential not shared with you', 403);
    return {
      id,
      issuer: credential.issuer,
      recipient: credential.recipient,
      metadataURI: credential.metadataURI,
      timestamp: Number(credential.timestamp),
      revoked: credential.revoked,
      isPublic: sharing.isPublic,
      sharedWith: sharing.sharedWith,
    };
  }

  // fetch sharing info from MongoDB, return default if not found
  async getCredentialSharing(id) {
    try {
      const db = getMongoDb();
      const sharingInfo = await db.collection('credentialSharing').findOne({ credentialId: id });
      if (sharingInfo) {
        return sharingInfo;
      }
      return { isPublic: false, sharedWith: [] };
    } catch (err) {
      console.error('MongoDB error in getCredentialSharing:', err);
      return { isPublic: false, sharedWith: [] };
    }
  }

  // get sharing status for owner only
  async getCredentialSharingForOwner(id, ownerAddress) {
    const parsedId = this.parseId(id);
    const contract = this.gateway.getContract();
    const credential = await contract.credentials(parsedId);
    if (credential.recipient.toLowerCase() !== ownerAddress.toLowerCase()) {
      throw new ApiError('Only the owner can read sharing status', 403);
    }
    return await this.getCredentialSharing(parsedId);
  }


  // set sharing status of a credential (only owner, MongoDB)
  async setCredentialSharing(id, { isPublic, sharedWith, ownerAddress }) {
    const parsedId = this.parseId(id);
    const contract = this.gateway.getContract();
    const credential = await contract.credentials(parsedId);
    if (credential.recipient.toLowerCase() !== ownerAddress.toLowerCase()) {
      throw new ApiError('Only the owner can change sharing status', 403);
    }
    try {
      const db = getMongoDb();
      const update = {
        isPublic: !!isPublic,
        sharedWith: Array.isArray(sharedWith) ? sharedWith.map(a => a.toLowerCase()) : [],
      };
      await db.collection('credentialSharing').updateOne(
        { credentialId: parsedId },
        { $set: update },
        { upsert: true }
      );
      return update;
    } catch (err) {
      console.error('MongoDB error in setCredentialSharing:', err);
      throw new ApiError('Database error while saving sharing status', 500);
    }
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

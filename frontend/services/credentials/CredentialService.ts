
import type {
  SharingInfo,
  SetSharingRequest,
  SetSharingResponse,
  CredentialMetadata,
  CredentialRecord,
  MetadataViewResult,
} from '../../types/credential';

import { ApiClient } from '../http/ApiClient';
import { ethers } from 'ethers';
import abi from '../../../shared/abi.json';

interface TxResponse {
  success: boolean;
  txHash: string;
}

interface VerifyResponse {
  valid: boolean;
}

export class CredentialService {
  constructor(private readonly apiClient: ApiClient) {}

  async getAll(): Promise<CredentialRecord[]> {
    const response = await this.apiClient.get<unknown>('/credentials/all');
    return Array.isArray(response) ? (response as CredentialRecord[]) : [];
  }


  private async getWalletAuthHeaders(): Promise<Record<string, string>> {
    if (!(window as any).ethereum) {
      throw new Error('MetaMask is not available');
    }

    const provider = new ethers.BrowserProvider((window as any).ethereum);
    const signer = await provider.getSigner();
    const address = await signer.getAddress();
    const nonce = `verichain-sharing-${Date.now()}`;
    const signature = await signer.signMessage(nonce);

    return {
      'x-wallet-address': address,
      'x-wallet-signature': signature,
      'x-wallet-nonce': nonce,
    };
  }

  // Issue credential directly via MetaMask/ethers.js
  async issue(contractAddress: string, recipient: string, uri: string): Promise<TxResponse> {
    if (!(window as any).ethereum) throw new Error('MetaMask is not available');
    const provider = new ethers.BrowserProvider((window as any).ethereum);
    const signer = await provider.getSigner();
    const contract = new ethers.Contract(contractAddress, abi.abi, signer);
    const tx = await contract.issueCredential(recipient, uri);
    await tx.wait();
    return { success: true, txHash: tx.hash };
  }

  // Revoke directly via MetaMask/ethers.js
  async revoke(contractAddress: string, id: number): Promise<TxResponse> {
    if (!(window as any).ethereum) throw new Error('MetaMask is not available');
    const provider = new ethers.BrowserProvider((window as any).ethereum);
    const signer = await provider.getSigner();
    const contract = new ethers.Contract(contractAddress, abi.abi, signer);
    const tx = await contract.revokeCredential(id);
    await tx.wait();
    return { success: true, txHash: tx.hash };
  }

  // Activate directly via MetaMask/ethers.js
  async activate(contractAddress: string, id: number): Promise<TxResponse> {
    if (!(window as any).ethereum) throw new Error('MetaMask is not available');
    const provider = new ethers.BrowserProvider((window as any).ethereum);
    const signer = await provider.getSigner();
    const contract = new ethers.Contract(contractAddress, abi.abi, signer);
    const tx = await contract.activateCredential(id);
    await tx.wait();
    return { success: true, txHash: tx.hash };
  }

  async verify(id: string): Promise<boolean> {
    const response = await this.apiClient.get<VerifyResponse>(`/credentials/verify/${id}`);
    return response.valid;
  }

  static buildMetadata(form: {
    recipient: string;
    type: string;
    name: string;
    issuer: string;
    description: string;
    issueDate: string;
  }, originalFileUri: string | null): CredentialMetadata {
    return {
      type: ['VerifiableCredential', form.type],
      recipient: form.recipient,
      issuer: {
        name: form.issuer,
      },
      issuanceDate: new Date(form.issueDate).toISOString(),
      credentialSubject: {
        name: form.name,
        description: form.description,
      },
      originalFileUri,
    };
  }

  static async resolveMetadataView(metadataUri: string): Promise<MetadataViewResult> {
    const metadataUrl = CredentialService.toGatewayUrl(metadataUri);

    try {
      if (metadataUrl.startsWith('data:')) {
        const base64 = metadataUrl.split(',')[1];
        const json = JSON.parse(atob(base64));

        return {
          content: JSON.stringify(json, null, 2),
          originalFileUri: typeof json?.originalFileUri === 'string' ? CredentialService.toGatewayUrl(json.originalFileUri) : '',
          errorMessage: '',
        };
      }

      const response = await fetch(metadataUrl);
      if (!response.ok) {
        throw new Error('Could not fetch metadata URI');
      }

      const contentType = response.headers.get('content-type') || '';
      if (contentType.includes('application/json')) {
        const json = await response.json();
        return {
          content: JSON.stringify(json, null, 2),
          originalFileUri: typeof json?.originalFileUri === 'string' ? CredentialService.toGatewayUrl(json.originalFileUri) : '',
          errorMessage: '',
        };
      }

      return {
        content: `Non-JSON file detected (${contentType || 'unknown type'}).`,
        originalFileUri: metadataUrl,
        errorMessage: '',
      };
    } catch {
      return {
        content: 'Use the button below to open the original file if available.',
        originalFileUri: metadataUrl,
        errorMessage: 'Details could not be parsed as JSON.',
      };
    }
  }

  static toGatewayUrl(uri: string): string {
    if (uri.startsWith('ipfs://')) {
      return `https://gateway.pinata.cloud/ipfs/${uri.replace('ipfs://', '')}`;
    }

    return uri;
  }

  static hasExternalUri(uri: string): boolean {
    return uri.startsWith('http://') || uri.startsWith('https://') || uri.startsWith('ipfs://');
  }

  // Get sharing info for a credential (owner-authenticated via signed wallet nonce)
  async getSharing(id: number): Promise<SharingInfo> {
    const headers = await this.getWalletAuthHeaders();
    return await this.apiClient.get<SharingInfo>(`/credentials/sharing/${id}`, headers);
  }

  // Set sharing info for a credential (owner-authenticated via signed wallet nonce)
  async setSharing(req: SetSharingRequest): Promise<SetSharingResponse> {
    const headers = await this.getWalletAuthHeaders();
    return await this.apiClient.post<SetSharingResponse, SetSharingRequest>(
      '/credentials/set-sharing',
      req,
      headers
    );
  }
}

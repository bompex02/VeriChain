import type {
  CredentialMetadata,
  CredentialRecord,
  MetadataViewResult,
} from '../../types/credential';
import { ApiClient } from '../http/ApiClient';

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

  async issue(recipient: string, uri: string): Promise<TxResponse> {
    return await this.apiClient.post<TxResponse, { recipient: string; uri: string }>('/credentials/issue', {
      recipient,
      uri,
    });
  }

  async revoke(id: number): Promise<TxResponse> {
    return await this.apiClient.post<TxResponse, { id: number }>('/credentials/revoke', { id });
  }

  async activate(id: number): Promise<TxResponse> {
    return await this.apiClient.post<TxResponse, { id: number }>('/credentials/activate', { id });
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
}

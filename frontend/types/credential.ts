export interface CredentialRecord {
  id: number;
  issuer: string;
  recipient: string;
  metadataURI: string;
  timestamp: number;
  revoked: boolean;
}

export interface CredentialMetadata {
  type: string[];
  recipient: string;
  issuer: {
    name: string;
  };
  issuanceDate: string;
  credentialSubject: {
    name: string;
    description: string;
  };
  originalFileUri?: string | null;
}

export interface CredentialFormData {
  recipient: string;
  type: string;
  name: string;
  issuer: string;
  description: string;
  issueDate: string;
}

export interface MetadataViewResult {
  content: string;
  originalFileUri: string;
  errorMessage: string;
}

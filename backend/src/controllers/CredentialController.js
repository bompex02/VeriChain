export class CredentialController {
  constructor(credentialService) {
    this.credentialService = credentialService;
  }

  // get all credentials from the blockchain and return as JSON
  getAll = async (req, res) => {
    const credentials = await this.credentialService.getAllCredentials();
    res.json(credentials);
  };

  // issue a new credential on the blockchain with the given recipient and metadata URI
  issue = async (req, res) => {
    const { recipient, uri } = req.body;
    const result = await this.credentialService.issueCredential(recipient, uri);
    res.json(result);
  };

  // revoke a credential on the blockchain with the given ID
  revoke = async (req, res) => {
    const { id } = req.body;
    const result = await this.credentialService.revokeCredential(id);
    res.json(result);
  };

  // activate a credential on the blockchain with the given ID
  activate = async (req, res) => {
    const { id } = req.body;
    const result = await this.credentialService.activateCredential(id);
    res.json(result);
  };

  // verify a credential on the blockchain with the given ID and return its status
  verify = async (req, res) => {
    const { id } = req.params;
    const result = await this.credentialService.verifyCredential(id);
    res.json(result);
  };
}

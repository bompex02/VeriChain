export class CredentialController {
  constructor(credentialService) {
    this.credentialService = credentialService;
  }

  // get all credentials from the blockchain and return as JSON
  getAll = async (req, res) => {
    const credentials = await this.credentialService.getAllCredentials();
    res.json(credentials);
  };

  // verify a credential on the blockchain with the given ID and return its status
  verify = async (req, res) => {
    const { id } = req.params;
    const result = await this.credentialService.verifyCredential(id);
    res.json(result);
  };

  // get credentials for the authenticated owner (default: nur eigene)
  getMine = async (req, res) => {
    const address = req.user?.address || req.query.address;
    if (!address) return res.status(401).json({ error: 'No address provided' });
    const credentials = await this.credentialService.getCredentialsForOwner(address);
    res.json(credentials);
  };

  // get a public credential by id
  getPublic = async (req, res) => {
    const { id } = req.params;
    const credential = await this.credentialService.getPublicCredential(Number(id));
    res.json(credential);
  };

  // get a shared credential by id (nur wenn geteilt)
  getShared = async (req, res) => {
    const { id } = req.params;
    const address = req.user?.address || req.query.address;
    if (!address) return res.status(401).json({ error: 'No address provided' });
    const credential = await this.credentialService.getSharedCredential(Number(id), address);
    res.json(credential);
  };

  // set sharing status (nur Owner)
  setSharing = async (req, res) => {
    const { id, isPublic, sharedWith } = req.body;
    const ownerAddress = req.user?.address;
    if (!ownerAddress) return res.status(401).json({ error: 'No address provided' });
    const result = await this.credentialService.setCredentialSharing(id, { isPublic, sharedWith, ownerAddress });
    res.json(result);
  };

  // get sharing status (nur Owner)
  getSharing = async (req, res) => {
    const { id } = req.params;
    const ownerAddress = req.user?.address;
    if (!ownerAddress) return res.status(401).json({ error: 'No address provided' });
    const sharing = await this.credentialService.getCredentialSharingForOwner(Number(id), ownerAddress);
    res.json(sharing);
  };
}

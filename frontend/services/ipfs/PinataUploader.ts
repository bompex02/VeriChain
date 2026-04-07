export class PinataUploader {
  constructor(
    private readonly jwt: string,
    private readonly pinataApiUrl: string,
  ) {}

  async uploadFile(file: File): Promise<string | null> {
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch(this.pinataApiUrl, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${this.jwt}`,
        },
        body: formData,
      });

      const data = await response.json();
      if (data?.IpfsHash) {
        return `https://gateway.pinata.cloud/ipfs/${data.IpfsHash}`;
      }

      console.error('Pinata response missing IpfsHash:', data);
      return null;
    } catch (error) {
      console.error('Pinata upload error:', error);
      return null;
    }
  }
}

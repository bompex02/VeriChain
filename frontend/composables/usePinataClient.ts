export function usePinataClient(jwt: string) {
  async function uploadFile(file: File) {
    const url = process.env.NUXT_PINATA_API_URL || '';
    const formData = new FormData();
    formData.append("file", file);
    try {
      const res = await fetch(url, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
        body: formData,
      });
      const data = await res.json();
      if (data.IpfsHash) {
        return `https://gateway.pinata.cloud/ipfs/${data.IpfsHash}`;
      } else {
        console.error('Pinata response missing IpfsHash:', data);
        return null;
      }
    } catch (e) {
      console.error("Pinata Upload Error:", e);
      return null;
    }
  }
  return { uploadFile };
}
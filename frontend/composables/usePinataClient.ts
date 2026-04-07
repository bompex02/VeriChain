import { useRuntimeConfig } from "nuxt/app";
import { PinataUploader } from '../services/ipfs/PinataUploader';

export function usePinataClient(jwt: string) {
  const config = useRuntimeConfig();
  const uploader = new PinataUploader(jwt, String(config.public.PINATA_API_URL));

  async function uploadFile(file: File) {
    return await uploader.uploadFile(file);
  }

  return { uploadFile };
}
import { HypercertClient, validateAllowlist } from "@hypercerts-org/sdk";

const useHypercertsSDK = () => {
  const client = new HypercertClient({
    nftStorageToken: process.env.NFT_STORAGE_TOKEN,
    web3StorageToken: process.env.WEB3_STORAGE_TOKEN,
  });
  const validator = { validateAllowlist };

  return { client, validator };
};

export default useHypercertsSDK;

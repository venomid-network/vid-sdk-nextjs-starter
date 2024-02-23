import { Address, ProviderRpcClient } from "everscale-inpage-provider";
import { ROOT_CONTRACT_ADDRESS } from "./constants";
import nftAbi from "abi/Nft.abi.json";
import indexAbi from "abi/Index.abi.json";

export interface BaseNftJson {
  name?: string;
  tokenId?: string;
  address?: string;
  network?: string;
  avatar?: string;
  hash?: string;
  target?: string;
  manageUrl?: string;
  description?: string;
  preview?: {
    source: string;
    mimetype: string;
  };
  files?: Array<{
    source: string;
    mimetype: string;
  }>;
  attributes?: Array<{
    trait_type: string;
    value: string;
  }>;
  external_url?: string;
  metadata?: any;
  info?: any;
}


type IndexInfo = {
  collection: Address;
  owner: Address;
  nft: Address;
};

export const getNftImage = async (
  provider: ProviderRpcClient,
  nftAddress: Address
): Promise<string> => {
  const nftContract = new provider.Contract(nftAbi, nftAddress);
  // calling getJson function of NFT contract
  const getJsonAnswer = (await nftContract.methods
    .getJson({ answerId: 0 } as never)
    .call()) as { json: string };
  const json = JSON.parse(getJsonAnswer.json ?? "{}") as BaseNftJson;

  return json.preview?.source || "";
};

export const getNft = async (
  provider: ProviderRpcClient,
  nftAddress: Address
): Promise<BaseNftJson> => {
  const nftContract = new provider.Contract(nftAbi, nftAddress);
  ///console.log('getting nft',nftContract)

  // calling getJson function of NFT contract
  const getJsonAnswer = (await nftContract.methods
    .getJson({ answerId: 0 } as never)
    .call()) as { json: string };
  //console.log(getJsonAnswer);
  const getInfoAnswer = (await nftContract.methods
    .getInfo({ answerId: 0 } as never)
    .call()) as any;
  const json = JSON.parse(getJsonAnswer.json ?? "{}") as BaseNftJson;
  json.address = nftAddress.toString();
  json.network = "venom testnet";
  json.info = getInfoAnswer;
  return json;
};

// Returns array with NFT's json
export const getCollectionItemsJson = async (
  provider: ProviderRpcClient,
  nftAddresses: Address[]
): Promise<BaseNftJson[]> => {
  return Promise.all(
    nftAddresses.map(async (nftAddress) => {
      const imgInfo = (await getNft(provider, nftAddress)) as BaseNftJson;
      return imgInfo;
    })
  );
};

// Returns array with NFT's images urls
export const getCollectionItems = async (
  provider: ProviderRpcClient,
  nftAddresses: Address[]
): Promise<string[]> => {
  return Promise.all(
    nftAddresses.map(async (nftAddress) => {
      const imgInfo = (await getNftImage(provider, nftAddress)) as string;
      return imgInfo;
    })
  );
};

export const getNftImagesByIndexes = async (
  provider: ProviderRpcClient,
  indexAddresses: Address[]
): Promise<string[]> => {
  const nftAddresses = await Promise.all(
    indexAddresses.map(async (indexAddress) => {
      // console.log(indexAddress)
      const indexContract = new provider.Contract(indexAbi, indexAddress);
      const indexInfo = (await indexContract.methods
        .getInfo({ answerId: 0 } as never)
        .call()) as IndexInfo;
      return indexInfo.nft;
    })
  );
  return getCollectionItems(provider, nftAddresses);
};

export const getNftsByIndexes = async (
  provider: ProviderRpcClient,
  indexAddresses: Address[]
): Promise<BaseNftJson[]> => {
  const nftAddresses = await Promise.all(
    indexAddresses.map(async (indexAddress) => {
      // console.log(indexAddress)
      const indexContract = new provider.Contract(indexAbi, indexAddress);
      const indexInfo = (await indexContract.methods
        .getInfo({ answerId: 0 } as never)
        .call()) as IndexInfo;
      return indexInfo.nft;
    })
  );
  return getCollectionItemsJson(provider, nftAddresses);
};

export const getNftByIndex = async (
  provider: ProviderRpcClient,
  indexAddress: Address
): Promise<BaseNftJson> => {
  // console.log(indexAddress)
  const indexContract = new provider.Contract(indexAbi, indexAddress);
  const indexInfo = (await indexContract.methods
    .getInfo({ answerId: 0 } as never)
    .call()) as IndexInfo;
  const imgInfo = (await getNft(provider, indexInfo.nft)) as BaseNftJson;
  return imgInfo;
};

// Method to returning a salted index code (base64)
export const saltCode = async (
  provider: ProviderRpcClient,
  userAddress: string,
  contractAddress: string
) => {
  if (!provider || !provider.isInitialized) return;
  // Index StateInit you should take from github. It ALWAYS constant!
  const INDEX_BASE_64 =
    "te6ccgECIAEAA4IAAgE0AwEBAcACAEPQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAgAgaK2zUfBAQkiu1TIOMDIMD/4wIgwP7jAvILHAYFHgOK7UTQ10nDAfhmifhpIds80wABn4ECANcYIPkBWPhC+RDyqN7TPwH4QyG58rQg+COBA+iogggbd0CgufK0+GPTHwHbPPI8EQ4HA3rtRNDXScMB+GYi0NMD+kAw+GmpOAD4RH9vcYIImJaAb3Jtb3Nwb3T4ZNwhxwDjAiHXDR/yvCHjAwHbPPI8GxsHAzogggujrde64wIgghAWX5bBuuMCIIIQR1ZU3LrjAhYSCARCMPhCbuMA+EbycyGT1NHQ3vpA0fhBiMjPjits1szOyds8Dh8LCQJqiCFus/LoZiBu8n/Q1PpA+kAwbBL4SfhKxwXy4GT4ACH4a/hs+kJvE9cL/5Mg+GvfMNs88gAKFwA8U2FsdCBkb2Vzbid0IGNvbnRhaW4gYW55IHZhbHVlAhjQIIs4rbNYxwWKiuIMDQEK103Q2zwNAELXTNCLL0pA1yb0BDHTCTGLL0oY1yYg10rCAZLXTZIwbeICFu1E0NdJwgGOgOMNDxoCSnDtRND0BXEhgED0Do6A34kg+Gz4a/hqgED0DvK91wv/+GJw+GMQEQECiREAQ4AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABAD/jD4RvLgTPhCbuMA0x/4RFhvdfhk0ds8I44mJdDTAfpAMDHIz4cgznHPC2FeIMjPkll+WwbOWcjOAcjOzc3NyXCOOvhEIG8TIW8S+ElVAm8RyM+EgMoAz4RAzgH6AvQAcc8LaV4gyPhEbxXPCx/OWcjOAcjOzc3NyfhEbxTi+wAaFRMBCOMA8gAUACjtRNDT/9M/MfhDWMjL/8s/zsntVAAi+ERwb3KAQG90+GT4S/hM+EoDNjD4RvLgTPhCbuMAIZPU0dDe+kDR2zww2zzyABoYFwA6+Ez4S/hK+EP4QsjL/8s/z4POWcjOAcjOzc3J7VQBMoj4SfhKxwXy6GXIz4UIzoBvz0DJgQCg+wAZACZNZXRob2QgZm9yIE5GVCBvbmx5AELtRNDT/9M/0wAx+kDU0dD6QNTR0PpA0fhs+Gv4avhj+GIACvhG8uBMAgr0pCD0oR4dABRzb2wgMC41OC4yAAAADCD4Ye0e2Q==";
  // Gettind a code from Index StateInit
  const tvc = await provider.splitTvc(INDEX_BASE_64);
  if (!tvc.code) throw new Error("tvc code is empty");
  // Salt structure that we already know
  const saltStruct = [
    { name: "collection", type: "address" },
    { name: "owner", type: "address" },
    { name: "type", type: "fixedbytes3" }, // according on standards, each index salted with string 'nft'
  ] as const;
  const { code: saltedCode } = await provider.setCodeSalt({
    code: tvc.code,
    salt: {
      structure: saltStruct,
      abiVersion: "2.1",
      data: {
        collection: new Address(contractAddress),
        owner: new Address(userAddress),
        type: btoa("nft"),
      },
    },
  });
  return saltedCode;
};

// Method, that return Index'es addresses by single query with fetched code hash
export const getAddressesFromIndex = async (
  codeHash: string,
  provider: ProviderRpcClient,
  limit?: number
): Promise<Address[] | undefined> => {
  const addresses = await provider?.getAccountsByCodeHash({ codeHash, limit });
  return addresses?.accounts;
};

export async function lookupNames(
  provider: ProviderRpcClient,
  address: string,
  limit?: number
): Promise<string[]> {
  if (!provider) return [];

  const saltedCode = await saltCode(
    provider,
    String(address),
    ROOT_CONTRACT_ADDRESS
  );

  const codeHash = await provider.getBocHash(String(saltedCode));
  if (!codeHash) {
    return [];
  }

  const indexesAddresses = await getAddressesFromIndex(codeHash, provider, limit);
  if (!indexesAddresses || indexesAddresses.length === 0) {
    return [];
  }

  const nfts = await Promise.all(indexesAddresses.map(async (indexAddress) => {
    try {
      const _nftJson = await getNftByIndex(provider, indexAddress);
      if (address === _nftJson.target) {
        return String(_nftJson.name);
      } else {
        return '';
      }
    } catch (e) {
      return '';
    }
  }));

  return nfts.filter((nft) => nft !== null && nft !== undefined && nft.length > 3);
}

import Jimp from "jimp";
import { PinataSDK } from "pinata";

type Metadata = {
  name: string;
  description: string;
  external_url: string;
  image: string;
  attributes: {
    trait_type: "Collection" | "Chain";
    value: string;
  }[];
};

export async function getPinata(
  jwt: string,
  gateway: string
): Promise<PinataSDK> {
  return new PinataSDK({
    pinataJwt: jwt,
    pinataGateway: gateway,
  });
}

export async function invertImage(imageUrl: string): Promise<string> {
  try {
    const image = await Jimp.read(imageUrl);
    image.invert();
    const base64 = await image.getBase64Async(Jimp.MIME_PNG);
    return base64;
  } catch (error) {
    console.error("Error inverting image:", error);
    throw error;
  }
}

export function createMetadata(
  name: string,
  description: string,
  collection: string,
  chain: string,
  image: string
): Metadata {
  return {
    name: name,
    description: description,
    external_url: "TODO",
    image: image,
    attributes: [
      {
        trait_type: "Collection",
        value: collection,
      },
      {
        trait_type: "Chain",
        value: chain,
      },
    ],
  };
}

export async function uploadToIpfs(
  pinata: PinataSDK,
  metadata: Metadata
): Promise<string> {
  try {
    const metadataJson = JSON.stringify(metadata);
    const metadataBlob = new Blob([metadataJson], { type: "application/json" });
    const metadataFile = new File([metadataBlob], "metadata.json", {
      type: "application/json",
    });

    const uploadResult = await pinata.upload.file(metadataFile);
    return uploadResult.IpfsHash;
  } catch (error) {
    throw new Error(`Error uploading to IPFS via Pinata: ${error}`);
  }
}

export async function createNftStorageCollection(
  apiKey: string
): Promise<boolean> {
  const url =
    "https://preserve.nft.storage/api/v1/collection/create_collection";
  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${apiKey}`,
  };
  const body = JSON.stringify({
    contractAddress: "0x00000000000000000000000000000000DeaDBeef",
    collectionName: "Inverse",
    chainID: "41455",
    network: "Aleph Zero EVM",
  });

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: headers,
      body: body,
    });
    console.log(response);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.text();
    console.log(data);
    if (data !== "Collection Created") {
      throw new Error(`Collection creation failed: ${data}`);
    }
    return true;
  } catch (error) {
    throw new Error(`Error creating collection on nft.storage: ${error}`);
  }
}

export async function addTokensToNftStorageCollection(
  apiKey: string,
  tokenId: string,
  cid: string
): Promise<boolean> {
  const url = "https://preserve.nft.storage/api/v1/collection/add_tokens";
  const csvContent = `${tokenId},${cid}`;
  const formData = new FormData();
  formData.append("collectionID", "0x00000000000000000000000000000000DeaDBeef");
  formData.append(
    "file",
    new Blob([csvContent], { type: "text/csv" }),
    "tokens.csv"
  );

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
      },
      body: formData,
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.text();
    console.log(data);
    if (data !== "Tokens added") {
      throw new Error(`Failed to add token: ${data}`);
    }
    return true;
  } catch (error) {
    throw new Error(
      `Error adding tokens to collection on nft.storage: ${error}`
    );
  }
}

/// Example usage
// Get Pinata instance
const pinata = await getPinata("PINATA_JWT", "PINATA_GATEWAY");
// Create NFT.storage collection (only needs to be done once)
if (!(await createNftStorageCollection("NFT_STORAGE_API_KEY")))
  throw new Error("NFT.storage collection creation failed");
// Example image URL
const url = "https://raw.seadn.io/files/33cffa98c16c1d14f3f874a1237a4d08.png";
// Invert image and convert to base64
const base64 = await invertImage(url);
// Create metadata
const metadata = createMetadata(
  "Remiliangel #717",
  "A Collection of souls trapped in cyberspace.",
  "Remiliangel",
  "Ethereum",
  base64
);
// Upload metadata to IPFS via Pinata
const uploadCid = await uploadToIpfs(pinata, metadata);
// TODO: Mint NFT and retrieve resultant tokenId
// Pin IPFS data to Filecoin using NFT.storage for tokenId
if (
  !(await addTokensToNftStorageCollection(
    "NFT_STORAGE_API_KEY",
    "INVERSE_TOKENID",
    uploadCid
  ))
)
  throw new Error("Adding token to NFT.storage collection failed");

import dotenv from "dotenv";
import { ethers } from "ethers";
import contractABI from "./abi.json";

dotenv.config();

// Configuration
const RPC_URL = process.env.TESTNET_RPC_URL;
const CONTRACT_ADDRESS = "0x2e28b5cc90d8a9e4d661417568eb83bdd2df26c3";
const MINTER_PRIVATE_KEY = process.env.MINTER_PRIVATE_KEY;
const SIGNER_PRIVATE_KEY = process.env.SIGNER_PRIVATE_KEY;

if (!RPC_URL || !MINTER_PRIVATE_KEY || !SIGNER_PRIVATE_KEY) {
  throw new Error("Missing environment variables");
}

// Connect to the network
const provider = new ethers.JsonRpcProvider(RPC_URL);

// Create wallet instances
const minterWallet = new ethers.Wallet(MINTER_PRIVATE_KEY, provider);
const signerWallet = new ethers.Wallet(SIGNER_PRIVATE_KEY, provider);

// Create contract instance
const contract = new ethers.Contract(
  CONTRACT_ADDRESS,
  contractABI,
  minterWallet
);

interface SigData {
  collection: string;
  identifier: number;
  addr: string;
}

// Function to create signature
async function createSignature(
  collection: string,
  identifier: number,
  addr: string
): Promise<string> {
  const sigData: SigData = {
    collection,
    identifier,
    addr,
  };

  const messageHash = await contract.getMessageHash(sigData);
  return signerWallet.signMessage(ethers.getBytes(messageHash));
}

// Function to mint NFT
async function mintNFT(
  metadataUri: string,
  collection: string,
  identifier: number
): Promise<void> {
  try {
    const minterAddress = await minterWallet.getAddress();
    const signature = await createSignature(
      collection,
      identifier,
      minterAddress
    );

    const sigData: SigData = {
      collection,
      identifier,
      addr: minterAddress,
    };

    const tx = await contract.mint(metadataUri, sigData, signature);
    const receipt = await tx.wait();
    console.log("NFT minted successfully!");
    console.log("Transaction hash:", receipt.hash);
    console.log("Gas used:", receipt.gasUsed.toString());
  } catch (error) {
    console.error("Error minting NFT:", error);
  }
}

// Example usage
async function main() {
  const metadataUri = "https://remilio.org/remilio/json/8952"; // Replace with your metadata URI
  const collection = "Redacted Remilio Babies"; // Replace with your collection name
  const identifier = 8952; // Replace with your identifier

  await mintNFT(metadataUri, collection, identifier);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});

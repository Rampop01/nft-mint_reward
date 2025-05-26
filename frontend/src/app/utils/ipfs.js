import { NFTStorage } from 'nft.storage';

// Replace with your actual NFT.Storage API key
const NFT_STORAGE_KEY = 'YOUR_NFT_STORAGE_API_KEY';

const client = new NFTStorage({ token: NFT_STORAGE_KEY });

export async function uploadToIPFS(file) {
  try {
    // Read the file data
    const data = await file.arrayBuffer();
    const blob = new Blob([data], { type: file.type });
    
    // Upload to IPFS via NFT.Storage
    const cid = await client.storeBlob(blob);
    return `https://ipfs.io/ipfs/${cid}`;
  } catch (error) {
    console.error("Error uploading to IPFS:", error);
    throw error;
  }
}

export async function createNFTMetadata(name, description, imageUrl) {
  try {
    const metadata = {
      name,
      description,
      image: imageUrl,
      attributes: []
    };
    
    // Convert metadata to a Blob
    const metadataBlob = new Blob([JSON.stringify(metadata)], { type: 'application/json' });
    
    // Upload metadata to IPFS
    const cid = await client.storeBlob(metadataBlob);
    return `https://ipfs.io/ipfs/${cid}`;
  } catch (error) {
    console.error("Error creating NFT metadata:", error);
    throw error;
  }
}

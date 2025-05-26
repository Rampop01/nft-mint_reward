"use client";

import { useState } from 'react';
import { uploadToIPFS, createNFTMetadata } from '../utils/ipfs';
import { mintNFT } from '../utils/web3';

export default function MintNFTForm() {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState('');
  const [loading, setLoading] = useState(false);
  const [txHash, setTxHash] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
    }
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!name || !description || !file) {
      setError('Please fill all fields and upload an image');
      return;
    }
    
    try {
      setLoading(true);
      setError('');
      
      // Upload image to IPFS
      const imageUrl = await uploadToIPFS(file);
      console.log("Image uploaded:", imageUrl);
      
      // Create metadata and upload to IPFS
      const metadataUrl = await createNFTMetadata(name, description, imageUrl);
      console.log("Metadata uploaded:", metadataUrl);
      
      // Mint NFT with metadata URL
      const tx = await mintNFT(metadataUrl);
      console.log("NFT minted:", tx);
      
      setTxHash(tx.hash);
      setSuccess(true);
      
      // Reset form
      setName('');
      setDescription('');
      setFile(null);
      setPreview('');
      
    } catch (error) {
      console.error("Error minting NFT:", error);
      setError('Failed to mint NFT: ' + error.message);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="p-6 bg-gradient-to-b from-black/70 to-blue-900/20 rounded-xl border border-blue-900/30 backdrop-blur-sm shadow-xl">
      <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
        <div className="w-8 h-8 mr-3 bg-blue-600 rounded-lg flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" viewBox="0 0 20 20" fill="currentColor">
            <path d="M11 17a1 1 0 001.447.894l4-2A1 1 0 0017 15V9.236a1 1 0 00-1.447-.894l-4 2a1 1 0 00-.553.894V17zM15.211 6.276a1 1 0 000-1.788l-4.764-2.382a1 1 0 00-.894 0L4.789 4.488a1 1 0 000 1.788l4.764 2.382a1 1 0 00.894 0l4.764-2.382zM4.447 8.342A1 1 0 003 9.236V15a1 1 0 00.553.894l4 2A1 1 0 009 17v-5.764a1 1 0 00-.553-.894l-4-2z" />
          </svg>
        </div>
        Create New NFT
      </h2>
      
      {success ? (
        <div className="bg-blue-900/30 border border-blue-500/40 rounded-lg p-6 text-center">
          <div className="w-16 h-16 mx-auto bg-blue-600/20 rounded-full flex items-center justify-center mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-white mb-2">NFT Created Successfully!</h3>
          <p className="text-blue-300 mb-4">Your creation has been minted and added to the blockchain.</p>
          <div className="bg-black/40 rounded-lg p-3 font-mono text-sm text-gray-400 mb-4 overflow-x-auto">
            <span className="text-blue-400">TX:</span> {txHash}
          </div>
          <button 
            onClick={() => setSuccess(false)} 
            className="px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-700 rounded-lg text-white font-medium hover:from-blue-600 hover:to-blue-800 transition-all duration-300 shadow-lg shadow-blue-500/20"
          >
            Create Another NFT
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-1">
                  NFT Name
                </label>
                <input
                  type="text"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-3 bg-black/30 border border-blue-900/50 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="My Awesome NFT"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-300 mb-1">
                  Description
                </label>
                <textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows="4"
                  className="w-full px-4 py-3 bg-black/30 border border-blue-900/50 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="Describe your amazing creation..."
                  required
                />
              </div>
              
              <div>
                <label htmlFor="file" className="block text-sm font-medium text-gray-300 mb-1">
                  Upload Image
                </label>
                <div className="relative">
                  <input
                    type="file"
                    id="file"
                    onChange={handleFileChange}
                    className="hidden"
                    accept="image/*"
                    required
                  />
                  <label
                    htmlFor="file"
                    className="w-full flex items-center justify-center px-4 py-3 bg-black/30 border border-blue-900/50 rounded-lg text-gray-300 hover:bg-black/50 hover:border-blue-500/70 cursor-pointer transition-all"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M4 5a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V7a2 2 0 00-2-2h-1.586a1 1 0 01-.707-.293l-1.121-1.121A2 2 0 0011.172 3H8.828a2 2 0 00-1.414.586L6.293 4.707A1 1 0 015.586 5H4zm6 9a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
                    </svg>
                    {file ? file.name : 'Choose File'}
                  </label>
                </div>
              </div>
            </div>
            
            <div className="flex flex-col justify-between h-full">
              <div className="bg-gradient-to-r from-black/60 to-blue-900/20 border border-blue-900/30 rounded-lg p-4 h-full flex items-center justify-center">
                {preview ? (
                  <img src={preview} alt="Preview" className="max-w-full max-h-48 rounded-lg object-contain" />
                ) : (
                  <div className="text-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-blue-900" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <p className="mt-2 text-gray-400">Image preview will appear here</p>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          {error && (
            <div className="bg-red-900/30 border border-red-500/30 rounded-lg p-3 text-red-300 text-sm">
              {error}
            </div>
          )}
          
          <button
            type="submit"
            disabled={loading}
            className="w-full px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-700 rounded-lg text-white font-medium hover:from-blue-600 hover:to-blue-800 transition-all duration-300 shadow-lg shadow-blue-500/20 flex items-center justify-center"
          >
            {loading ? (
              <>
                <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                <span>Processing...</span>
              </>
            ) : (
              <span>Mint NFT</span>
            )}
          </button>
        </form>
      )}
    </div>
  );
}

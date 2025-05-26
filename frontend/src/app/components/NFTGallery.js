"use client";

import { useState, useEffect } from 'react';
import { getAllNFTs } from '../utils/web3';

export default function NFTGallery() {
  const [nfts, setNfts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  useEffect(() => {
    const fetchNFTs = async () => {
      try {
        setLoading(true);
        const allNFTs = await getAllNFTs();
        setNfts(allNFTs);
      } catch (error) {
        console.error("Error fetching NFTs:", error);
        setError('Failed to load NFTs. Please connect your wallet first.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchNFTs();
  }, []);
  
  const fetchMetadata = async (tokenURI) => {
    try {
      const response = await fetch(tokenURI);
      return await response.json();
    } catch (error) {
      console.error("Error fetching metadata:", error);
      return { name: "Unknown", description: "Could not load metadata", image: "" };
    }
  };
  
  const NFTCard = ({ nft }) => {
    const [metadata, setMetadata] = useState(null);
    const [loadingMetadata, setLoadingMetadata] = useState(true);
    
    useEffect(() => {
      const getMetadata = async () => {
        try {
          setLoadingMetadata(true);
          const data = await fetchMetadata(nft.tokenURI);
          setMetadata(data);
        } catch (error) {
          console.error("Error loading metadata:", error);
        } finally {
          setLoadingMetadata(false);
        }
      };
      
      getMetadata();
    }, [nft.tokenURI]);
    
    return (
      <div className="bg-gradient-to-b from-black/70 to-blue-900/20 rounded-xl border border-blue-900/30 backdrop-blur-sm shadow-xl overflow-hidden transition-all duration-300 hover:shadow-blue-500/10 hover:border-blue-500/50">
        <div className="aspect-square w-full relative bg-black/50">
          {loadingMetadata ? (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="animate-spin h-8 w-8 border-2 border-blue-500 border-t-transparent rounded-full"></div>
            </div>
          ) : metadata?.image ? (
            <img 
              src={metadata.image} 
              alt={metadata.name || "NFT"} 
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = "https://via.placeholder.com/400?text=Image+Not+Available";
              }}
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center bg-blue-900/20">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-blue-900/50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          )}
          
          <div className="absolute top-2 right-2 bg-black/70 rounded-full px-2 py-1 text-xs text-blue-400 font-mono">
            #{nft.id}
          </div>
        </div>
        
        <div className="p-4">
          <h3 className="text-lg font-bold text-white truncate mb-1">
            {loadingMetadata ? "Loading..." : (metadata?.name || "Unnamed NFT")}
          </h3>
          
          <p className="text-sm text-gray-400 line-clamp-2 h-10 mb-3">
            {loadingMetadata ? "Loading description..." : (metadata?.description || "No description")}
          </p>
          
          <div className="flex flex-col space-y-2">
            <div className="flex items-center text-xs">
              <span className="text-gray-500 mr-1">Creator:</span>
              <span className="text-blue-400 font-mono truncate">
                {nft.creator.slice(0, 6)}...{nft.creator.slice(-4)}
              </span>
            </div>
            
            <div className="flex items-center text-xs">
              <span className="text-gray-500 mr-1">Owner:</span>
              <span className="text-blue-400 font-mono truncate">
                {nft.owner.slice(0, 6)}...{nft.owner.slice(-4)}
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  };
  
  if (loading) {
    return (
      <div className="p-6 bg-black/40 rounded-xl border border-blue-900/30 min-h-[400px] flex items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="animate-spin h-12 w-12 border-2 border-blue-500 border-t-transparent rounded-full mb-4"></div>
          <p className="text-blue-300">Loading NFT Gallery...</p>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="p-6 bg-black/40 rounded-xl border border-blue-900/30 min-h-[300px] flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto bg-blue-900/20 rounded-full flex items-center justify-center mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-white mb-2">Gallery Unavailable</h3>
          <p className="text-blue-300">{error}</p>
        </div>
      </div>
    );
  }
  
  if (nfts.length === 0) {
    return (
      <div className="p-6 bg-black/40 rounded-xl border border-blue-900/30 min-h-[300px] flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto bg-blue-900/20 rounded-full flex items-center justify-center mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-white mb-2">No NFTs Found</h3>
          <p className="text-blue-300">Be the first to mint an NFT!</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
        <div className="w-8 h-8 mr-3 bg-blue-600 rounded-lg flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" viewBox="0 0 20 20" fill="currentColor">
            <path d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a2 2 0 012-2h12a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4z" />
          </svg>
        </div>
        NFT Gallery <span className="ml-2 text-sm text-blue-400 font-normal">({nfts.length} items)</span>
      </h2>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {nfts.map((nft) => (
          <NFTCard key={nft.id} nft={nft} />
        ))}
      </div>
    </div>
  );
}

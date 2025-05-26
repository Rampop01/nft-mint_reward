"use client";

import { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import MintNFTForm from './components/MintNFTForm';
import NFTGallery from './components/NFTGallery';
import RewardsTracker from './components/RewardsTracker';
import { connectWallet } from './utils/web3';

export default function Home() {
  const [activeTab, setActiveTab] = useState('mint');
  const [isConnected, setIsConnected] = useState(false);
  
  useEffect(() => {
    // Check if wallet is already connected
    const checkConnection = async () => {
      try {
        const { address } = await connectWallet();
        if (address) {
          setIsConnected(true);
        }
      } catch (error) {
        console.error("No wallet connected:", error);
      }
    };
    
    checkConnection();
  }, []);
  
  return (
    <main className="min-h-screen grid-pattern text-white">
      {/* Stars background effect */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        {[...Array(50)].map((_, i) => (
          <div 
            key={i}
            className="absolute rounded-full bg-blue-500"
            style={{
              width: Math.random() * 3 + 'px',
              height: Math.random() * 3 + 'px',
              top: Math.random() * 100 + '%',
              left: Math.random() * 100 + '%',
              opacity: Math.random() * 0.5 + 0.3,
              animation: `twinkle ${Math.random() * 5 + 3}s infinite ${Math.random() * 5}s`
            }}
          />
        ))}
      </div>
      
      {/* Glowing orb effects */}
      <div className="fixed top-1/4 -right-40 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="fixed -bottom-20 -left-20 w-60 h-60 bg-blue-600/5 rounded-full blur-3xl pointer-events-none"></div>
      
      {/* Content */}
      <div className="relative z-10">
        <Navbar />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Hero section */}
          <div className="text-center mb-16">
            <h1 className="text-5xl md:text-6xl font-extrabold mb-4 glow-text bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600 text-transparent bg-clip-text">
              NFT Creator Rewards
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Mint unique NFTs and earn Creator Tokens as rewards. A powerful platform built for artists and collectors.
            </p>
          </div>
          
          {/* Navigation tabs */}
          <div className="flex justify-center mb-10">
            <div className="inline-flex p-1 space-x-1 bg-black/50 backdrop-blur-md rounded-xl">
              <button
                onClick={() => setActiveTab('mint')}
                className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
                  activeTab === 'mint'
                    ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-500/20'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                Mint NFT
              </button>
              <button
                onClick={() => setActiveTab('gallery')}
                className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
                  activeTab === 'gallery'
                    ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-500/20'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                NFT Gallery
              </button>
              <button
                onClick={() => setActiveTab('rewards')}
                className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
                  activeTab === 'rewards'
                    ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-500/20'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                Rewards
              </button>
            </div>
          </div>
          
          {/* Main content */}
          <div className="min-h-[60vh]">
            {!isConnected ? (
              <div className="flex flex-col items-center justify-center h-[50vh] p-8 glass rounded-xl border border-blue-900/30">
                <div className="w-24 h-24 mb-6 rounded-full bg-gradient-to-r from-blue-400 to-blue-700 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h2 className="text-3xl font-bold mb-4 glow-text">Connect Your Wallet</h2>
                <p className="text-center text-gray-300 mb-8 max-w-md">
                  Please connect your wallet to access the NFT platform and start minting or viewing your collection.
                </p>
                <button 
                  onClick={async () => {
                    try {
                      await connectWallet();
                      setIsConnected(true);
                    } catch (error) {
                      console.error("Error connecting wallet:", error);
                    }
                  }}
                  className="px-8 py-4 bg-gradient-to-r from-blue-500 to-blue-700 rounded-lg text-white font-medium hover:from-blue-600 hover:to-blue-800 transition-all duration-300 shadow-lg shadow-blue-500/20 flex items-center"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M17.707 9.293a1 1 0 010 1.414l-7 7a1 1 0 01-1.414 0l-7-7A.997.997 0 012 10V5a3 3 0 013-3h5c.256 0 .512.098.707.293l7 7zM5 6a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                  </svg>
                  Connect Wallet
                </button>
              </div>
            ) : (
              <div>
                {activeTab === 'mint' && <MintNFTForm />}
                {activeTab === 'gallery' && <NFTGallery />}
                {activeTab === 'rewards' && <RewardsTracker />}
              </div>
            )}
          </div>
        </div>
        
        {/* Footer */}
        <footer className="border-t border-blue-900/20 mt-20 py-10 px-4">
          <div className="max-w-7xl mx-auto text-center text-gray-400 text-sm">
            <p className="mb-2">
              NFT Creator Rewards Platform © {new Date().getFullYear()}
            </p>
            <p>
              Built with <span className="text-blue-400">♦</span> for Web3 creators
            </p>
          </div>
        </footer>
      </div>
      
      {/* Animation keyframes */}
      <style jsx>{`
        @keyframes twinkle {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 1; }
        }
      `}</style>
    </main>
  );
}

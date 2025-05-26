"use client";

import { useState, useEffect } from 'react';
import { connectWallet, disconnectWallet } from '../utils/web3';

export default function Navbar() {
  const [address, setAddress] = useState('');
  const [loading, setLoading] = useState(false);
  
  const handleConnect = async () => {
    try {
      setLoading(true);
      const { address } = await connectWallet();
      setAddress(address);
    } catch (error) {
      console.error("Error connecting wallet:", error);
    } finally {
      setLoading(false);
    }
  };
  
  const handleDisconnect = async () => {
    try {
      await disconnectWallet();
      setAddress('');
    } catch (error) {
      console.error("Error disconnecting wallet:", error);
    }
  };

  useEffect(() => {
    // Check if wallet is already connected
    const checkConnection = async () => {
      try {
        const { address } = await connectWallet();
        if (address) {
          setAddress(address);
        }
      } catch (error) {
        console.error("No wallet connected:", error);
      }
    };
    
    checkConnection();
  }, []);
  
  return (
    <nav className="flex justify-between items-center py-4 px-6 backdrop-blur-md bg-black/30 border-b border-blue-900/40">
      <div className="flex items-center space-x-2">
        <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center">
          <span className="text-white font-bold">NFT</span>
        </div>
        <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-blue-600 text-transparent bg-clip-text">
          Creator Rewards
        </h1>
      </div>
      
      <div>
        {!address ? (
          <button 
            onClick={handleConnect}
            disabled={loading}
            className="px-6 py-2 bg-gradient-to-r from-blue-500 to-blue-700 rounded-lg text-white font-medium hover:from-blue-600 hover:to-blue-800 transition-all duration-300 shadow-lg shadow-blue-500/20 flex items-center gap-2"
          >
            {loading ? (
              <>
                <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                <span>Connecting...</span>
              </>
            ) : (
              <span>Connect Wallet</span>
            )}
          </button>
        ) : (
          <div className="flex items-center space-x-4">
            <div className="px-4 py-2 bg-black/50 border border-blue-900/40 rounded-lg">
              <span className="text-sm text-gray-400">Connected:</span>
              <span className="ml-2 text-sm text-blue-400 font-mono">
                {address.slice(0, 6)}...{address.slice(-4)}
              </span>
            </div>
            <button 
              onClick={handleDisconnect}
              className="px-4 py-2 bg-black/50 border border-blue-900/40 rounded-lg text-gray-300 hover:text-white hover:border-blue-500/70 transition-colors"
            >
              Disconnect
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}

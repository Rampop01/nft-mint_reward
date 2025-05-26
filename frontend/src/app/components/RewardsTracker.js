"use client";

import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { getTokenBalance, connectWallet } from '../utils/web3';

export default function RewardsTracker() {
  const [balance, setBalance] = useState('0');
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [eventLoading, setEventLoading] = useState(true);
  const [error, setError] = useState('');
  
  useEffect(() => {
    const fetchBalance = async () => {
      try {
        setLoading(true);
        const bal = await getTokenBalance();
        setBalance(bal);
        setError('');
      } catch (error) {
        console.error("Error fetching token balance:", error);
        setError('Failed to load token balance. Please connect your wallet first.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchBalance();
    
    // Set up an interval to periodically update the balance
    const intervalId = setInterval(fetchBalance, 30000); // every 30 seconds
    
    return () => clearInterval(intervalId);
  }, []);
  
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setEventLoading(true);
        const { contract, provider } = await connectWallet();
        
        // Get NFTMinted events
        const filter = contract.filters.NFTMinted();
        const events = await contract.queryFilter(filter, -3000); // Last 3000 blocks
        
        // Format the events
        const formattedEvents = await Promise.all(events.map(async (event) => {
          const [tokenId, creator, tokenURI] = event.args;
          
          // Get the block timestamp
          const block = await provider.getBlock(event.blockNumber);
          const timestamp = block ? new Date(block.timestamp * 1000) : new Date();
          
          return {
            tokenId: tokenId.toString(),
            creator: creator,
            tokenURI: tokenURI,
            txHash: event.transactionHash,
            timestamp: timestamp,
            blockNumber: event.blockNumber
          };
        }));
        
        // Sort by block number (most recent first)
        formattedEvents.sort((a, b) => b.blockNumber - a.blockNumber);
        
        setEvents(formattedEvents);
      } catch (error) {
        console.error("Error fetching events:", error);
      } finally {
        setEventLoading(false);
      }
    };
    
    fetchEvents();
  }, []);
  
  return (
    <div className="space-y-8">
      <div className="p-6 bg-gradient-to-b from-black/70 to-blue-900/20 rounded-xl border border-blue-900/30 backdrop-blur-sm shadow-xl">
        <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
          <div className="w-8 h-8 mr-3 bg-blue-600 rounded-lg flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" viewBox="0 0 20 20" fill="currentColor">
              <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clipRule="evenodd" />
            </svg>
          </div>
          Creator Rewards
        </h2>
        
        {loading ? (
          <div className="flex justify-center items-center h-24">
            <div className="animate-spin h-8 w-8 border-2 border-blue-500 border-t-transparent rounded-full"></div>
          </div>
        ) : error ? (
          <div className="bg-red-900/30 border border-red-500/30 rounded-lg p-4 text-red-300">
            {error}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gradient-to-r from-black/60 to-blue-900/20 border border-blue-900/30 rounded-lg p-6">
              <div className="text-sm text-gray-400 mb-2">Your Token Balance</div>
              <div className="flex items-end">
                <div className="text-3xl font-bold text-white">{parseFloat(balance).toFixed(2)}</div>
                <div className="ml-2 text-lg text-blue-400">CREATOR</div>
              </div>
            </div>
            
            <div className="bg-gradient-to-r from-black/60 to-blue-900/20 border border-blue-900/30 rounded-lg p-6">
              <div className="text-sm text-gray-400 mb-2">Total Rewards Earned</div>
              <div className="flex items-end">
                <div className="text-3xl font-bold text-white">{parseFloat(balance).toFixed(2)}</div>
                <div className="ml-2 text-lg text-blue-400">CREATOR</div>
              </div>
              <div className="mt-2 text-xs text-gray-500">
                Rewards are automatically added to your balance
              </div>
            </div>
          </div>
        )}
      </div>
      
      <div className="p-6 bg-gradient-to-b from-black/70 to-blue-900/20 rounded-xl border border-blue-900/30 backdrop-blur-sm shadow-xl">
        <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
          <div className="w-8 h-8 mr-3 bg-blue-600 rounded-lg flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M6 2a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V7.414A2 2 0 0015.414 6L12 2.586A2 2 0 0010.586 2H6zm2 10a1 1 0 10-2 0v3a1 1 0 102 0v-3zm2-3a1 1 0 011 1v5a1 1 0 11-2 0v-5a1 1 0 011-1zm4-1a1 1 0 10-2 0v7a1 1 0 102 0V8z" clipRule="evenodd" />
            </svg>
          </div>
          Reward Activity
        </h2>
        
        {eventLoading ? (
          <div className="flex justify-center items-center h-40">
            <div className="animate-spin h-8 w-8 border-2 border-blue-500 border-t-transparent rounded-full"></div>
          </div>
        ) : events.length === 0 ? (
          <div className="bg-black/40 rounded-lg p-6 text-center">
            <div className="w-16 h-16 mx-auto bg-blue-900/20 rounded-full flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-white mb-2">No Activity Yet</h3>
            <p className="text-blue-300">Start minting NFTs to earn rewards!</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-blue-900/40">
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-400">Token ID</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-400">Creator</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-400">Date</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-400">Transaction</th>
                </tr>
              </thead>
              <tbody>
                {events.map((event, index) => (
                  <tr key={index} className="border-b border-blue-900/20 hover:bg-blue-900/10">
                    <td className="px-4 py-4 text-white font-mono">#{event.tokenId}</td>
                    <td className="px-4 py-4">
                      <div className="flex items-center">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 flex items-center justify-center mr-2 text-xs font-bold">
                          {event.creator.slice(2, 4)}
                        </div>
                        <span className="text-blue-400 font-mono text-sm">
                          {event.creator.slice(0, 6)}...{event.creator.slice(-4)}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-300">
                      {event.timestamp.toLocaleDateString()} {event.timestamp.toLocaleTimeString()}
                    </td>
                    <td className="px-4 py-4">
                      <a 
                        href={`https://etherscan.io/tx/${event.txHash}`} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-400 hover:text-blue-300 font-mono text-sm flex items-center"
                      >
                        {event.txHash.slice(0, 8)}...{event.txHash.slice(-6)}
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

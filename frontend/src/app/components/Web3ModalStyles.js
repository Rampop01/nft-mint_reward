"use client";

import { useEffect } from 'react';

// This component adds global styles to ensure Web3Modal appears on top of all content
export default function Web3ModalStyles() {
  useEffect(() => {
    // Add global styles to handle z-index issues with Web3Modal
    const style = document.createElement('style');
    style.innerHTML = `
      /* Ensure web3modal appears on top of everything */
      .web3modal-modal-card {
        position: relative !important;
        z-index: 9999 !important;
      }
      
      .web3modal-modal-container {
        z-index: 9999 !important;
      }
      
      .web3modal-provider-container {
        z-index: 9999 !important;
      }
      
      /* Extra protection for any modal backdrop */
      .web3modal-modal-lightbox {
        z-index: 9998 !important;
        background-color: rgba(0, 0, 0, 0.8) !important;
      }
    `;
    document.head.appendChild(style);
    
    return () => {
      document.head.removeChild(style);
    };
  }, []);
  
  return null;
}

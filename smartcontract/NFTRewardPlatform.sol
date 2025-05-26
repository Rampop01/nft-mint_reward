// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract NFTRewardPlatform {
    // === ERC20: CreatorToken ===

    string public name = "CreatorToken";             // Name of the ERC20 token
    string public symbol = "CTKN";                   // Symbol of the token
    uint8 public decimals = 18;                      // Number of decimals
    uint256 public totalSupply;                      // Total tokens minted so far

    mapping(address => uint256) public balances;     // Mapping to store balances of each address
    mapping(address => mapping(address => uint256)) public allowance; // Allowances for transferFrom

    // ERC20 Events
    event Transfer(address indexed from, address indexed to, uint256 value);  // Event for transfers
    event Approval(address indexed owner, address indexed spender, uint256 value); // Event for approvals

    // Transfer tokens to another address
    function transfer(address to, uint256 value) public returns (bool) {
        require(balances[msg.sender] >= value, "Insufficient balance");
        balances[msg.sender] -= value;
        balances[to] += value;
        emit Transfer(msg.sender, to, value);
        return true;
    }

    // Approve spender to spend on your behalf
    function approve(address spender, uint256 value) public returns (bool) {
        allowance[msg.sender][spender] = value;
        emit Approval(msg.sender, spender, value);
        return true;
    }

    // Transfer tokens from another address with allowance
    function transferFrom(address from, address to, uint256 value) public returns (bool) {
        require(balances[from] >= value, "Insufficient balance");
        require(allowance[from][msg.sender] >= value, "Not approved");
        balances[from] -= value;
        balances[to] += value;
        allowance[from][msg.sender] -= value;
        emit Transfer(from, to, value);
        return true;
    }

    // Reward creator with tokens (only internally called)
    function rewardCreator(address to, uint256 amount) internal {
        balances[to] += amount;
        totalSupply += amount;
        emit Transfer(address(0), to, amount); // Minting is from 0x0 address
    }

    // === ERC721: ArtNFT ===

    uint256 public nextTokenId = 1;  // Auto-incrementing token ID

    // Struct to represent an NFT
    struct NFT {
        string tokenURI;     // IPFS or metadata URL
        address owner;       // Current owner of the NFT
        address creator;     // Original creator (minter)
    }

    mapping(uint256 => NFT) public nfts;  // Maps tokenId to NFT struct

    // Event emitted when an NFT is minted
    event NFTMinted(uint256 indexed tokenId, address indexed creator, string tokenURI);

    // Anyone can mint an NFT
    function mintNFT(string memory _tokenURI) public {
        uint256 tokenId = nextTokenId;
        nextTokenId++;

        // Save NFT to mapping
        nfts[tokenId] = NFT({
            tokenURI: _tokenURI,
            owner: msg.sender,
            creator: msg.sender
        });

        emit NFTMinted(tokenId, msg.sender, _tokenURI); // Notify frontend

        // Reward creator with 10 CTKN
        uint256 rewardAmount = 10 * (10 ** uint256(decimals));
        rewardCreator(msg.sender, rewardAmount);
    }

    // === View Functions for Frontend ===

    // Get NFT details by ID
    function getNFT(uint256 tokenId) public view returns (
        string memory tokenURI,
        address owner,
        address creator
    ) {
        NFT memory nft = nfts[tokenId];
        return (nft.tokenURI, nft.owner, nft.creator);
    }

    // Get total NFTs minted so far
    function totalMinted() public view returns (uint256) {
        return nextTokenId - 1;
    }

    // (Optional) Get all NFTs owned by a specific address
    function getNFTsByOwner(address _owner) public view returns (uint256[] memory) {
        uint256 total = totalMinted();
        uint256 count = 0;

        // Count how many NFTs the address owns
        for (uint256 i = 1; i <= total; i++) {
            if (nfts[i].owner == _owner) {
                count++;
            }
        }

        // Build result array
        uint256[] memory result = new uint256[](count);
        uint256 index = 0;
        for (uint256 i = 1; i <= total; i++) {
            if (nfts[i].owner == _owner) {
                result[index] = i;
                index++;
            }
        }
        return result;
    }
}

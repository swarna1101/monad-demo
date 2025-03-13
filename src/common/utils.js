// src/common/utils.js
import { ethers } from 'ethers';
import config from './config';

// Utility function to format timestamps
export function formatTimestamp(timestamp) {
    return new Date(timestamp).toLocaleTimeString();
}

// Utility function to format account addresses (0x123...789)
export function formatAddress(address) {
    if (!address) return '';
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
}

// Utility function to format hexadecimal values to decimal
export function hexToDecimal(hexValue) {
    try {
        return parseInt(hexValue, 16).toLocaleString();
    } catch {
        return "Invalid hex";
    }
}

// Create provider for a given network
export function createProvider(network) {
    if (!config[network] || !config[network].rpcUrl) {
        throw new Error(`Invalid network: ${network}`);
    }

    return new ethers.JsonRpcProvider(config[network].rpcUrl);
}

// Create wallet for a given network and private key
export function createWallet(network, privateKey) {
    if (!privateKey) {
        throw new Error('Private key is required');
    }

    const provider = createProvider(network);
    return new ethers.Wallet(privateKey, provider);
}

// Send a transaction on the specified network
export async function sendTransaction(network, wallet, toAddress, value) {
    try {
        const tx = await wallet.sendTransaction({
            to: toAddress,
            value: ethers.parseEther(value.toString())
        });

        return tx;
    } catch (error) {
        console.error(`Error sending transaction on ${network}:`, error);
        throw error;
    }
}

// Function to monitor when a transaction is included in a block
export async function waitForTransaction(network, txHash, callback) {
    try {
        const provider = createProvider(network);
        const startTime = Date.now();

        const receipt = await provider.waitForTransaction(txHash);
        const endTime = Date.now();
        const duration = endTime - startTime;

        if (callback && typeof callback === 'function') {
            callback({
                txHash,
                receipt,
                duration,
                startTime,
                endTime
            });
        }

        return {
            receipt,
            duration
        };
    } catch (error) {
        console.error(`Error waiting for transaction on ${network}:`, error);
        throw error;
    }
}

// Get the latest block from the specified network
export async function getLatestBlock(network) {
    try {
        const provider = createProvider(network);
        return await provider.getBlock('latest');
    } catch (error) {
        console.error(`Error getting latest block on ${network}:`, error);
        return null;
    }
}

// Get multiple recent blocks from the specified network
export async function getRecentBlocks(network, count = 10) {
    try {
        const provider = createProvider(network);
        const latestBlock = await provider.getBlock('latest');

        if (!latestBlock) return [];

        const blocks = [latestBlock];
        let currentNumber = latestBlock.number;

        // Fetch previous blocks
        for (let i = 1; i < count; i++) {
            if (currentNumber <= 0) break;
            currentNumber--;

            try {
                const block = await provider.getBlock(currentNumber);
                if (block) blocks.push(block);
            } catch (err) {
                console.warn(`Failed to fetch block #${currentNumber}`, err);
            }
        }

        return blocks;
    } catch (error) {
        console.error(`Error getting recent blocks on ${network}:`, error);
        return [];
    }
}

// Copy text to clipboard
export async function copyToClipboard(text) {
    try {
        await navigator.clipboard.writeText(text);
        return true;
    } catch (error) {
        console.error('Failed to copy to clipboard:', error);
        return false;
    }
}
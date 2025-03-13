// src/components/HoleskyBlocks.js
import { ethers } from 'ethers';
import { getLatestBlock, getRecentBlocks, formatTimestamp, hexToDecimal, copyToClipboard } from '../common/utils';
import config from '../common/config';

// Component to manage Holesky blocks display
export default class HoleskyBlocks {
    constructor() {
        this.blocks = [];
        this.selectedBlock = null;
        this.latestBlock = null;
        this.pauseUpdates = false;
        this.expandedView = false;
        this.provider = null;
        this.updateInterval = null;
        this.copyFeedback = null;
        this.copyFeedbackTimeout = null;

        // DOM elements - will be initialized in the init() method
        this.elements = {
            blocksGrid: null,
            blockNumber: null,
            blockTimestamp: null,
            blockHash: null,
            txCount: null,
            gasUsed: null,
            parentHash: null,
            gasLimit: null,
            transactions: null,
            expandedView: null,
            blockStatus: null,
            pauseButton: null,
            detailsButton: null,
            viewButton: null,
            copyHashButton: null
        };
    }

    // Initialize the component
    init() {
        try {
            // Set up provider
            this.provider = new ethers.JsonRpcProvider(config.holesky.rpcUrl);

            // Initialize DOM elements
            this.initDomElements();

            // Set up event listeners
            this.setupEventListeners();

            // Start fetching blocks
            this.startBlockUpdates();

            return true;
        } catch (error) {
            console.error('Failed to initialize HoleskyBlocks:', error);
            return false;
        }
    }

    // Initialize DOM elements
    initDomElements() {
        this.elements = {
            blocksGrid: document.getElementById('holesky-blocks-grid'),
            blockNumber: document.getElementById('holesky-block-number'),
            blockTimestamp: document.getElementById('holesky-block-timestamp'),
            blockHash: document.getElementById('holesky-block-hash'),
            txCount: document.getElementById('holesky-tx-count'),
            gasUsed: document.getElementById('holesky-gas-used'),
            parentHash: document.getElementById('holesky-parent-hash'),
            gasLimit: document.getElementById('holesky-gas-limit'),
            transactions: document.getElementById('holesky-transactions'),
            expandedView: document.getElementById('holesky-expanded-view'),
            blockStatus: document.getElementById('holesky-block-status'),
            pauseButton: document.getElementById('holesky-pause-updates'),
            detailsButton: document.getElementById('holesky-toggle-details'),
            viewButton: document.getElementById('holesky-toggle-view'),
            copyHashButton: document.getElementById('copy-holesky-hash')
        };
    }

    // Set up event listeners
    setupEventListeners() {
        // Pause/resume updates
        this.elements.pauseButton.addEventListener('click', () => {
            this.togglePauseUpdates();
        });

        // Toggle expanded view
        this.elements.detailsButton.addEventListener('click', () => {
            this.toggleExpandedView();
        });

        // Toggle blocks view
        this.elements.viewButton.addEventListener('click', () => {
            this.toggleBlocksView();
        });

        // Copy block hash
        this.elements.copyHashButton.addEventListener('click', () => {
            if (this.selectedBlock || this.latestBlock) {
                const hash = (this.selectedBlock || this.latestBlock).hash;
                this.copyToClipboardWithFeedback(hash);
            }
        });
    }

    // Start fetching block updates
    startBlockUpdates() {
        // Initial fetch
        this.fetchBlocks();

        // Set up interval for updates
        this.updateInterval = setInterval(() => {
            if (!this.pauseUpdates) {
                this.fetchBlocks();
            }
        }, 15000); // Update every 15 seconds (to match Holesky's block time)
    }

    // Fetch latest blocks
    async fetchBlocks() {
        try {
            // Get recent blocks
            const blocks = await getRecentBlocks('holesky', 10);

            if (blocks && blocks.length > 0) {
                this.blocks = blocks;
                this.latestBlock = blocks[0];

                // Update the UI
                this.renderBlocks();
                this.updateBlockDetails();
            }
        } catch (error) {
            console.error('Failed to fetch Holesky blocks:', error);
        }
    }

    // Render blocks in the grid
    renderBlocks() {
        if (!this.elements.blocksGrid) return;

        // Clear existing blocks
        this.elements.blocksGrid.innerHTML = '';

        // Create and append block squares
        this.blocks.forEach((block, index) => {
            const blockElement = this.createBlockSquare(block);
            this.elements.blocksGrid.appendChild(blockElement);
        });
    }

    // Create a single block square
    createBlockSquare(block) {
        const blockDiv = document.createElement('div');
        blockDiv.className = 'block-square holesky-block';

        // Calculate gas percentage
        const gasUsed = block.gasUsed ? Number(block.gasUsed) : 0;
        const gasLimit = block.gasLimit ? Number(block.gasLimit) : 30000000;
        const gasPercentage = Math.min((gasUsed / gasLimit) * 100, 100);

        // Calculate color based on transactions
        const txCount = block.transactions ? block.transactions.length : 0;
        const opacity = Math.min(0.2 + (txCount / 10) * 0.8, 1);

        // Add data attributes
        blockDiv.dataset.blockNumber = block.number.toString();
        blockDiv.dataset.blockHash = block.hash;

        // Add classes if selected
        if (this.selectedBlock && this.selectedBlock.hash === block.hash) {
            blockDiv.classList.add('selected');
        }

        // Create block content
        blockDiv.innerHTML = `
      <div class="block-number">#${block.number.toString()}</div>
      ${this.selectedBlock && this.selectedBlock.hash === block.hash ?
            '<div class="selected-indicator"></div>' : ''}
      <div class="gas-indicator" style="height: ${gasPercentage}%; opacity: ${opacity}"></div>
      <div class="tx-indicator">${txCount}tx</div>
    `;

        // Add click event
        blockDiv.addEventListener('click', () => {
            this.selectBlock(block);
        });

        return blockDiv;
    }

    // Select a block and update UI
    selectBlock(block) {
        this.selectedBlock = block;
        this.pauseUpdates = true;
        this.updatePauseButtonState();
        this.renderBlocks(); // Re-render to update selected state
        this.updateBlockDetails();
        this.updateBlockStatusText();
    }

    // Update block details display
    updateBlockDetails() {
        const block = this.selectedBlock || this.latestBlock;

        if (!block) return;

        // Update basic details
        this.elements.blockNumber.textContent = block.number.toString();
        this.elements.blockTimestamp.textContent = formatTimestamp(block.timestamp * 1000);
        this.elements.blockHash.textContent = block.hash;
        this.elements.txCount.textContent = block.transactions ? block.transactions.length : '0';
        this.elements.gasUsed.textContent = block.gasUsed ? Number(block.gasUsed).toLocaleString() : '0';

        // Update expanded details if expanded view is active
        if (this.expandedView) {
            this.elements.parentHash.textContent = block.parentHash;
            this.elements.gasLimit.textContent = block.gasLimit ? Number(block.gasLimit).toLocaleString() : 'N/A';

            // Update transactions list
            this.updateTransactionsList(block);
        }
    }

    // Update the transactions list
    updateTransactionsList(block) {
        if (!this.elements.transactions) return;

        // Clear existing transactions
        this.elements.transactions.innerHTML = '';

        // Check if there are transactions
        if (!block.transactions || block.transactions.length === 0) {
            this.elements.transactions.innerHTML = '<div class="no-tx">No transactions in this block</div>';
            return;
        }

        // Display up to 5 transactions
        const displayCount = Math.min(block.transactions.length, 5);

        for (let i = 0; i < displayCount; i++) {
            const tx = block.transactions[i];
            const txHash = typeof tx === 'string' ? tx :
                (tx && tx.hash ? tx.hash : 'Unknown format');

            const txElement = document.createElement('div');
            txElement.className = 'tx-item';

            // Format transaction hash for display
            const formattedHash = `${txHash.substring(0, 10)}...${txHash.substring(txHash.length - 8)}`;

            txElement.innerHTML = `
        <span class="tx-index">${i + 1}.</span>
        <span class="tx-hash" title="${txHash}">${formattedHash}</span>
        <button class="tx-copy btn-icon" data-hash="${txHash}">📋</button>
      `;

            // Add click handler for copying
            const copyButton = txElement.querySelector('.tx-copy');
            if (copyButton) {
                copyButton.addEventListener('click', (e) => {
                    e.stopPropagation();
                    const hash = e.target.dataset.hash;
                    this.copyToClipboardWithFeedback(hash);
                });
            }

            this.elements.transactions.appendChild(txElement);
        }

        // Add "more transactions" indicator if needed
        if (block.transactions.length > displayCount) {
            const moreElement = document.createElement('div');
            moreElement.className = 'more-tx';
            moreElement.textContent = `+ ${block.transactions.length - displayCount} more transactions`;
            this.elements.transactions.appendChild(moreElement);
        }
    }

    // Toggle pause/resume updates
    togglePauseUpdates() {
        this.pauseUpdates = !this.pauseUpdates;

        // If resuming, clear selected block
        if (!this.pauseUpdates) {
            this.selectedBlock = null;
            this.renderBlocks();
            this.updateBlockDetails();
        }

        this.updatePauseButtonState();
        this.updateBlockStatusText();
    }

    // Update pause button text and style
    updatePauseButtonState() {
        if (!this.elements.pauseButton) return;

        this.elements.pauseButton.textContent = this.pauseUpdates ? 'Resume Updates' : 'Pause Updates';

        if (this.pauseUpdates) {
            this.elements.pauseButton.classList.add('paused');
        } else {
            this.elements.pauseButton.classList.remove('paused');
        }
    }

    // Update block status text
    updateBlockStatusText() {
        if (!this.elements.blockStatus) return;

        if (this.selectedBlock) {
            this.elements.blockStatus.innerHTML = `
        <span class="status-indicator selected"></span>
        <strong>Viewing block #${this.selectedBlock.number.toString()}</strong>
      `;
        } else {
            if (this.pauseUpdates) {
                this.elements.blockStatus.innerHTML = `
          <span class="status-indicator paused"></span>
          Updates paused
        `;
            } else {
                this.elements.blockStatus.textContent = 'Latest blocks (newest first)';
            }
        }
    }

    // Toggle expanded view
    toggleExpandedView() {
        this.expandedView = !this.expandedView;

        if (this.elements.expandedView) {
            if (this.expandedView) {
                this.elements.expandedView.classList.remove('hidden');
                this.elements.detailsButton.textContent = 'Less Details';
                this.updateBlockDetails(); // Refresh details when expanding
            } else {
                this.elements.expandedView.classList.add('hidden');
                this.elements.detailsButton.textContent = 'More Details';
            }
        }
    }

    // Toggle blocks view (hide/show)
    toggleBlocksView() {
        const blocksView = document.getElementById('holesky-blocks-view');

        if (blocksView) {
            const isHidden = blocksView.classList.toggle('hidden');
            this.elements.viewButton.textContent = isHidden ? 'Show Blocks' : 'Hide Blocks';
        }
    }

    // Copy to clipboard with visual feedback
    async copyToClipboardWithFeedback(text) {
        const result = await copyToClipboard(text);

        // Show feedback
        this.showCopyFeedback(result ? 'Copied!' : 'Failed to copy');
    }

    // Show copy feedback
    showCopyFeedback(message) {
        // Create or update feedback element
        if (!this.copyFeedback) {
            this.copyFeedback = document.createElement('div');
            this.copyFeedback.className = 'copy-feedback';
            document.body.appendChild(this.copyFeedback);
        }

        // Update content and position
        this.copyFeedback.textContent = message;
        this.copyFeedback.classList.add('visible');

        // Position near mouse (simplified)
        this.copyFeedback.style.top = `${window.innerHeight / 2}px`;
        this.copyFeedback.style.left = `${window.innerWidth / 2}px`;

        // Clear previous timeout
        if (this.copyFeedbackTimeout) {
            clearTimeout(this.copyFeedbackTimeout);
        }

        // Hide after 2 seconds
        this.copyFeedbackTimeout = setTimeout(() => {
            this.copyFeedback.classList.remove('visible');
        }, 2000);
    }

    // Clean up when component is destroyed
    destroy() {
        if (this.updateInterval) {
            clearInterval(this.updateInterval);
        }

        if (this.copyFeedbackTimeout) {
            clearTimeout(this.copyFeedbackTimeout);
        }

        if (this.copyFeedback && this.copyFeedback.parentNode) {
            this.copyFeedback.parentNode.removeChild(this.copyFeedback);
        }
    }
}
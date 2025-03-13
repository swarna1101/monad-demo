// src/components/TransactionTest.js
import { ethers } from 'ethers';
import { createWallet, sendTransaction, waitForTransaction, formatTimestamp, copyToClipboard } from '../common/utils';
import config from '../common/config';

export default class TransactionTest {
    constructor(privateKey) {
        this.privateKey = privateKey;
        this.wallets = {
            monad: null,
            holesky: null
        };
        this.txResults = {
            monad: {
                hash: null,
                sentTime: null,
                confirmedTime: null,
                duration: null
            },
            holesky: {
                hash: null,
                sentTime: null,
                confirmedTime: null,
                duration: null
            }
        };
        this.isSending = false;
        this.copyFeedback = null;
        this.copyFeedbackTimeout = null;

        // DOM elements - will be initialized in the init() method
        this.elements = {
            sendButton: null,
            txAmount: null,
            txNetwork: null,
            txResults: null,
            monadTxHash: null,
            monadTxSentTime: null,
            monadTxConfirmedTime: null,
            monadTxDuration: null,
            monadTxLink: null,
            holeskyTxHash: null,
            holeskyTxSentTime: null,
            holeskyTxConfirmedTime: null,
            holeskyTxDuration: null,
            holeskyTxLink: null,
            speedComparison: null,
            speedImprovementValue: null,
            copyMonadTxButton: null,
            copyHoleskyTxButton: null
        };
    }

    // Initialize the component
    async init() {
        try {
            // Initialize wallets
            await this.initWallets();

            // Initialize DOM elements
            this.initDomElements();

            // Set up event listeners
            this.setupEventListeners();

            return true;
        } catch (error) {
            console.error('Failed to initialize TransactionTest:', error);
            return false;
        }
    }

    // Initialize wallets
    async initWallets() {
        try {
            // Create wallets for both networks
            this.wallets.monad = createWallet('monad', this.privateKey);
            this.wallets.holesky = createWallet('holesky', this.privateKey);

            return true;
        } catch (error) {
            console.error('Failed to initialize wallets:', error);
            return false;
        }
    }

    // Initialize DOM elements
    initDomElements() {
        this.elements = {
            sendButton: document.getElementById('send-tx'),
            txAmount: document.getElementById('tx-amount'),
            txNetwork: document.getElementById('tx-network'),
            txResults: document.getElementById('tx-results'),
            monadTxHash: document.getElementById('monad-tx-hash'),
            monadTxSentTime: document.getElementById('monad-tx-sent-time'),
            monadTxConfirmedTime: document.getElementById('monad-tx-confirmed-time'),
            monadTxDuration: document.getElementById('monad-tx-duration'),
            monadTxLink: document.getElementById('monad-tx-link'),
            holeskyTxHash: document.getElementById('holesky-tx-hash'),
            holeskyTxSentTime: document.getElementById('holesky-tx-sent-time'),
            holeskyTxConfirmedTime: document.getElementById('holesky-tx-confirmed-time'),
            holeskyTxDuration: document.getElementById('holesky-tx-duration'),
            holeskyTxLink: document.getElementById('holesky-tx-link'),
            speedComparison: document.getElementById('speed-comparison-result'),
            speedImprovementValue: document.getElementById('speed-improvement-value'),
            copyMonadTxButton: document.getElementById('copy-monad-tx'),
            copyHoleskyTxButton: document.getElementById('copy-holesky-tx')
        };
    }

    // Set up event listeners
    setupEventListeners() {
        // Send transaction button
        this.elements.sendButton.addEventListener('click', () => {
            this.sendTestTransactions();
        });

        // Copy transaction hash buttons
        this.elements.copyMonadTxButton.addEventListener('click', () => {
            if (this.txResults.monad.hash) {
                this.copyToClipboardWithFeedback(this.txResults.monad.hash);
            }
        });

        this.elements.copyHoleskyTxButton.addEventListener('click', () => {
            if (this.txResults.holesky.hash) {
                this.copyToClipboardWithFeedback(this.txResults.holesky.hash);
            }
        });
    }

    // Send test transactions
    async sendTestTransactions() {
        try {
            if (this.isSending) return;
            this.isSending = true;

            // Update UI to indicate sending
            this.updateSendButtonState(true);

            // Get transaction amount
            const amount = parseFloat(this.elements.txAmount.value);
            if (isNaN(amount) || amount <= 0) {
                throw new Error('Invalid transaction amount');
            }

            // Get selected networks
            const network = this.elements.txNetwork.value;

            // Reset previous results
            this.resetTxResults();

            // Show results container
            this.elements.txResults.classList.remove('hidden');

            // Send transactions based on selected network
            if (network === 'both' || network === 'monad') {
                await this.sendMonadTransaction(amount);
            }

            if (network === 'both' || network === 'holesky') {
                await this.sendHoleskyTransaction(amount);
            }

            // Compare speeds if both transactions were sent
            if (network === 'both' && this.txResults.monad.duration && this.txResults.holesky.duration) {
                this.compareTransactionSpeeds();
            }
        } catch (error) {
            console.error('Failed to send test transactions:', error);
            alert(`Transaction failed: ${error.message}`);
        } finally {
            this.isSending = false;
            this.updateSendButtonState(false);
        }
    }

    // Send a transaction on Monad
    async sendMonadTransaction(amount) {
        try {
            // Record sent time
            const sentTime = Date.now();
            this.txResults.monad.sentTime = sentTime;

            // Update UI
            this.elements.monadTxSentTime.textContent = formatTimestamp(sentTime);

            // Send transaction
            const tx = await sendTransaction('monad', this.wallets.monad, await this.wallets.monad.getAddress(), amount);

            // Save hash and update UI
            this.txResults.monad.hash = tx.hash;
            this.elements.monadTxHash.textContent = tx.hash;

            // Update explorer link
            this.elements.monadTxLink.href = `${config.monad.explorerUrl}/tx/${tx.hash}`;

            // Wait for transaction to be confirmed
            await waitForTransaction('monad', tx.hash, (result) => {
                // Update UI with confirmation time
                const confirmedTime = result.endTime;
                const duration = result.duration;

                this.txResults.monad.confirmedTime = confirmedTime;
                this.txResults.monad.duration = duration;

                this.elements.monadTxConfirmedTime.textContent = formatTimestamp(confirmedTime);
                this.elements.monadTxDuration.textContent = `(${(duration / 1000).toFixed(2)}s)`;
                this.elements.monadTxDuration.classList.add('success');
            });

            return true;
        } catch (error) {
            console.error('Failed to send Monad transaction:', error);
            throw error;
        }
    }

    // Send a transaction on Holesky
    async sendHoleskyTransaction(amount) {
        try {
            // Record sent time
            const sentTime = Date.now();
            this.txResults.holesky.sentTime = sentTime;

            // Update UI
            this.elements.holeskyTxSentTime.textContent = formatTimestamp(sentTime);

            // Send transaction
            const tx = await sendTransaction('holesky', this.wallets.holesky, await this.wallets.holesky.getAddress(), amount);

            // Save hash and update UI
            this.txResults.holesky.hash = tx.hash;
            this.elements.holeskyTxHash.textContent = tx.hash;

            // Update explorer link
            this.elements.holeskyTxLink.href = `${config.holesky.explorerUrl}/tx/${tx.hash}`;

            // Wait for transaction to be confirmed
            await waitForTransaction('holesky', tx.hash, (result) => {
                // Update UI with confirmation time
                const confirmedTime = result.endTime;
                const duration = result.duration;

                this.txResults.holesky.confirmedTime = confirmedTime;
                this.txResults.holesky.duration = duration;

                this.elements.holeskyTxConfirmedTime.textContent = formatTimestamp(confirmedTime);
                this.elements.holeskyTxDuration.textContent = `(${(duration / 1000).toFixed(2)}s)`;
                this.elements.holeskyTxDuration.classList.add('success');
            });

            return true;
        } catch (error) {
            console.error('Failed to send Holesky transaction:', error);
            throw error;
        }
    }

    // Compare transaction speeds
    compareTransactionSpeeds() {
        const monadDuration = this.txResults.monad.duration;
        const holeskyDuration = this.txResults.holesky.duration;

        if (!monadDuration || !holeskyDuration) return;

        // Calculate speed improvement
        const speedImprovement = holeskyDuration / monadDuration;

        // Update UI
        this.elements.speedComparison.classList.remove('hidden');
        this.elements.speedImprovementValue.textContent = `${speedImprovement.toFixed(1)}x faster`;

        // Highlight based on improvement
        if (speedImprovement >= 10) {
            this.elements.speedImprovementValue.classList.add('dramatic-improvement');
        } else if (speedImprovement >= 5) {
            this.elements.speedImprovementValue.classList.add('major-improvement');
        } else {
            this.elements.speedImprovementValue.classList.add('improvement');
        }
    }

    // Reset transaction results
    resetTxResults() {
        // Reset Monad results
        this.txResults.monad = {
            hash: null,
            sentTime: null,
            confirmedTime: null,
            duration: null
        };

        this.elements.monadTxHash.textContent = '';
        this.elements.monadTxSentTime.textContent = '';
        this.elements.monadTxConfirmedTime.textContent = '';
        this.elements.monadTxDuration.textContent = '';
        this.elements.monadTxDuration.className = 'duration';
        this.elements.monadTxLink.href = '#';

        // Reset Holesky results
        this.txResults.holesky = {
            hash: null,
            sentTime: null,
            confirmedTime: null,
            duration: null
        };

        this.elements.holeskyTxHash.textContent = '';
        this.elements.holeskyTxSentTime.textContent = '';
        this.elements.holeskyTxConfirmedTime.textContent = '';
        this.elements.holeskyTxDuration.textContent = '';
        this.elements.holeskyTxDuration.className = 'duration';
        this.elements.holeskyTxLink.href = '#';

        // Reset speed comparison
        this.elements.speedComparison.classList.add('hidden');
        this.elements.speedImprovementValue.textContent = '';
        this.elements.speedImprovementValue.className = '';
    }

    // Update send button state
    updateSendButtonState(isSending) {
        if (!this.elements.sendButton) return;

        if (isSending) {
            this.elements.sendButton.disabled = true;
            this.elements.sendButton.textContent = 'Sending...';
            this.elements.sendButton.classList.add('loading');
        } else {
            this.elements.sendButton.disabled = false;
            this.elements.sendButton.textContent = 'Send Test Transaction';
            this.elements.sendButton.classList.remove('loading');
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

    // Update wallet information in the UI
    async updateWalletInfo() {
        try {
            // Get wallet addresses
            const monadAddress = await this.wallets.monad.getAddress();
            const holeskyAddress = await this.wallets.holesky.getAddress();

            // Update address display
            const addressElement = document.getElementById('wallet-address');
            if (addressElement) {
                addressElement.textContent = monadAddress;
            }

            // Get balances
            const monadBalance = await this.wallets.monad.provider.getBalance(monadAddress);
            const holeskyBalance = await this.wallets.holesky.provider.getBalance(holeskyAddress);

            // Update balance displays
            const monadBalanceElement = document.getElementById('monad-balance');
            if (monadBalanceElement) {
                monadBalanceElement.textContent = `${ethers.formatEther(monadBalance)} ${config.monad.currencySymbol}`;
            }

            const holeskyBalanceElement = document.getElementById('holesky-balance');
            if (holeskyBalanceElement) {
                holeskyBalanceElement.textContent = `${ethers.formatEther(holeskyBalance)} ${config.holesky.currencySymbol}`;
            }

            return true;
        } catch (error) {
            console.error('Failed to update wallet info:', error);
            return false;
        }
    }

    // Clean up when component is destroyed
    destroy() {
        if (this.copyFeedbackTimeout) {
            clearTimeout(this.copyFeedbackTimeout);
        }

        if (this.copyFeedback && this.copyFeedback.parentNode) {
            this.copyFeedback.parentNode.removeChild(this.copyFeedback);
        }
    }
}
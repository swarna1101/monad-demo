// src/demo/demo.js
import { createMonadIconSvg, createHoleskyIconSvg } from '../assets/svg/IconSvg';
import BlockComparison from '../components/BlockComparison';
import TransactionTest from '../components/TransactionTest';

class MonadSpeedDemo {
    constructor() {
        this.privateKey = null;
        this.blockComparison = null;
        this.transactionTest = null;
        this.theme = localStorage.getItem('theme') || 'light';

        // DOM elements
        this.elements = {
            privateKeyContainer: null,
            privateKeyInput: null,
            privateKeySubmit: null,
            mainContent: null,
            copyAddress: null,
            themeToggleBtn: null
        };
    }

    // Initialize the application
    async init() {
        try {
            // Initialize DOM elements
            this.initDomElements();

            // Set up event listeners
            this.setupEventListeners();

            // Apply saved theme
            this.applyTheme(this.theme);

            // Create network indicators
            this.createNetworkIndicators();

            return true;
        } catch (error) {
            console.error('Failed to initialize MonadSpeedDemo:', error);
            return false;
        }
    }

    // Initialize DOM elements
    initDomElements() {
        this.elements = {
            privateKeyContainer: document.getElementById('private-key-container'),
            privateKeyInput: document.getElementById('private-key-input'),
            privateKeySubmit: document.getElementById('private-key-submit'),
            mainContent: document.getElementById('main-content'),
            copyAddress: document.getElementById('copy-address'),
            themeToggleBtn: document.getElementById('theme-toggle-btn')
        };
    }

    // Set up event listeners
    setupEventListeners() {
        // Private key submit
        this.elements.privateKeySubmit.addEventListener('click', () => {
            this.submitPrivateKey();
        });

        // Enter key in input field
        this.elements.privateKeyInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.submitPrivateKey();
            }
        });

        // Copy address button
        this.elements.copyAddress.addEventListener('click', () => {
            const addressElement = document.getElementById('wallet-address');
            if (addressElement) {
                this.copyToClipboard(addressElement.textContent);
            }
        });

        // Theme toggle
        this.elements.themeToggleBtn.addEventListener('click', () => {
            this.toggleTheme();
        });
    }

    // Submit private key and initialize components
    async submitPrivateKey() {
        try {
            const privateKey = this.elements.privateKeyInput.value.trim();

            if (!privateKey || privateKey.length !== 64) {
                throw new Error('Invalid private key. Please enter a valid 64-character private key.');
            }

            this.privateKey = privateKey;

            // Show loading state
            this.elements.privateKeySubmit.textContent = 'Initializing...';
            this.elements.privateKeySubmit.disabled = true;

            // Initialize components
            await this.initializeComponents();

            // Hide private key container and show main content
            this.elements.privateKeyContainer.classList.add('hidden');
            this.elements.mainContent.classList.remove('hidden');

            // Update wallet information
            await this.transactionTest.updateWalletInfo();

            return true;
        } catch (error) {
            console.error('Failed to submit private key:', error);
            alert(`Error: ${error.message}`);

            // Reset loading state
            this.elements.privateKeySubmit.textContent = 'Start Demo';
            this.elements.privateKeySubmit.disabled = false;

            return false;
        }
    }

    // Initialize components
    async initializeComponents() {
        // Initialize block comparison
        this.blockComparison = new BlockComparison();
        if (!this.blockComparison.init()) {
            throw new Error('Failed to initialize block comparison component');
        }

        // Initialize transaction test
        this.transactionTest = new TransactionTest(this.privateKey);
        if (!await this.transactionTest.init()) {
            throw new Error('Failed to initialize transaction test component');
        }
    }

    // Create network indicators
    createNetworkIndicators() {
        // Create Monad indicators
        const monadIndicators = document.querySelectorAll('.network-indicator.monad');
        monadIndicators.forEach(indicator => {
            // Clear any existing content
            indicator.innerHTML = '';
            // Append SVG
            indicator.appendChild(createMonadIconSvg());
        });

        // Create Holesky indicators
        const holeskyIndicators = document.querySelectorAll('.network-indicator.holesky');
        holeskyIndicators.forEach(indicator => {
            // Clear any existing content
            indicator.innerHTML = '';
            // Append SVG
            indicator.appendChild(createHoleskyIconSvg());
        });
    }

    // Toggle theme
    toggleTheme() {
        const newTheme = this.theme === 'light' ? 'dark' : 'light';
        this.applyTheme(newTheme);
    }

    // Apply theme
    applyTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        this.theme = theme;
        localStorage.setItem('theme', theme);

        // Update theme toggle button
        this.elements.themeToggleBtn.textContent = theme === 'light' ? '🌙' : '☀️';
    }

    // Copy to clipboard
    async copyToClipboard(text) {
        try {
            await navigator.clipboard.writeText(text);

            // Show feedback
            this.showCopyFeedback('Copied!');

            return true;
        } catch (error) {
            console.error('Failed to copy to clipboard:', error);

            // Show error feedback
            this.showCopyFeedback('Failed to copy');

            return false;
        }
    }

    // Show copy feedback
    showCopyFeedback(message) {
        // Create or get feedback element
        let feedbackElement = document.querySelector('.copy-feedback');

        if (!feedbackElement) {
            feedbackElement = document.createElement('div');
            feedbackElement.className = 'copy-feedback';
            document.body.appendChild(feedbackElement);
        }

        // Update content
        feedbackElement.textContent = message;
        feedbackElement.classList.add('visible');

        // Hide after 2 seconds
        setTimeout(() => {
            feedbackElement.classList.remove('visible');
        }, 2000);
    }

    // Clean up when application is destroyed
    destroy() {
        if (this.blockComparison) {
            this.blockComparison.destroy();
        }

        if (this.transactionTest) {
            this.transactionTest.destroy();
        }
    }
}

// Export instance
export default MonadSpeedDemo;
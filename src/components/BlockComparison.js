// src/components/BlockComparison.js
import MonadBlocks from './MonadBlocks';
import HoleskyBlocks from './HoleskyBlocks';
import config from '../common/config';

export default class BlockComparison {
    constructor() {
        this.monadBlocks = null;
        this.holeskyBlocks = null;
        this.showDetails = false;

        // DOM elements - will be initialized in the init() method
        this.elements = {
            toggleDetailsButton: null,
            comparisonDetails: null
        };
    }

    // Initialize the component
    init() {
        try {
            // Initialize DOM elements
            this.initDomElements();

            // Set up event listeners
            this.setupEventListeners();

            // Create and initialize blocks components
            this.monadBlocks = new MonadBlocks();
            this.holeskyBlocks = new HoleskyBlocks();

            this.monadBlocks.init();
            this.holeskyBlocks.init();

            return true;
        } catch (error) {
            console.error('Failed to initialize BlockComparison:', error);
            return false;
        }
    }

    // Initialize DOM elements
    initDomElements() {
        this.elements = {
            toggleDetailsButton: document.getElementById('toggle-details'),
            comparisonDetails: document.getElementById('comparison-details')
        };
    }

    // Set up event listeners
    setupEventListeners() {
        // Toggle details
        if (this.elements.toggleDetailsButton) {
            this.elements.toggleDetailsButton.addEventListener('click', () => {
                this.toggleDetails();
            });
        }
    }

    // Toggle comparison details
    toggleDetails() {
        this.showDetails = !this.showDetails;

        if (this.elements.comparisonDetails) {
            if (this.showDetails) {
                this.elements.comparisonDetails.classList.remove('hidden');
                this.elements.toggleDetailsButton.textContent = 'Hide Details';
            } else {
                this.elements.comparisonDetails.classList.add('hidden');
                this.elements.toggleDetailsButton.textContent = 'Show Details';
            }
        }
    }

    // Update speed comparison info
    updateSpeedComparison(monadDuration, holeskyDuration) {
        if (!monadDuration || !holeskyDuration) return;

        // Calculate speed improvement
        const speedImprovement = holeskyDuration / monadDuration;

        // Update UI with improvement factor
        const speedImprovementElement = document.getElementById('speed-improvement-value');
        if (speedImprovementElement) {
            speedImprovementElement.textContent = `${speedImprovement.toFixed(1)}x faster`;
        }

        // Show speed comparison result
        const speedComparisonResult = document.getElementById('speed-comparison-result');
        if (speedComparisonResult) {
            speedComparisonResult.classList.remove('hidden');
        }
    }

    // Clean up when component is destroyed
    destroy() {
        if (this.monadBlocks) {
            this.monadBlocks.destroy();
        }

        if (this.holeskyBlocks) {
            this.holeskyBlocks.destroy();
        }
    }

    // Static method to create network indicator elements
    static createNetworkIndicators() {
        // Create Monad indicators
        const monadIndicators = document.querySelectorAll('.network-indicator.monad');
        monadIndicators.forEach(indicator => {
            indicator.style.backgroundColor = config.monad.colors.primary;
        });

        // Create Holesky indicators
        const holeskyIndicators = document.querySelectorAll('.network-indicator.holesky');
        holeskyIndicators.forEach(indicator => {
            indicator.style.backgroundColor = config.holesky.colors.primary;
        });
    }
}
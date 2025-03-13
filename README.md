# Monad Speed Demo
An interactive web application that demonstrates the superior transaction speed of Monad blockchain compared to traditional Ethereum testnets.

## Overview
This project provides a real-time visual comparison between Monad Testnet and Holesky (Ethereum Testnet) networks, highlighting Monad's capability to process transactions approximately 15x faster than Ethereum-based networks. The application displays block creation in real-time and allows users to send test transactions to measure confirmation speeds.

## Features

- Live Block Visualization: Watch blocks being generated in real-time on both networks
- Transaction Speed Test: Send test transactions and compare confirmation times
- Block Details: View detailed information about each block
- Network Comparison: Visual indicators showing the speed difference between networks

## Repository Structure

```
monad-speed-demo/
├── package.json                   # Project dependencies and scripts
├── webpack.config.js              # Webpack configuration
├── public/                        # Static files
│   ├── index.html                 # Main HTML file
│   └── style.css                  # CSS styles
├── scripts/
│   └── run-demo.js                # Server startup script
└── src/
    ├── common/                    # Shared utilities
    │   ├── config.js              # Network configurations
    │   └── utils.js               # Utility functions
    ├── components/                # UI components
    │   ├── BlockComparison.js     # Comparison component
    │   ├── MonadBlocks.js         # Monad blocks display
    │   ├── HoleskyBlocks.js       # Holesky blocks display
    │   └── TransactionTest.js     # Transaction testing
    ├── assets/
    │   └── svg/                   # SVG assets
    │       ├── ArrowSvg.js        # Arrow icon
    │       └── IconSvg.js         # Network icons
    └── demo/                      # Main application
        ├── demo.js                # Main app logic
        └── index.js               # Entry point
```

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- NPM or Yarn
- A wallet with test tokens on both networks

### Installation

1. Clone the repo:

```bash
git clone https://github.com/swarna1101/monad-demo.git
cd monad-demo
```

2. Install depedencies:

```bash
npm install
```

3. Start the project:

```bash
npm start
```
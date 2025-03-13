// src/common/config.js

const config = {
    // Monad Testnet configuration
    monad: {
        networkName: "Monad Testnet",
        chainId: 10143,
        rpcUrl: "https://testnet-rpc.monad.xyz/",
        explorerUrl: "https://testnet.monadexplorer.com/",
        currency: "MON",
        currencySymbol: "MON",
        colors: {
            primary: "rgba(131, 110, 249, 1)", // Monad Purple #836EF9
            secondary: "rgba(32, 0, 82, 1)",   // Monad Blue #200052
            background: "rgba(251, 250, 249, 1)" // Monad Off-White #FBFAF9
        },
        blockTime: 1000, // estimated block time in ms (1 second for Monad testnet)
    },

    // Holesky Testnet configuration
    holesky: {
        networkName: "Holesky Testnet",
        chainId: 17000,
        rpcUrl: "https://holesky.drpc.org",
        explorerUrl: "https://holesky.etherscan.io/",
        currency: "ETH",
        currencySymbol: "ETH",
        colors: {
            primary: "#5f9ea0", // Teal color for Holesky
            secondary: "#2F4F4F",
            background: "#f5f5f5"
        },
        blockTime: 15000, // estimated block time in ms (15 seconds for Ethereum testnets)
    }
};

export default config;
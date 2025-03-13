// src/demo/index.js
import MonadSpeedDemo from './demo';

// Wait for DOM to be ready
document.addEventListener('DOMContentLoaded', () => {
    // Create and initialize demo
    const demo = new MonadSpeedDemo();
    demo.init();

    // Store instance in window for debugging
    window.monadDemo = demo;
});
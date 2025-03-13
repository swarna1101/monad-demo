// scripts/run-demo.js
const path = require('path');
const fs = require('fs');
const http = require('http');
const { exec } = require('child_process');

// Configuration
const PORT = process.env.PORT || 3000;
const PUBLIC_DIR = path.join(__dirname, '../public');
const SRC_DIR = path.join(__dirname, '../src');

// Ensure public directory exists
if (!fs.existsSync(PUBLIC_DIR)) {
    fs.mkdirSync(PUBLIC_DIR, { recursive: true });
}

// Copy CSS file to public directory
const cssSource = path.join(__dirname, '../public/style.css');
const cssDestination = path.join(PUBLIC_DIR, 'style.css');

if (fs.existsSync(cssSource)) {
    fs.copyFileSync(cssSource, cssDestination);
    console.log('CSS file copied to public directory');
}

// Simple HTTP server to serve static files
const server = http.createServer((req, res) => {
    // Map URL path to file path
    let filePath = path.join(PUBLIC_DIR, req.url === '/' ? 'index.html' : req.url);

    // If URL doesn't have extension, assume it's a directory and serve index.html
    if (!path.extname(filePath)) {
        filePath = path.join(filePath, 'index.html');
    }

    // Determine content type based on file extension
    const ext = path.extname(filePath).toLowerCase();
    const contentTypes = {
        '.html': 'text/html',
        '.css': 'text/css',
        '.js': 'text/javascript',
        '.json': 'application/json',
        '.png': 'image/png',
        '.jpg': 'image/jpeg',
        '.jpeg': 'image/jpeg',
        '.gif': 'image/gif',
        '.svg': 'image/svg+xml'
    };

    const contentType = contentTypes[ext] || 'text/plain';

    // Read file and send response
    fs.readFile(filePath, (err, content) => {
        if (err) {
            if (err.code === 'ENOENT') {
                // File not found
                fs.readFile(path.join(PUBLIC_DIR, '404.html'), (err, notFoundContent) => {
                    if (err) {
                        // No 404 page
                        res.writeHead(404);
                        res.end('404 - File Not Found');
                    } else {
                        res.writeHead(404, { 'Content-Type': 'text/html' });
                        res.end(notFoundContent);
                    }
                });
            } else {
                // Server error
                res.writeHead(500);
                res.end(`Server Error: ${err.code}`);
            }
        } else {
            // Success
            res.writeHead(200, { 'Content-Type': contentType });
            res.end(content);
        }
    });
});

// Build the project using Webpack before starting the server
console.log('Building the project...');
exec('npx webpack', (error, stdout, stderr) => {
    if (error) {
        console.error(`Build error: ${error}`);
        console.error(stderr);
        process.exit(1);
    }

    console.log(stdout);
    console.log('Build completed successfully');

    // Start the server
    server.listen(PORT, () => {
        console.log(`Server running at http://localhost:${PORT}/`);
        console.log(`Press Ctrl+C to stop the server`);

        // Attempt to open the browser automatically
        let startCommand;

        switch (process.platform) {
            case 'darwin': // macOS
                startCommand = `open http://localhost:${PORT}`;
                break;
            case 'win32': // Windows
                startCommand = `start http://localhost:${PORT}`;
                break;
            default: // Linux and others
                startCommand = `xdg-open http://localhost:${PORT}`;
        }

        exec(startCommand, (err) => {
            if (err) {
                console.log(`Could not open browser automatically. Please visit http://localhost:${PORT} manually.`);
            }
        });
    });
});

// Handle server shutdown
process.on('SIGINT', () => {
    console.log('\nShutting down server...');
    server.close(() => {
        console.log('Server stopped');
        process.exit(0);
    });
});
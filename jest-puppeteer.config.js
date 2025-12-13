module.exports = {
    launch: {
        headless: 'new',
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    },
    server: {
        // Uses http-server for cross-platform compatibility
        command: 'npx http-server -p 8000',
        port: 8000,
        launchTimeout: 30000,
        debug: false
    }
};

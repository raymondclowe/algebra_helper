module.exports = {
    launch: {
        headless: 'new',
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    },
    server: {
        // Uses http-server for cross-platform compatibility
        command: 'npx http-server -p 8000 -s',
        port: 8000,
        launchTimeout: 10000,
        debug: false
    }
};

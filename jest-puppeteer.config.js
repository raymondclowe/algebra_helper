module.exports = {
    launch: {
        headless: 'new',
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    },
    server: {
        command: 'python3 -m http.server 8000',
        port: 8000,
        launchTimeout: 10000,
        debug: false
    }
};

const config = {
    development: {
        apiUrl: 'http://localhost:8080/ToGame-back-1.0-SNAPSHOT/to-game-api',
        debug: true
    },
    production: {
        apiUrl: 'http://localhost:8080/ToGame-back-1.0-SNAPSHOT/to-game-api',
        debug: false
    }
};

const env = process.env.NODE_ENV || 'development';
export default config[env];
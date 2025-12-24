const config = {
    development: {
        apiUrl: 'http://localhost:5173/to-game-api',
        debug: true
    },
    production: {
        apiUrl: 'http://localhost:5173/to-game-api',
        debug: false
    }
};

const env = process.env.NODE_ENV || 'development';
export default config[env];
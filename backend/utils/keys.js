require('dotenv').config();

module.exports = {
    MONGODB_URI: process.env.MONGODB_URI || 'mongodb://localhost:27017/supply-chain',
    JWT_SECRET: process.env.JWT_SECRET || 'your-secret-key',
    JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '30d',
    CORS_ORIGIN: process.env.CORS_ORIGIN || 'http://localhost:5173',
    PORT: process.env.PORT || 5000
};
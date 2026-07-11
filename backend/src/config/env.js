require("dotenv").config();

const env = {
    PORT: process.env.PORT || 5000,
    NODE_ENV: process.env.NODE_ENV || "development",
    MONGODB_URI: process.env.MONGODB_URI || process.env.MONGO_URI || "mongodb://127.0.0.1:27017/car-dealership",
    JWT_SECRET: process.env.JWT_SECRET || "dev-secret",
    JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || "7d"
};

module.exports = env;
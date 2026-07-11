require("dotenv").config();

const env = {
    PORT: process.env.PORT || 5000,

    NODE_ENV: process.env.NODE_ENV || "development",

    MONGODB_URI: process.env.MONGO_URI,

    DATABASE_NAME: process.env.DATABASE_NAME,

    TEST_DATABASE_NAME: process.env.TEST_DATABASE_NAME,

    JWT_SECRET: process.env.JWT_SECRET,

    JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || "7d",
};

const requiredEnvVars = [
    "MONGODB_URI",
    "DATABASE_NAME",
    "TEST_DATABASE_NAME",
    "JWT_SECRET",
];

requiredEnvVars.forEach((key) => {
    if (!env[key]) {
        throw new Error(`Missing required environment variable: ${key}`);
    }
});

module.exports = env;
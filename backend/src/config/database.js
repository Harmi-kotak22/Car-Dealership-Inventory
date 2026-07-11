const mongoose = require("mongoose");
const env = require("./env");

const connectDatabase = async (databaseName) => {
    try {
        await mongoose.connect(env.MONGODB_URI, {
            dbName: databaseName,
        });

        console.log(`✅ MongoDB connected successfully (${databaseName})`);
    } catch (error) {
        console.error("❌ MongoDB connection failed");
        console.error(error.message);

        process.exit(1);
    }
};

module.exports = {
    connectDatabase,
};
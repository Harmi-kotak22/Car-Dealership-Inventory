const mongoose = require("mongoose");
const env = require("./env");

const connectDatabase = async () => {
    try {
        await mongoose.connect(env.MONGODB_URI);

        console.log("✅ MongoDB connected successfully");
    } catch (error) {
        console.error("❌ MongoDB connection failed");
        console.error(error.message);

        process.exit(1);
    }
};

module.exports = { connectDatabase };
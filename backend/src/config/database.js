import { connect } from "mongoose";
import { MONGODB_URI } from "./env";

const connectDatabase = async () => {
    try {
        await connect(MONGODB_URI);

        console.log("✅ MongoDB connected successfully");
    } catch (error) {
        console.error("❌ MongoDB connection failed")
        console.error(error.message);

        process.exit(1);
    }
};

export default { connectDatabase };
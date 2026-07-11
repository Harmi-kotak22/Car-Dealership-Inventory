const mongoose = require("mongoose");

const { connectDatabase } = require("../config/database");
const env = require("../config/env");

beforeAll(async () => {
    await connectDatabase(env.TEST_DATABASE_NAME);
});

beforeEach(async () => {
    const collections = mongoose.connection.collections;

    for (const collection of Object.values(collections)) {
        await collection.deleteMany({});
    }
});

afterAll(async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
});
const app = require("./app");
const env = require("./config/env");
const { connectDatabase } = require("./config/database");
const startServer = async () => {
    await connectDatabase(env.DATABASE_NAME);

    app.listen(env.PORT, () => {
        console.log(`🚀 Server running on port ${env.PORT}`);
    });
};

startServer();
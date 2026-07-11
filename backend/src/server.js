const app = require("./app");
const env = require("./config/env");
const { connectDatabase } = require("./config/database").default;

const startServer = async () => {
    await connectDatabase();

    app.listen(env.PORT, () => {
        console.log(`🚀 Server running on port ${env.PORT}`);
    });
};

startServer();
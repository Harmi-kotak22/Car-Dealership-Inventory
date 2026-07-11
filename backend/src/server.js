const app = require("./app");
const env = require("./config/env").default;
const { connectDatabase } = require("./config/database").default.default;

const startServer = async () => {
    await connectDatabase();

    app.listen(env.PORT, () => {
        console.log(`🚀 Server running on port ${env.PORT}`);
    });
};

startServer();
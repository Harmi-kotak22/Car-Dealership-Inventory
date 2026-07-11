const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const authRoutes = require("./modules/auth/routes/auth.routes");
const vehicleRoutes = require("./modules/vehicle/routes/vehicle.routes");
const testRoutes = require("./tests/testRoutes");

const app = express();

app.use(cors());
app.use(helmet());
app.use(morgan("dev"));

app.use(express.json());

app.get("/health", (req, res) => {
    res.status(200).json({
        success: true,
        message: "Server is running"
    });
});
//app.use("/api/test", testRoutes);

app.use("/api/auth", authRoutes);
app.use("/api/vehicles", vehicleRoutes);
app.use((err, req, res, next) => {
    console.error(err);

    return res.status(err.statusCode || 500).json({
        success: false,
        message: err.message || "Internal Server Error",
    });
});
module.exports = app;
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const authRoutes = require("./modules/auth/routes/auth.routes");
const vehicleRoutes = require("./modules/vehicle/routes/vehicle.routes");
const settingsRoutes = require("./modules/settings/routes/settings.routes");
const testRoutes = require("./tests/testRoutes");
const { ZodError } = require("zod");
const app = express();

const allowedOrigins = [
    "http://localhost:5173",
    process.env.CLIENT_URL,
].filter(Boolean);

app.use(
    cors({
        origin(origin, callback) {
            // allow Postman/mobile apps (no Origin header)
            if (!origin) return callback(null, true);

            if (allowedOrigins.includes(origin)) {
                return callback(null, true);
            }

            callback(new Error("Not allowed by CORS"));
        },
        credentials: true,
    })
);
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
app.use("/api/settings", settingsRoutes);
app.use((err, req, res, next) => {
    if (err instanceof ZodError) {
        return res.status(400).json({
            success: false,
            message: err.errors[0].message,
        });
    }

    console.error(err);

    return res.status(err.statusCode || 500).json({
        success: false,
        message: err.message || "Internal Server Error",
    });
});
module.exports = app;
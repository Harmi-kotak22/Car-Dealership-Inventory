const request = require("supertest");
const app = require("../../app");

/**
 * Registers an admin user and returns a valid JWT.
 */
const createAdminToken = async () => {
    const credentials = {
        name: "Admin",
        email: `admin-${Date.now()}@test.com`,
        password: "Password123",
        role: "ADMIN",
    };

    await request(app)
        .post("/api/auth/register")
        .send(credentials);

    const login = await request(app)
        .post("/api/auth/login")
        .send({
            email: credentials.email,
            password: credentials.password,
        });

    return login.body.data.token;
};

module.exports = {
    createAdminToken,
};
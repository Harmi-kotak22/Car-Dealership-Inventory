const request = require("supertest");
const app = require("../../app");
const User = require("../../modules/user/models/user.model");
const { hashPassword } = require("../../shared/utils/password.utils");

/**
 * Creates an admin user directly in the database and returns a valid JWT.
 */
const createAdminToken = async () => {
    const credentials = {
        name: "Admin",
        email: `admin-${Date.now()}@test.com`,
        password: "Password123",
    };

    await User.create({
        ...credentials,
        password: await hashPassword(credentials.password),
        role: "ADMIN",
    });

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
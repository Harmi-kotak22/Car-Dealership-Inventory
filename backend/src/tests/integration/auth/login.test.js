const request = require("supertest");
const app = require("../../../app");

describe("POST /api/auth/login", () => {
    it("logs in an existing user with valid credentials", async () => {

        const userPayload = {
            name: "Jane Doe",
            email: "jane@example.com",
            password: "Password123"
        };

        // Register user first
        await request(app)
            .post("/api/auth/register")
            .send(userPayload)
            .expect(201);

        // Then login
        const response = await request(app)
            .post("/api/auth/login")
            .send({
                email: userPayload.email,
                password: userPayload.password,
            })
            .expect(200);

        expect(response.body.success).toBe(true);
        expect(response.body.message).toBe("Login successful");

        expect(response.body.data).toHaveProperty("token");
        expect(response.body.data.user.email).toBe(userPayload.email.toLowerCase());
    });
});
const request = require("supertest");
const app = require("../../../app");

describe("POST /api/auth/login", () => {
    it("logs in an existing user with valid credentials", async () => {
        const userPayload = {
            name: "Jane Doe",
            email: "jane@example.com",
            password: "Password123"
        };

        await request(app)
            .post("/api/auth/login")
            .send(userPayload)
            .expect(200);
    });
});

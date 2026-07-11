const request = require("supertest");

const app = require("../../../app");

describe("POST /api/auth/register", () => {
    it("should register a new user successfully", async () => {
        const response = await request(app)
            .post("/api/auth/register")
            .send({
                name: "John Doe",
                email: "john@example.com",
                password: "Password123",
            });

        expect(response.status).toBe(201);

        expect(response.body.success).toBe(true);

        expect(response.body.message).toBe("User registered successfully");

        expect(response.body.data).toHaveProperty("id");

        expect(response.body.data.name).toBe("John Doe");

        expect(response.body.data.email).toBe("john@example.com");

        expect(response.body.data.role).toBe("CUSTOMER");

        expect(response.body.data).not.toHaveProperty("password");
    });
});
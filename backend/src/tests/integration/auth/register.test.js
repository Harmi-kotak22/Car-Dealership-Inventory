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

it("should not register a user with an existing email", async () => {
    const user = {
        name: "John Doe",
        email: "john@example.com",
        password: "Password123",
    };

    await request(app)
        .post("/api/auth/register")
        .send(user);

    const response = await request(app)
        .post("/api/auth/register")
        .send(user);

    expect(response.status).toBe(409);

    expect(response.body.success).toBe(false);

    expect(response.body.message).toBe("Email already exists");
});

it("should return 400 for an invalid email address", async () => {
    const response = await request(app)
        .post("/api/auth/register")
        .send({
            name: "John Doe",
            email: "invalid-email",
            password: "Password123",
        });

    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
    expect(response.body.message).toBe("Validation failed");
});

it("should return 400 when name is missing", async () => {
    const response = await request(app)
        .post("/api/auth/register")
        .send({
            email: "john@example.com",
            password: "Password123",
        });

    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
    expect(response.body.message).toBe("Validation failed");
});

it("should return 400 when password is missing", async () => {
    const response = await request(app)
        .post("/api/auth/register")
        .send({
            name: "John Doe",
            email: "john@example.com",
        });

    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
    expect(response.body.message).toBe("Validation failed");
});

it("should return 400 for a weak password", async () => {
    const response = await request(app)
        .post("/api/auth/register")
        .send({
            name: "John Doe",
            email: "john@example.com",
            password: "password",
        });

    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
    expect(response.body.message).toBe("Validation failed");
});

it("should reject unknown request fields", async () => {
    const response = await request(app)
        .post("/api/auth/register")
        .send({
            name: "John Doe",
            email: "john@example.com",
            password: "Password123",
            salary: 100000,
        });

    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
    expect(response.body.message).toBe("Validation failed");
});

it("should never return the password in the response", async () => {
    const response = await request(app)
        .post("/api/auth/register")
        .send({
            name: "Jane Doe",
            email: "jane@example.com",
            password: "Password123",
        });

    expect(response.status).toBe(201);
    expect(response.body.data).not.toHaveProperty("password");
});
it("should store the email in lowercase", async () => {
    const response = await request(app)
        .post("/api/auth/register")
        .send({
            name: "John Doe",
            email: "John@Example.COM",
            password: "Password123",
        });

    expect(response.status).toBe(201);
    expect(response.body.data.email).toBe("john@example.com");
});
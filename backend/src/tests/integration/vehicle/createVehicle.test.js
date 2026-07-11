const request = require("supertest");
const app = require("../../../app");
const User = require("../../../modules/user/models/user.model");
const { hashPassword } = require("../../../shared/utils/password.utils");
describe("POST /api/vehicles", () => {

    it("should reject unauthenticated requests", async () => {

        const response = await request(app)
            .post("/api/vehicles")
            .send({
                make: "Toyota",
                model: "Corolla",
                category: "SEDAN",
                price: 15000,
                quantity: 5
            });

        expect(response.status).toBe(401);

        expect(response.body.success).toBe(false);

    });

});



describe("POST /api/vehicles", () => {

    it("should allow an ADMIN to create a vehicle", async () => {

        // Register admin
        // Create admin directly in database
        await User.create({
            name: "Admin User",
            email: "admin@test.com",
            password: await hashPassword("Password123"),
            role: "ADMIN",
        });

        // Login
        const loginResponse = await request(app)
            .post("/api/auth/login")
            .send({
                email: "admin@test.com",
                password: "Password123"
            });

        expect(loginResponse.status).toBe(200);

        const token = loginResponse.body.data.token;

        const response = await request(app)
            .post("/api/vehicles")
            .set("Authorization", `Bearer ${token}`)
            .send({
                make: "Toyota",
                model: "Fortuner",
                category: "SUV",
                price: 4200000,
                quantity: 10
            });

        expect(response.status).toBe(201);

        expect(response.body.success).toBe(true);

        expect(response.body.data.make).toBe("Toyota");

        expect(response.body.data.model).toBe("Fortuner");

        expect(response.body.data.category).toBe("SUV");

        expect(response.body.data.price).toBe(4200000);

        expect(response.body.data.quantity).toBe(10);

        expect(response.body.data).toHaveProperty("_id");
    });

});

it("should reject customers from adding vehicles", async () => {

    // TODO after login implementation
});

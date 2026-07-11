const request = require("supertest");
const app = require("../../../app");
const { createAdminToken } = require("../../helpers/auth.helper");

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
        const adminToken = await createAdminToken();

        const response = await request(app)
            .post("/api/vehicles")
            .set("Authorization", `Bearer ${adminToken}`)
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

        expect(response.body.data).toHaveProperty("id");
    });

});
it("should reject a vehicle without make", async () => {

    const adminToken = await createAdminToken();

    const response = await request(app)
        .post("/api/vehicles")
        .set("Authorization", `Bearer ${adminToken}`)
        .send({
            model: "Fortuner",
            category: "SUV",
            price: 100,
            quantity: 5,
        });

    expect(response.status).toBe(400);

    expect(response.body.success).toBe(false);
});
it("should reject invalid vehicle category", async () => {

    const adminToken = await createAdminToken();

    const response = await request(app)
        .post("/api/vehicles")
        .set("Authorization", `Bearer ${adminToken}`)
        .send({
            make: "Toyota",
            model: "Fortuner",
            category: "Bike",
            price: 100,
            quantity: 5,
        });

    expect(response.status).toBe(400);

    expect(response.body.success).toBe(false);
});
it("should reject negative vehicle price", async () => {

    const adminToken = await createAdminToken();

    const response = await request(app)
        .post("/api/vehicles")
        .set("Authorization", `Bearer ${adminToken}`)
        .send({
            make: "Toyota",
            model: "Fortuner",
            category: "SUV",
            price: -500,
            quantity: 5,
        });

    expect(response.status).toBe(400);

    expect(response.body.success).toBe(false);
});
it("should reject negative quantity", async () => {

    const adminToken = await createAdminToken();

    const response = await request(app)
        .post("/api/vehicles")
        .set("Authorization", `Bearer ${adminToken}`)
        .send({
            make: "Toyota",
            model: "Fortuner",
            category: "SUV",
            price: 200,
            quantity: -2,
        });

    expect(response.status).toBe(400);

    expect(response.body.success).toBe(false);
});
it("should reject unknown request fields", async () => {

    const adminToken = await createAdminToken();

    const response = await request(app)
        .post("/api/vehicles")
        .set("Authorization", `Bearer ${adminToken}`)
        .send({
            make: "Toyota",
            model: "Fortuner",
            category: "SUV",
            price: 200,
            quantity: 5,
            color: "Black",
        });

    expect(response.status).toBe(400);

    expect(response.body.success).toBe(false);
});

it("should reject CUSTOMER users from creating vehicles", async () => {
    const customerPayload = {
        name: "Customer User",
        email: `customer-${Date.now()}@test.com`,
        password: "Password123",
    };

    await request(app)
        .post("/api/auth/register")
        .send(customerPayload);

    const loginResponse = await request(app)
        .post("/api/auth/login")
        .send({
            email: customerPayload.email,
            password: customerPayload.password,
        });

    const token = loginResponse.body.data.token;

    const response = await request(app)
        .post("/api/vehicles")
        .set("Authorization", `Bearer ${token}`)
        .send({
            make: "Toyota",
            model: "Fortuner",
            category: "SUV",
            price: 4200000,
            quantity: 5,
        });

    expect(response.status).toBe(403);
    expect(response.body.success).toBe(false);
});

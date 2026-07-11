const request = require("supertest");
const app = require("../../../app");

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

it("should reject customers from adding vehicles", async () => {

    // TODO after login implementation
});

it("should create vehicle successfully", async () => {

    // TODO after JWT generation
});
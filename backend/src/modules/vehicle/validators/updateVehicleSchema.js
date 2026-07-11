const { z } = require("zod");

/**
 * Validation schema for updating a vehicle.
 *
 * All fields are optional to support partial updates.
 */
const updateVehicleSchema = z
    .object({
        make: z.string().trim().min(1).optional(),

        model: z.string().trim().min(1).optional(),

        category: z
            .enum(["SUV", "SEDAN", "HATCHBACK", "TRUCK", "COUPE"])
            .optional(),

        price: z
            .number()
            .positive("Price must be greater than zero")
            .optional(),

        quantity: z
            .number()
            .int()
            .min(0, "Quantity cannot be negative")
            .optional(),
    })
    .strict();

module.exports = updateVehicleSchema;
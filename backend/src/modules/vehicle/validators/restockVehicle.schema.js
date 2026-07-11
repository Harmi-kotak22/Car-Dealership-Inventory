const { z } = require("zod");

/**
 * Validates the payload used to restock a vehicle.
 */
const restockVehicleSchema = z
    .object({
        quantity: z
            .number({
                required_error: "Quantity is required",
                invalid_type_error: "Quantity must be a number",
            })
            .int("Quantity must be an integer")
            .positive("Quantity must be greater than zero"),
    })
    .strict();

module.exports = restockVehicleSchema;
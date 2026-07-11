
/**
 * Validates vehicle payload and delegates persistence
 * to the repository layer.
 */
const { ZodError } = require("zod");

const createVehicleSchema = require("../validators/createVehicle.validator");
const vehicleRepository = require("../repositories/vehicle.repository");
const { findAllVehicles } = require("../repositories/vehicle.repository");
const mongoose = require("mongoose");
const ApiError = require("../../../shared/errors/ApiError");
/**
 * Creates a new vehicle after validating the request payload.
 */
const createVehicle = async (payload) => {
    try {
        const validatedVehicle = createVehicleSchema.parse(payload);

        const vehicle = await vehicleRepository.create(validatedVehicle);

        return vehicle;
    } catch (error) {
        if (error instanceof ZodError) {
            error.statusCode = 400;
        }

        throw error;
    }
};

/**
 * Purchases a vehicle by decreasing its inventory quantity.
 *
 * Business Rules:
 * - Vehicle must exist.
 * - Vehicle must have available stock.
 */

const purchaseVehicle = async (vehicleId) => {
    if (!mongoose.Types.ObjectId.isValid(vehicleId)) {
        throw new ApiError(400, "Invalid vehicle id");
    }

    const vehicle = await vehicleRepository.findVehicleById(vehicleId);

    if (!vehicle) {
        throw new ApiError(404, "Vehicle not found");
    }

    if (vehicle.quantity <= 0) {
        throw new ApiError(400, "Vehicle is out of stock");
    }

    vehicle.quantity -= 1;
    await vehicle.save();

    return vehicle;
};

/**
 * Retrieves all vehicles from inventory.
 */
const getAllVehicles = async () => {
    return await findAllVehicles();
};
/**
 * Searches vehicles using optional filters.
 *
 * @param {Object} filters
 * @returns {Promise<Array>}
 */
const searchVehicles = async (filters) => {

    const query = {};

    if (filters.make) {
        query.make = {
        $regex: filters.make,
        $options: "i",
    };
    }

    if (filters.model) {
         query.model = {
        $regex: filters.model,
        $options: "i",
    };
    }

    if (filters.category) {
        query.category = filters.category;
    }

    if (filters.minPrice || filters.maxPrice) {

        query.price = {};

        if (filters.minPrice) {
            query.price.$gte = Number(filters.minPrice);
        }

        if (filters.maxPrice) {
            query.price.$lte = Number(filters.maxPrice);
        }
    }

    return vehicleRepository.searchVehicles(query);
};
/**
 * Updates an existing vehicle.
 */
const updateVehicle = async (vehicleId, updates) => {

    // Reject malformed MongoDB ids.
    if (!mongoose.Types.ObjectId.isValid(vehicleId)) {
        throw new ApiError(400, "Invalid vehicle id");
    }

    const vehicle = await vehicleRepository.updateVehicle(
        vehicleId,
        updates
    );

    if (!vehicle) {
        throw new ApiError(404, "Vehicle not found");
    }

    return vehicle;
};
/**
 * Deletes an existing vehicle.
 *
 * Ensures that:
 * - the identifier is valid
 * - the vehicle exists
 */
const deleteVehicle = async (vehicleId) => {

    // Reject malformed MongoDB ObjectIds before querying the database.
    if (!mongoose.Types.ObjectId.isValid(vehicleId)) {
        throw new ApiError(400, "Invalid vehicle id");
    }

    const deletedVehicle =
        await vehicleRepository.deleteVehicle(vehicleId);

    if (!deletedVehicle) {
        throw new ApiError(404, "Vehicle not found");
    }

    return;
};
/**
 * Restocks a vehicle by increasing its inventory quantity.
 *
 * Business Rules:
 * - Vehicle must exist.
 */
const restockVehicle = async (vehicleId, quantity) => {

    const vehicle = await vehicleRepository.findVehicleById(vehicleId);

    if (!vehicle) {
        throw new ApiError(404, "Vehicle not found");
    }

    vehicle.quantity += quantity;

    return vehicleRepository.saveVehicle(vehicle);

};

module.exports = {
    createVehicle,
    getAllVehicles,
    searchVehicles,
    purchaseVehicle,
    updateVehicle,
    deleteVehicle,
    restockVehicle,
};

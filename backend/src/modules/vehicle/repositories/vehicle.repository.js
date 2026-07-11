const Vehicle = require("../models/vehicle.model");

/**
 * Persists a new vehicle in MongoDB.
 */
const create = async (vehicleData) => {
    return Vehicle.create(vehicleData);
};

/**
 * Returns all vehicles ordered by newest first.
 */
const findAllVehicles = async () => {
    return Vehicle.find().sort({ createdAt: -1 });
};


module.exports = {
    create,
    findAllVehicles,
};
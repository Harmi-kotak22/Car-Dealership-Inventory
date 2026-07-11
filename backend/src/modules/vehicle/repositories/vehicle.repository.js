const Vehicle = require("../models/vehicle.model");

/**
 * Persists a new vehicle in MongoDB.
 */
const create = async (vehicleData) => {
    return Vehicle.create(vehicleData);
};

module.exports = {
    create,
};
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

const searchVehicles = (filters) => {
    return Vehicle.find(filters)
        .sort({ createdAt: -1 });
};

/**
 * Finds a vehicle by its id.
 *
 * @param {string} id
 * @returns {Promise<Vehicle|null>}
 */
const findVehicleById = async (vehicleId) => {
    return Vehicle.findById(vehicleId);
};

/**
 * Updates a vehicle by its identifier.
 */
const updateVehicle = async (vehicleId, updates) => {
    return Vehicle.findByIdAndUpdate(
        vehicleId,
        updates,
        {
            new: true,
            runValidators: true,
        }
    );
};
/**
 * Deletes a vehicle by its identifier.
 *
 * @param {string} vehicleId - Vehicle identifier.
 * @returns {Promise<Object|null>}
 */
const deleteVehicle = async (vehicleId) => {
    return Vehicle.findByIdAndDelete(vehicleId);
};


/**
 * Persists changes made to a vehicle.
 *
 * @param {Vehicle} vehicle
 * @returns {Promise<Vehicle>}
 */
const saveVehicle = (vehicle) => {
    return vehicle.save();
};

module.exports = {
    create,
    findAllVehicles,
    searchVehicles,
    findVehicleById,
    updateVehicle,
    deleteVehicle,
      findVehicleById,
    saveVehicle,
};


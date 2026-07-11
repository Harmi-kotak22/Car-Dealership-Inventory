/**
 * Converts a Vehicle document into a response DTO.
 * This prevents leaking internal persistence details and
 * provides a stable API contract.
 */
const toVehicleDto = (vehicle) => ({
    id: vehicle._id.toString(),
    make: vehicle.make,
    model: vehicle.model,
    category: vehicle.category,
    price: vehicle.price,
    quantity: vehicle.quantity,
    createdAt: vehicle.createdAt,
    updatedAt: vehicle.updatedAt,
});

module.exports = {
    toVehicleDto,
};
/**
 * Temporary controller implementation.
 *
 * The current TDD goal is only to verify authentication and authorization.
 * Actual vehicle creation logic will be implemented in the next GREEN cycle.
 */
const createVehicle = async (req, res) => {
    return res.status(501).json({
        success: false,
        message: "Not implemented yet",
    });
};

module.exports = {
    createVehicle,
};
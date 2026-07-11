const express = require("express");

const authenticate = require("../../../shared/middleware/authenticate.middleware");
const authorize = require("../../../shared/middleware/authorize.middleware");
const validate = require("../../../shared/middleware/validate.middleware");
const updateVehicleSchema = require("../validators/updateVehicleSchema");
const createVehicleSchema = require("../validators/createVehicle.validator");
const vehicleController = require("../controllers/vehicle.controller");
const restockVehicleSchema = require("../validators/restockVehicle.schema");
const router = express.Router();

/**
 * Only administrators can add new vehicles.
 * The request body is validated before reaching the controller.
 */
router.post(
    "/",
    authenticate,
    authorize("ADMIN"),
    validate(createVehicleSchema),
    vehicleController.createVehicle
);
router.get(
    "/search",
    authenticate,
    vehicleController.searchVehicles
);
router.get(
    "/",
    authenticate,
    vehicleController.getAllVehicles
);
router.post(
    "/:id/purchase",
    authenticate,
    authorize("CUSTOMER"),
    vehicleController.purchaseVehicle
);
router.put(
    "/:id",
    authenticate,
    authorize("ADMIN"),
    validate(updateVehicleSchema),
    vehicleController.updateVehicle
);
router.delete(
    "/:id",
    authenticate,
    authorize("ADMIN"),
    vehicleController.deleteVehicle
);
/**
 * Only administrators can restock inventory.
 */
router.post(
    "/:id/restock",
    authenticate,
    authorize("ADMIN"),
    validate(restockVehicleSchema),
    vehicleController.restockVehicle
);
module.exports = router;
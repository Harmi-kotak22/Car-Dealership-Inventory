class VehicleController {
  getVehicles(req, res) {
    res.status(200).json({ message: 'Vehicle routes ready' });
  }
}

module.exports = new VehicleController();

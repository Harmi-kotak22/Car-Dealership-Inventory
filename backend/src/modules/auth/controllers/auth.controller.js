class AuthController {
  register(req, res) {
    res.status(200).json({ message: 'Register route ready' });
  }

  login(req, res) {
    res.status(200).json({ message: 'Login route ready' });
  }
}

module.exports = new AuthController();

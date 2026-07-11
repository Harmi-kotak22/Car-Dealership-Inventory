const express = require('express');
const router = express.Router();

router.post('/register', (req, res) => {
  res.status(200).json({ message: 'Register route ready' });
});

router.post('/login', (req, res) => {
  res.status(200).json({ message: 'Login route ready' });
});

module.exports = router;

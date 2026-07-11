const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const dotenv = require('dotenv');

const authRoutes = require('./modules/auth/auth.routes');
const vehicleRoutes = require('./modules/vehicle/vehicle.routes');
const { errorMiddleware, notFoundMiddleware } = require('./modules/middleware/error.middleware');

dotenv.config();

const app = express();

app.use(cors());
app.use(helmet());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

app.use('/api/auth', authRoutes);
app.use('/api/vehicles', vehicleRoutes);

app.use(notFoundMiddleware);
app.use(errorMiddleware);

module.exports = app;

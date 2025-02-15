const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const { CORS_ORIGIN } = require('./utils/keys.js');
const { errorHandler } = require('./middlewares/errorHandler.js');

const app = express();

// Import routes
const companyRoutes = require('./routes/company.routes.js');
const productRoutes = require('./routes/product.routes.js');
const inventoryRoutes = require('./routes/inventory.routes.js');
const orderRoutes = require('./routes/order.routes.js');
const forecastRoutes = require('./routes/forecast.routes.js');

// Middleware
app.use(cors({
    origin: CORS_ORIGIN,
    credentials: true
}));
app.use(cookieParser());
app.use(express.json({ limit: '50kb' }));
app.use(express.urlencoded({ extended: true, limit: '50kb' }));
app.use(morgan('dev'));

// Routes
app.use('/api/companies', companyRoutes);
app.use('/api/products', productRoutes);
app.use('/api/inventory', inventoryRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/forecasts', forecastRoutes);

// Health check
app.get('/health', (req, res) => {
    res.json({ status: 'ok' });
});

// Error handler
app.use(errorHandler);

module.exports = { app };
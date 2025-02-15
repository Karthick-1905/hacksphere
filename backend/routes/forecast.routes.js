const express = require('express');
const router = express.Router();
const { authenticateCompany } = require('../middlewares/auth.middleware.js');
const {
    generateForecast,
    getForecastHistory,
    updateActualDemand,
    getForecastMetrics
} = require('../controllers/forecast.controller.js');

router.use(authenticateCompany);

router.post('/generate', generateForecast);
router.get('/history', getForecastHistory);
router.patch('/actual-demand', updateActualDemand);
router.get('/metrics', getForecastMetrics);

module.exports = router;
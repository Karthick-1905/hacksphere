const Forecast = require('../models/forecast.model.js');
const asyncHandler = require('../utils/asyncHandler.js');
const ApiError = require('../utils/ApiError.js');
const ApiResponse = require('../utils/ApiResponse.js');

const generateForecast = asyncHandler(async (req, res) => {
    const { product_id, date_range } = req.body;
    
    // Here you would integrate with your ML model
    // For now, we'll generate mock forecast data
    const forecastData = {
        company_id: req.company._id,
        product_id,
        date: new Date(),
        predictedDemand: Math.floor(Math.random() * 1000),
        accuracy: 0.94,
        factors: {
            seasonality: 1.2,
            trend: 0.8,
            events: ['Holiday Season']
        }
    };

    const forecast = await Forecast.create(forecastData);

    return res.status(201).json(
        new ApiResponse(201, forecast, "Forecast generated successfully")
    );
});

const getForecastHistory = asyncHandler(async (req, res) => {
    const forecasts = await Forecast.find({ 
        company_id: req.company._id 
    })
    .sort({ date: -1 })
    .limit(30);

    return res.json(
        new ApiResponse(200, forecasts, "Forecast history retrieved successfully")
    );
});

const updateActualDemand = asyncHandler(async (req, res) => {
    const { forecast_id, actualDemand } = req.body;

    const forecast = await Forecast.findOneAndUpdate(
        { _id: forecast_id, company_id: req.company._id },
        { 
            actualDemand,
            accuracy: calculateAccuracy(actualDemand, forecast.predictedDemand)
        },
        { new: true }
    );

    if (!forecast) {
        throw new ApiError(404, "Forecast not found");
    }

    return res.json(
        new ApiResponse(200, forecast, "Actual demand updated successfully")
    );
});

const getForecastMetrics = asyncHandler(async (req, res) => {
    const metrics = await Forecast.aggregate([
        { $match: { company_id: req.company._id } },
        { $group: {
            _id: null,
            avgAccuracy: { $avg: "$accuracy" },
            totalForecasts: { $sum: 1 },
            avgDemand: { $avg: "$predictedDemand" }
        }}
    ]);

    return res.json(
        new ApiResponse(200, metrics[0], "Forecast metrics retrieved successfully")
    );
});

module.exports = {
    generateForecast,
    getForecastHistory,
    updateActualDemand,
    getForecastMetrics
};
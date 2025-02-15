const RetailCenter = require('../models/retailCenter.model.js');
const Inventory = require('../models/inventory.model.js');
const asyncHandler = require('../utils/asyncHandler.js');
const ApiError = require('../utils/ApiError.js');
const ApiResponse = require('../utils/ApiResponse.js');

const createRetailCenter = asyncHandler(async (req, res) => {
    const retailCenter = await RetailCenter.create({
        ...req.body,
        company_id: req.company._id
    });

    return res.status(201).json(
        new ApiResponse(201, retailCenter, "Retail center created successfully")
    );
});

const getRetailCenters = asyncHandler(async (req, res) => {
    const retailCenters = await RetailCenter.find({ 
        company_id: req.company._id,
        isActive: true
    });

    return res.json(
        new ApiResponse(200, retailCenters, "Retail centers retrieved successfully")
    );
});

const updateRetailCenter = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const retailCenter = await RetailCenter.findOneAndUpdate(
        { _id: id, company_id: req.company._id },
        req.body,
        { new: true }
    );

    if (!retailCenter) {
        throw new ApiError(404, "Retail center not found");
    }

    return res.json(
        new ApiResponse(200, retailCenter, "Retail center updated successfully")
    );
});

const getInventoryLevels = asyncHandler(async (req, res) => {
    const { center_id } = req.params;
    
    const inventory = await Inventory.find({
        company_id: req.company._id,
        retail_center_id: center_id
    }).populate('product_id');

    return res.json(
        new ApiResponse(200, inventory, "Inventory levels retrieved successfully")
    );
});

const updateInventoryLevel = asyncHandler(async (req, res) => {
    const { center_id, product_id, quantity } = req.body;

    const inventory = await Inventory.findOneAndUpdate(
        { 
            company_id: req.company._id,
            retail_center_id: center_id,
            product_id
        },
        { quantity },
        { new: true }
    );

    if (!inventory) {
        throw new ApiError(404, "Inventory record not found");
    }

    // Update retail center's current stock
    await RetailCenter.findByIdAndUpdate(
        center_id,
        { $inc: { currentStock: quantity } }
    );

    return res.json(
        new ApiResponse(200, inventory, "Inventory level updated successfully")
    );
});

const getInventoryMetrics = asyncHandler(async (req, res) => {
    const metrics = await RetailCenter.aggregate([
        { $match: { company_id: req.company._id } },
        { $group: {
            _id: null,
            totalCapacity: { $sum: "$maxCapacity" },
            totalCurrentStock: { $sum: "$currentStock" },
            avgTurnoverRate: { $avg: "$turnoverRate" }
        }}
    ]);

    return res.json(
        new ApiResponse(200, metrics[0], "Inventory metrics retrieved successfully")
    );
});

module.exports = {
    createRetailCenter,
    getRetailCenters,
    updateRetailCenter,
    getInventoryLevels,
    updateInventoryLevel,
    getInventoryMetrics
};
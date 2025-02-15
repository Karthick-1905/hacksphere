const express = require('express');
const router = express.Router();
const { authenticateCompany } = require('../middlewares/auth.middleware.js');
const {
    createRetailCenter,
    getRetailCenters,
    updateRetailCenter,
    getInventoryLevels,
    updateInventoryLevel,
    getInventoryMetrics
} = require('../controllers/inventory.controller.js');

router.use(authenticateCompany);

// Retail Centers
router.post('/centers', createRetailCenter);
router.get('/centers', getRetailCenters);
router.put('/centers/:id', updateRetailCenter);

// Inventory
router.get('/levels/:center_id', getInventoryLevels);
router.patch('/levels', updateInventoryLevel);
router.get('/metrics', getInventoryMetrics);

module.exports = router;
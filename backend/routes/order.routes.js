const express = require('express');
const router = express.Router();
const { authenticateCompany } = require('../middlewares/auth.middleware.js');
const Order = require('../models/orders.model.js');

// Create order
router.post('/', authenticateCompany, async (req, res) => {
    try {
        const order = await Order.create({
            ...req.body,
            company_id: req.company._id
        });
        res.status(201).json({ order });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Get all orders for company
router.get('/', authenticateCompany, async (req, res) => {
    try {
        const orders = await Order.find({ company_id: req.company._id });
        res.json({ orders });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Update order status
router.patch('/:id/status', authenticateCompany, async (req, res) => {
    try {
        const { status } = req.body;
        const order = await Order.findOneAndUpdate(
            { _id: req.params.id, company_id: req.company._id },
            { status },
            { new: true }
        );
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }
        res.json({ order });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

module.exports = router;
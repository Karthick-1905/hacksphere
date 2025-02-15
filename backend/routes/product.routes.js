const express = require('express');
const router = express.Router();
const { authenticateCompany } = require('../middlewares/auth.middleware.js');
const Product = require('../models/product.model.js');

// Create product
router.post('/', authenticateCompany, async (req, res) => {
    try {
        const product = await Product.create({
            ...req.body,
            company_id: req.company._id
        });
        res.status(201).json({ product });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Get all products for company
router.get('/', authenticateCompany, async (req, res) => {
    try {
        const products = await Product.find({ company_id: req.company._id });
        res.json({ products });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Get single product
router.get('/:id', authenticateCompany, async (req, res) => {
    try {
        const product = await Product.findOne({
            _id: req.params.id,
            company_id: req.company._id
        });
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.json({ product });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Update product
router.put('/:id', authenticateCompany, async (req, res) => {
    try {
        const product = await Product.findOneAndUpdate(
            { _id: req.params.id, company_id: req.company._id },
            req.body,
            { new: true }
        );
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.json({ product });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Delete product
router.delete('/:id', authenticateCompany, async (req, res) => {
    try {
        const product = await Product.findOneAndDelete({
            _id: req.params.id,
            company_id: req.company._id
        });
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.json({ message: 'Product deleted successfully' });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

module.exports = router;
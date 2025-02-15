const mongoose = require('mongoose');
const { Schema } = mongoose;

const RetailCenterSchema = new Schema({
    company_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Company', required: true },
    name: { type: String, required: true },
    location: { type: String, required: true },
    address: { type: String, required: true },
    maxCapacity: { type: Number, required: true },
    currentStock: { type: Number, default: 0 },
    safetyStock: { type: Number, required: true },
    turnoverRate: { type: Number, default: 0 },
    lastRestocked: { type: Date, default: Date.now },
    isActive: { type: Boolean, default: true }
}, { timestamps: true });

const RetailCenter = mongoose.model('RetailCenter', RetailCenterSchema);
module.exports = RetailCenter;
const mongoose = require('mongoose');
const { Schema } = mongoose;

const ProductSchema = new Schema({
    company_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Company', required: true },
    name: { type: String, required: true },
    description: { type: String, required: true },
    category: { type: String, required: true },
    sku: { type: String, required: true, unique: true },
    unit_price: { type: Number, required: true },
    manufacturer: { type: String },
    weight: { type: Number },
    dimensions: {
        length: { type: Number },
        width: { type: Number },
        height: { type: Number }
    },
    is_active: { type: Boolean, default: true },
    image_url: { type: String },
    min_order_quantity: { type: Number, default: 1 },
    tags: [{ type: String }]
}, { timestamps: true });

const Product = mongoose.model('Product', ProductSchema);
module.exports = Product;
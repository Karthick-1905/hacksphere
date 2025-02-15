const mongoose = require('mongoose');
const { Schema } = mongoose;

const InventorySchema = new Schema({
    company_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Company', required: true },
    product_id: { type: String, required: true },
    product_name: { type: String, required: true },
    category: { type: String, required: true },
    quantity: { type: Number, required: true },
    reorder_level: { type: Number, required: true },
    unit_price: { type: Number, required: true },
    supplier_id: { type: String }, // New field
    batch_number: { type: String }, // New field
    expiry_date: { type: Date }, // New field
    last_updated: { type: Date, default: Date.now },
  },{timestamps:true});


const Inventory = mongoose.model('Inventory', InventorySchema);
module.exports = Inventory;
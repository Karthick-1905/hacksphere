const mongoose = require('mongoose');
const { Schema } = mongoose;

const OrdersSchema = new Schema({
    company_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Company', required: true },
    order_date: { type: Date, required: true },
    product_id: { type: String, required: true },
    quantity: { type: Number, required: true },
    total_price: { type: Number, required: true },
    status: { type: String, enum: ['Pending', 'Shipped', 'Delivered'], default: 'Pending' },
    shipping_address: { type: String, required: true },
    payment_method: { type: String, required: true },
    invoice_number: { type: String }, // New field
    discount: { type: Number }, // New field
    tax: { type: Number }, // New field
    shipping_cost: { type: Number }, // New field
  },{timestamps:true});


const Orders = mongoose.model('Orders', OrdersSchema);
module.exports = Orders;
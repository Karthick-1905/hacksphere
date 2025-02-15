const mongoose = require('mongoose');
const { Schema } = mongoose;

const ForecastSchema = new Schema({
    company_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Company', required: true },
    product_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    date: { type: Date, required: true },
    actualDemand: { type: Number },
    predictedDemand: { type: Number, required: true },
    accuracy: { type: Number },
    factors: {
        seasonality: { type: Number },
        trend: { type: Number },
        events: [{ type: String }]
    }
}, { timestamps: true });

const Forecast = mongoose.model('Forecast', ForecastSchema);
module.exports = Forecast;
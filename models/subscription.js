const mongoose = require('mongoose');

const subscriptionSchema = new mongoose.Schema({
    beginningDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    paymentMethod: { type: String, required: true },
    amountPaid: { type: Number, default: 0 },
    customer: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer' },
});

module.exports = subscriptionSchema;
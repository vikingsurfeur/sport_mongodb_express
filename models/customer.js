const mongoose = require('mongoose');

const CustomerSchema = new mongoose.Schema({
    subscriptions: { type: Array, default: [] },
    level: { type: String, default: 'beginner' },
    user: { type: mongoose.Types.ObjectId, ref: 'User' },
});

const Customer = new mongoose.model('Customer', CustomerSchema);

module.exports = Customer;
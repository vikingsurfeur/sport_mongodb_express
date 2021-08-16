const mongoose = require('mongoose');

const CustomerSchema = new mongoose.Schema({
    subscriptions: [
        { type: mongoose.Types.ObjectId, ref: 'Subscription' }
    ],
    level: { type: String, default: 'beginner' },
    user: { type: mongoose.Types.ObjectId, ref: 'User' },
});

const Customer = new mongoose.model('Customer', CustomerSchema);

module.exports = Customer;
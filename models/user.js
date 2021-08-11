const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    firstName: { type: String, required : true },
    lastname: { type: String, required : true },
    dateOfBirth: { type: Date, required : true },
    email: { type: String, required : true },
});

const User = new mongoose.model('User', UserSchema);

module.exports = User;
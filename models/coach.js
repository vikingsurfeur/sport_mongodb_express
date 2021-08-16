const mongoose = require('mongoose');

const CoachSchema = new mongoose.Schema({
    bio: { type: String, default: "No description for this coach" },
    discipline: { type: String, default: 'All Round' },
    user: { type: mongoose.Types.ObjectId, ref: 'User' },
});

const Coach = new mongoose.model('Coach', CoachSchema);

module.exports = Coach;
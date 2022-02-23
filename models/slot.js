const mongoose = require("mongoose");

const SlotSchema = new mongoose.Schema({
    date: { type: Date, require: true },
    startHour: { type: String, require: true },
    endHour: { type: String, require: true },
    label: { type: String, require: true },
    peopleLimit: { type: Number, default: 1 },
    coach: { type: mongoose.Schema.Types.ObjectId, ref: "Coach" },
    customer: [{ type: mongoose.Schema.Types.ObjectId, ref: "Customer" }],
});

const Slot = new mongoose.model("Slot", SlotSchema);

module.exports = Slot;

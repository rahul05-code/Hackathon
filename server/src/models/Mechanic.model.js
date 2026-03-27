const mongoose = require('mongoose');

const mechanicSchema = new mongoose.Schema({
  name:           { type: String, required: true },
  phone:          { type: String },
  specialization: { type: String },
  isActive:       { type: Boolean, default: true }
  name: { type: String, required: true },
  phone: { type: String, required: true },
  skills: [{ type: String }],
  isAvailable: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('Mechanic', mechanicSchema);

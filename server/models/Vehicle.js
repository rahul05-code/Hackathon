const mongoose = require('mongoose');

const vehicleSchema = mongoose.Schema({
  customer: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Customer' },
  make: { type: String, required: true },
  model: { type: String, required: true },
  year: { type: Number, required: true },
  registrationNumber: { type: String, required: true },
}, {
  timestamps: true,
});

const Vehicle = mongoose.model('Vehicle', vehicleSchema);

module.exports = Vehicle;

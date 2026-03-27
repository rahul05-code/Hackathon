const mongoose = require('mongoose');

const vehicleSchema = new mongoose.Schema({
  licensePlate: { type: String, required: true, unique: true, uppercase: true },
  make:         { type: String, required: true },
  model:        { type: String, required: true },
  year:         { type: Number, required: true },
  vin:          { type: String },
  color:        { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Vehicle', vehicleSchema);

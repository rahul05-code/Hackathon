const mongoose = require('mongoose');

const mechanicSchema = mongoose.Schema({
  name: { type: String, required: true },
  specialty: { type: String, required: true },
  phone: { type: String, required: true },
}, {
  timestamps: true,
});

const Mechanic = mongoose.model('Mechanic', mechanicSchema);

module.exports = Mechanic;

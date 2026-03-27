const mongoose = require('mongoose');

const jobCardSchema = mongoose.Schema({
  vehicle: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Vehicle' },
  customer: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Customer' },
  status: { type: String, required: true, default: 'Pending' },
  description: { type: String, required: true },
  estimatedCost: { type: Number, required: true },
}, {
  timestamps: true,
});

const JobCard = mongoose.model('JobCard', jobCardSchema);

module.exports = JobCard;

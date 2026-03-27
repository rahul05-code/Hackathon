const mongoose = require('mongoose');
const { STAGES, SERVICE_TYPES } = require('../utils/constants');

const stageHistorySchema = new mongoose.Schema({
  stage: { type: String, enum: Object.values(STAGES), required: true },
  updatedAt: { type: Date, default: Date.now },
  updatedBy: { type: String }
}, { _id: false });

const jobCardSchema = new mongoose.Schema({
  jobId: { type: String, required: true, unique: true }, // JC-YYYYMMDD gen
  vehicle: { type: mongoose.Schema.Types.ObjectId, ref: 'Vehicle', required: true },
  customer: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer', required: true },
  mechanic: { type: mongoose.Schema.Types.ObjectId, ref: 'Mechanic' },
  serviceType: { type: String, enum: Object.values(SERVICE_TYPES), required: true },
  issueDescription: { type: String, required: true },
  currentStage: { type: String, enum: Object.values(STAGES), default: STAGES.RECEIVED },
  stageHistory: [stageHistorySchema],
  estimatedCost: { type: Number },
  actualCost: { type: Number },
}, { timestamps: true });

module.exports = mongoose.model('JobCard', jobCardSchema);

const mongoose = require('mongoose');

const stageHistorySchema = new mongoose.Schema({
  stage:     { type: String, required: true },
  note:      { type: String, default: '' },
  updatedBy: { type: String, default: 'staff' },
  timestamp: { type: Date, default: Date.now }
}, { _id: false });

const jobCardSchema = new mongoose.Schema({
  jobId:            { type: String, unique: true },
  vehicle:          { type: mongoose.Schema.Types.ObjectId, ref: 'Vehicle', required: true },
  customer:         { type: mongoose.Schema.Types.ObjectId, ref: 'Customer', required: true },
  assignedMechanic: { type: mongoose.Schema.Types.ObjectId, ref: 'Mechanic' },
  serviceType:      { type: String, enum: ['GENERAL_SERVICE','REPAIR','INSPECTION','CUSTOM'], default: 'GENERAL_SERVICE' },
  priority:         { type: String, enum: ['NORMAL','URGENT','EXPRESS'], default: 'NORMAL' },
  status:           { type: String, enum: ['INTAKE','DIAGNOSIS','IN_SERVICE','QC_CHECK','READY','DELIVERED'], default: 'INTAKE' },
  odometer:         { type: Number, required: true },
  reportedIssues:   { type: String, required: true },
  estimatedDate:    { type: Date },
  stageHistory:     [stageHistorySchema],
  billing: {
    labourCharge:  { type: Number, default: 0 },
    parts:         [{ name: String, cost: Number }],
    taxPercent:    { type: Number, default: 18 },
    totalAmount:   { type: Number, default: 0 },
    paymentStatus: { type: String, enum: ['PENDING','PAID'], default: 'PENDING' }
  }
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

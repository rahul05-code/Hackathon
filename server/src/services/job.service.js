const JobCard = require('../models/JobCard.model');
const Customer = require('../models/Customer.model');
const Vehicle = require('../models/Vehicle.model');
const { generateJobId } = require('./jobId.service');
const { STAGES } = require('../utils/constants');

const createJobCard = async (data) => {
  // Find or create customer
  let customer = await Customer.findOne({ phone: data.customerPhone });
  if (!customer) {
    customer = await Customer.create({
      name: data.customerName,
      phone: data.customerPhone,
      email: data.customerEmail || '',
    });
  }

  // Find or create vehicle
  let vehicle = await Vehicle.findOne({ licensePlate: data.licensePlate.toUpperCase() });
  if (!vehicle) {
    vehicle = await Vehicle.create({
      licensePlate: data.licensePlate,
      make: data.vehicleMake,
      model: data.vehicleModel,
      year: data.vehicleYear,
      color: data.vehicleColor || '',
    });
  }

  const jobId = await generateJobId();
  const jobCard = new JobCard({
    jobId,
    vehicle: vehicle._id,
    customer: customer._id,
    serviceType: data.serviceType || 'GENERAL_SERVICE',
    priority: data.priority || 'NORMAL',
    odometer: data.odometer,
    reportedIssues: data.reportedIssues,
    estimatedDate: data.estimatedDate || null,
    status: STAGES.INTAKE,
    stageHistory: [{ stage: STAGES.INTAKE, note: 'Job created', updatedBy: 'system' }],
  });
  const saved = await jobCard.save();
  return await JobCard.findById(saved._id)
    .populate('vehicle')
    .populate('customer')
    .populate('assignedMechanic');
};

const getJobCards = async (query = {}) => {
  const filter = {};

  if (query.status && query.status !== 'ALL') {
    filter.status = query.status;
  }

  if (query.search) {
    const searchRegex = new RegExp(query.search, 'i');
    filter.$or = [
      { jobId: searchRegex },
      { reportedIssues: searchRegex },
    ];
  }

  return await JobCard.find(filter)
    .populate('vehicle')
    .populate('customer')
    .populate('assignedMechanic')
    .sort({ createdAt: -1 });
};

const getJobCardById = async (id) => {
  return await JobCard.findById(id)
    .populate('vehicle')
    .populate('customer')
    .populate('assignedMechanic');
};

const updateJobStage = async (id, stage, note, updatedBy = 'staff') => {
  const job = await JobCard.findById(id);
  if (!job) throw new Error('Job Card not found');

  job.status = stage;
  job.stageHistory.push({ stage, note: note || `Stage updated to ${stage}`, updatedBy });
  const saved = await job.save();
  return await JobCard.findById(saved._id)
    .populate('vehicle')
    .populate('customer')
    .populate('assignedMechanic');
};

const assignMechanic = async (jobId, mechanicId) => {
  const job = await JobCard.findById(jobId);
  if (!job) throw new Error('Job Card not found');

  job.assignedMechanic = mechanicId;
  job.stageHistory.push({
    stage: job.status,
    note: 'Mechanic reassigned',
    updatedBy: 'staff',
  });
  const saved = await job.save();
  return await JobCard.findById(saved._id)
    .populate('vehicle')
    .populate('customer')
    .populate('assignedMechanic');
};

module.exports = { createJobCard, getJobCards, getJobCardById, updateJobStage, assignMechanic };

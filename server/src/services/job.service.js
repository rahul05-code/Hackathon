const JobCard = require('../models/JobCard.model');
const { generateJobId } = require('./jobId.service');
const { STAGES } = require('../utils/constants');

const createJobCard = async (jobData) => {
  const jobId = await generateJobId();
  const jobCard = new JobCard({
    ...jobData,
    jobId,
    stageHistory: [{ stage: STAGES.RECEIVED }]
  });
  return await jobCard.save();
};

const getJobCards = async (filters = {}) => {
  return await JobCard.find(filters).populate('vehicle customer mechanic').sort({ createdAt: -1 });
};

const updateJobStage = async (id, stage, updatedBy) => {
  const job = await JobCard.findById(id);
  if (!job) throw new Error('Job Card not found');
  
  job.currentStage = stage;
  job.stageHistory.push({ stage, updatedBy });
  return await job.save();
};

module.exports = { createJobCard, getJobCards, updateJobStage };

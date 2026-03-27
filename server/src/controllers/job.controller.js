const jobService = require('../services/job.service');
const { validationResult } = require('express-validator');

const createJob = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
    
    const { vehicleId, customerId, ...rest } = req.body;
    const jobData = { vehicle: vehicleId, customer: customerId, ...rest };
    
    const jobCard = await jobService.createJobCard(jobData);
    res.status(201).json({ success: true, data: jobCard });
  } catch (error) { next(error); }
};

const getJobs = async (req, res, next) => {
  try {
    const jobs = await jobService.getJobCards(req.query);
    res.status(200).json({ success: true, data: jobs });
  } catch (error) { next(error); }
};

const updateJobStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { stage, updatedBy } = req.body;
    const updatedJob = await jobService.updateJobStage(id, stage, updatedBy);
    res.status(200).json({ success: true, data: updatedJob });
  } catch (error) { next(error); }
};

module.exports = { createJob, getJobs, updateJobStatus };

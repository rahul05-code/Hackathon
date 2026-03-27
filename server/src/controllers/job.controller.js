const jobService = require('../services/job.service');
const { validationResult } = require('express-validator');

const createJob = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const jobCard = await jobService.createJobCard(req.body);
    res.status(201).json({ success: true, data: jobCard });
  } catch (error) { next(error); }
};

const getJobs = async (req, res, next) => {
  try {
    const jobs = await jobService.getJobCards(req.query);
    res.status(200).json({ success: true, data: jobs });
  } catch (error) { next(error); }
};

const getJobById = async (req, res, next) => {
  try {
    const job = await jobService.getJobCardById(req.params.id);
    if (!job) return res.status(404).json({ success: false, message: 'Job not found' });
    res.status(200).json({ success: true, data: job });
  } catch (error) { next(error); }
};

const updateJobStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { stage, note, updatedBy } = req.body;
    const updatedJob = await jobService.updateJobStage(id, stage, note, updatedBy);
    res.status(200).json({ success: true, data: updatedJob });
  } catch (error) { next(error); }
};

const assignMechanic = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { mechanicId } = req.body;
    const updatedJob = await jobService.assignMechanic(id, mechanicId);
    res.status(200).json({ success: true, data: updatedJob });
  } catch (error) { next(error); }
};

module.exports = { createJob, getJobs, getJobById, updateJobStatus, assignMechanic };

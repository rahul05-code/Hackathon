const asyncHandler = require('express-async-handler');
const JobCard = require('../models/JobCard');
const jobService = require('../services/jobService');

// @desc    Get all jobs
// @route   GET /api/jobs
// @access  Public
const getJobs = asyncHandler(async (req, res) => {
  const jobs = await JobCard.find({});
  res.json(jobs);
});

module.exports = {
  getJobs,
};

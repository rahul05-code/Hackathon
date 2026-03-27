const JobCard = require('../models/JobCard.model');

const generateJobId = async () => {
  const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, ''); // YYYYMMDD
  const latestJob = await JobCard.findOne({ jobId: new RegExp(`^JC-${dateStr}`) }).sort({ createdAt: -1 });
  
  let counter = 1;
  if (latestJob && latestJob.jobId) {
    const lastPart = latestJob.jobId.split('-')[2];
    if (lastPart) counter = parseInt(lastPart, 10) + 1;
  }
  
  const paddedCounter = counter.toString().padStart(4, '0');
  return `JC-${dateStr}-${paddedCounter}`;
};

module.exports = { generateJobId };

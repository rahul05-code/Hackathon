const Mechanic = require('../models/Mechanic.model');
const JobCard = require('../models/JobCard.model');

const getAllMechanics = async () => {
  const mechanics = await Mechanic.find({ isActive: true }).lean();

  // Get active job counts for each mechanic
  const activeStatuses = ['INTAKE', 'DIAGNOSIS', 'IN_SERVICE', 'QC_CHECK'];
  const counts = await JobCard.aggregate([
    { $match: { status: { $in: activeStatuses }, assignedMechanic: { $ne: null } } },
    { $group: { _id: '$assignedMechanic', activeJobs: { $sum: 1 } } },
  ]);

  const countMap = {};
  counts.forEach((c) => { countMap[c._id.toString()] = c.activeJobs; });

  return mechanics.map((m) => ({
    ...m,
    activeJobs: countMap[m._id.toString()] || 0,
  }));
};

const createMechanic = async (data) => {
  return await Mechanic.create(data);
};

module.exports = { getAllMechanics, createMechanic };

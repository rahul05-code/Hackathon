const JobCard = require('../models/JobCard.model');

const getAnalyticsSummary = async () => {
  // KPI totals
  const total = await JobCard.countDocuments();
  const activeStatuses = ['INTAKE', 'DIAGNOSIS', 'IN_SERVICE', 'QC_CHECK'];
  const active = await JobCard.countDocuments({ status: { $in: activeStatuses } });
  const ready = await JobCard.countDocuments({ status: 'READY' });
  const delivered = await JobCard.countDocuments({ status: 'DELIVERED' });

  // Jobs by stage
  const jobsByStage = await JobCard.aggregate([
    { $group: { _id: '$status', count: { $sum: 1 } } },
    { $sort: { _id: 1 } },
  ]);

  // Jobs per day (last 7 days)
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  sevenDaysAgo.setHours(0, 0, 0, 0);

  const jobsPerDay = await JobCard.aggregate([
    { $match: { createdAt: { $gte: sevenDaysAgo } } },
    {
      $group: {
        _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
        count: { $sum: 1 },
      },
    },
    { $sort: { _id: 1 } },
  ]);

  // Fill in missing days with 0
  const days = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().slice(0, 10);
    const found = jobsPerDay.find((j) => j._id === dateStr);
    days.push({ date: dateStr, count: found ? found.count : 0 });
  }

  return {
    kpi: { total, active, ready, delivered },
    jobsByStage: jobsByStage.map((s) => ({ stage: s._id, count: s.count })),
    jobsPerDay: days,
  };
};

module.exports = { getAnalyticsSummary };

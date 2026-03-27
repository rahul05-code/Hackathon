const analyticsService = require('../services/analytics.service');

const getDashboardData = async (req, res, next) => {
  try {
    const data = await analyticsService.getAnalyticsSummary();
    res.status(200).json({ success: true, data });
const getDashboardData = async (req, res, next) => {
  try {
    // Data fetching logic from services
    res.status(200).json({ success: true, data: {} });
  } catch (error) { next(error); }
};

module.exports = { getDashboardData };

const getDashboardData = async (req, res, next) => {
  try {
    // Data fetching logic from services
    res.status(200).json({ success: true, data: {} });
  } catch (error) { next(error); }
};

module.exports = { getDashboardData };

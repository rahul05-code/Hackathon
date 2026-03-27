const getMechanics = async (req, res, next) => {
  try {
    // API logic goes here connecting to mechanic.service
    res.status(200).json({ success: true, data: [] });
  } catch (error) { next(error); }
};

module.exports = { getMechanics };

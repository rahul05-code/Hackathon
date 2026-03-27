const mechanicService = require('../services/mechanic.service');

const getMechanics = async (req, res, next) => {
  try {
    const mechanics = await mechanicService.getAllMechanics();
    res.status(200).json({ success: true, data: mechanics });
  } catch (error) { next(error); }
};

const createMechanic = async (req, res, next) => {
  try {
    const mechanic = await mechanicService.createMechanic(req.body);
    res.status(201).json({ success: true, data: mechanic });
  } catch (error) { next(error); }
};

module.exports = { getMechanics, createMechanic };
const getMechanics = async (req, res, next) => {
  try {
    // API logic goes here connecting to mechanic.service
    res.status(200).json({ success: true, data: [] });
  } catch (error) { next(error); }
};

module.exports = { getMechanics };

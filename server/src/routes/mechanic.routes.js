const express = require('express');
const router = express.Router();
const mechanicController = require('../controllers/mechanic.controller');

router.get('/', mechanicController.getMechanics);
router.post('/', mechanicController.createMechanic);

module.exports = router;

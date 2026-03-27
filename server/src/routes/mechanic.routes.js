const express = require('express');
const router = express.Router();
const mechanicController = require('../controllers/mechanic.controller');

router.get('/', mechanicController.getMechanics);

module.exports = router;

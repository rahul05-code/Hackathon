const express = require('express');
const router = express.Router();
const jobController = require('../controllers/job.controller');
const { createJobValidator } = require('../validators/job.validator');

router.post('/', createJobValidator, jobController.createJob);
router.get('/', jobController.getJobs);
router.patch('/:id/stage', jobController.updateJobStatus);

module.exports = router;

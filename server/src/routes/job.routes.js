const express = require('express');
const router = express.Router();
const jobController = require('../controllers/job.controller');

router.post('/', jobController.createJob);
router.get('/', jobController.getJobs);
router.get('/:id', jobController.getJobById);
router.patch('/:id/stage', jobController.updateJobStatus);
router.put('/:id/assign', jobController.assignMechanic);
const { createJobValidator } = require('../validators/job.validator');

router.post('/', createJobValidator, jobController.createJob);
router.get('/', jobController.getJobs);
router.patch('/:id/stage', jobController.updateJobStatus);

module.exports = router;

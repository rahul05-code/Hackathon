const express = require('express');
const router = express.Router();
const jobController = require('../controllers/job.controller');

router.post('/', jobController.createJob);
router.get('/', jobController.getJobs);
router.get('/:id', jobController.getJobById);
router.patch('/:id/stage', jobController.updateJobStatus);
router.put('/:id/assign', jobController.assignMechanic);

module.exports = router;

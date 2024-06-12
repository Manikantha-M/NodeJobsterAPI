const express = require('express');
const router = express.Router();
const checkTestUser = require('../middleware/testuser');

const {getAllJobs, getJob, createJob, updateJob, deleteJob, showStats } = require('../controllers/jobs');

router.route('/').post(checkTestUser, createJob).get(getAllJobs);
router.route('/stats').get(showStats);
router.route('/:id').get(getJob).delete(checkTestUser, deleteJob).patch(checkTestUser, updateJob);
module.exports = router;
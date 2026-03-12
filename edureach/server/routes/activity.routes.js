const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/auth.middleware');
const { getActivity, addActivity } = require('../controllers/activity.controller');

router.get('/', verifyToken, getActivity);
router.post('/', verifyToken, addActivity);

module.exports = router;

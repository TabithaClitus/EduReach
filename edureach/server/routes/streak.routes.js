const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/auth.middleware');
const { updateStreak, getStreakData, awardBadge } = require('../controllers/streak.controller');

router.get('/', verifyToken, getStreakData);
router.post('/update', verifyToken, updateStreak);
router.post('/badge', verifyToken, awardBadge);

module.exports = router;

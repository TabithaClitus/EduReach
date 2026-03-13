const express = require('express');
const router = express.Router();
const { askDoubt } = require('../controllers/doubt.controller');
const { verifyToken } = require('../middleware/auth.middleware');

router.post('/ask', verifyToken, askDoubt);

module.exports = router;

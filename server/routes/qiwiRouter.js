const express = require('express');
const router = express.Router();

const qiwiController = require('../controllers/qiwiController');

router.post('/', qiwiController.processWebhook);

module.exports = router;
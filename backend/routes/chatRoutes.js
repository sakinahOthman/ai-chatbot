const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chatController');

router.post('/', chatController.sendMessage);
router.post('/schedule', chatController.generateSchedule);

module.exports = router;
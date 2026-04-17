const chatService = require('../services/chatService');

exports.sendMessage = async (req, res) => {
    const userMessage = req.body.userMessage;
    
    const response = await chatService.sendMessage(userMessage);
    res.json({ reply: response });
};
exports.generateSchedule = async (req, res) => {
    try {
        const response = await chatService.generateSchedule(req.body);
        res.json(response);
    } catch (error) {
        console.error('Failed to generate schedule:', error);
        res.status(500).json({ message: 'Failed to generate schedule' });
    }
};

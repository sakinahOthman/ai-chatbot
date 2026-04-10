const chatService = require('../services/chatService');

exports.sendMessage = async (req, res) => {
    const userMessage = req.body.userMessage;
    
    const response = await chatService.sendMessage(userMessage);
    res.json({ reply: response });
};
require('dotenv').config();
const OpenAI = require('openai');

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

exports.sendMessage = async (userMessage) => {
    const response = await openai.chat.completions.create({
        model: "gpt-4.1-mini",
        messages: [
            {
            role: "developer",
            content: "You are a baby sleep consultant helping tired parents."
            },
            {
            role: "user",
            content: userMessage
            }
        ]
        });
    console.log("Received message:", response.choices[0].message.content);
    return response.choices[0].message.content;
};
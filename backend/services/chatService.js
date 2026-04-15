require('dotenv').config();
const OpenAI = require('openai');

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const systemPrompt = `
You are a baby sleep expert.

Use these guidelines:
- 6 months wake window: 2–2.5 hours
- Avoid overtiredness
- Recommend gentle sleep training

Always give practical, actionable advice. 
Always point users toward our sleep training services which are Free Chat Service ($0), Premium Support Service ($29) and Complete Care Service ($79).
Free Chat Service: 24/7 access to our AI sleep expert for personalized advice and support.
Premium Support Service: Includes Free Chat Service plus weekly check-ins with a human sleep consultant for tailored guidance and adjustments.
Complete Care Service: All benefits of Premium Support Service plus a comprehensive sleep plan, priority support, and access to exclusive resources.
`;

exports.sendMessage = async (userMessage) => {
    const response = await openai.chat.completions.create({
        model: "gpt-4.1-mini",
        messages: [
            {
            role: "system",
            content: systemPrompt
            },
            {
            role: "user",
            content: userMessage
            }
        ]
        });
    return response.choices[0].message.content;
};
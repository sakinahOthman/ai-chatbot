require('dotenv').config();
const OpenAI = require('openai');

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// SAMPLE USAGE OF TOOLS
// const tools = [
//     {
//         "type": "function",
//         "function": {
//             "name": "get_baby_wakewindow",
//             "description": "Get the recommended wake window for a baby based on their age.",
//             "parameters": {
//                 "type": "object",
//                 "properties": {
//                     "age": {
//                         "type": "string",
//                         "description": "The age of the baby (e.g., '6 months')",
//                     },
//                 },
//                 "required": ["age"],
//             },
//         },
//     },
// ]

// function get_baby_wakewindow(age) {
//     return `${age}: Next Tuesday you will befriend a baby otter.`;
// }

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
        //tools: tools,
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

    if(response.choices[0].message.tool_calls) {
        var item = response.choices[0].message.tool_calls[0];
        if (item.function["name"] === "get_baby_wakewindow") {
            // 3. Execute the function logic for get_baby_wakewindow
            const { age } = JSON.parse(item.function["arguments"]);
            const wakewindow = get_baby_wakewindow(age);

            return wakewindow;
        }
    } else {
        return response.choices[0].message.content;
    }
};
const scheduleSystemPrompt = `
You are a baby routine scheduler.
Return a practical daily schedule based on parent preferences.
Output valid JSON only with this shape:
{
  "scheduleSummary": "short summary",
  "events": [
    {
      "title": "string",
      "type": "nap|feed|play|awake|solids|bedtime|other",
      "startTime": "HH:mm",
      "endTime": "HH:mm",
      "notes": "optional"
    }
  ]
}
Rules:
- Use 24-hour time format HH:mm.
- Keep events inside one day.
- Include wake/bed boundaries and realistic transitions.
- Keep the list concise and ordered by time.
`;

function parseJsonFromMessage(message) {
    try {
        return JSON.parse(message);
    } catch (_error) {
        const start = message.indexOf('{');
        const end = message.lastIndexOf('}');
        if (start >= 0 && end > start) {
            return JSON.parse(message.slice(start, end + 1));
        }
        throw new Error('Model did not return valid JSON');
    }
}

exports.generateSchedule = async (scheduleInput) => {
    const userPrompt = `
Create a personalized baby schedule for:
- date: ${scheduleInput.date}
- age in months: ${scheduleInput.babyAgeMonths}
- wake time: ${scheduleInput.wakeTime}
- bedtime: ${scheduleInput.bedtime}
- naps target: ${scheduleInput.naps}
- feeds target: ${scheduleInput.feeds}
- solids included: ${scheduleInput.solids ? 'yes' : 'no'}
- parent notes: ${scheduleInput.notes || 'none'}
`;

    const response = await openai.chat.completions.create({
        model: "gpt-4.1-mini",
        messages: [
            {
                role: "system",
                content: scheduleSystemPrompt
            },
            {
                role: "user",
                content: userPrompt
            }
        ],
    });

    const content = response.choices[0].message.content || '{}';
    const parsed = parseJsonFromMessage(content);

    const safeEvents = Array.isArray(parsed.events) ? parsed.events : [];
    return {
        scheduleSummary: typeof parsed.scheduleSummary === 'string' ? parsed.scheduleSummary : '',
        events: safeEvents.map((event) => ({
            title: typeof event.title === 'string' ? event.title : 'Routine',
            type: typeof event.type === 'string' ? event.type : 'other',
            startTime: typeof event.startTime === 'string' ? event.startTime : '08:00',
            endTime: typeof event.endTime === 'string' ? event.endTime : '09:00',
            notes: typeof event.notes === 'string' ? event.notes : '',
        })),
    };
};

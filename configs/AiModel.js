import Groq from "groq-sdk";

const apiKey = process.env.EXPO_PUBLIC_GROQ_API_KEY;

const groq = new Groq({ apiKey, dangerouslyAllowBrowser: true });

const generationConfig = {
  temperature: 1,
  top_p: 0.95,
  max_tokens: 8192,
};

// Drop-in replacement for chatSession — call chatSession.sendMessage(prompt)
export const chatSession = {
  history: [],

  async sendMessage(prompt) {
    this.history.push({ role: "user", content: prompt });

    const response = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile", // fast & free on Groq
      messages: [
        {
          role: "system",
          content:
            "You are a helpful travel assistant. Always respond with valid JSON only — no markdown, no extra text.",
        },
        ...this.history,
      ],
      response_format: { type: "json_object" },
      ...generationConfig,
    });

    const text = response.choices[0].message.content;
    this.history.push({ role: "assistant", content: text });

    // Match Gemini's response shape so rest of your code works unchanged
    return {
      response: {
        text: () => text,
      },
    };
  },
};

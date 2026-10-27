require("dotenv").config();

const MODEL = process.env.GEMINI_MODEL || "gemini-3.5-flash-lite";
const URL = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent`;

async function callLLM(prompt) {
    const response = await fetch(URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "x-goog-api-key": process.env.GEMINI_API_KEY,
        },
        body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
        }),
    });

    if (!response.ok) {
        const errorBody = await response.text();
        throw new Error(`LLM request failed (${response.status}): ${errorBody}`);
    }

    const data = await response.json();
    return data.candidates[0].content.parts[0].text;
}

(async () => {
    try {
        const text = await callLLM("Say hello in one sentence.");
        console.log("Model replied:", text);
    } catch (err) {
        console.error(err.message);
        console.error("Cause:", err.cause);
    }
})();
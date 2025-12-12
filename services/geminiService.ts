import { GoogleGenAI } from "@google/genai";
import { DanceRecord } from "../types";

// Helper to safely get API key
const getApiKey = () => {
  try {
    return process.env.API_KEY || '';
  } catch (e) {
    return '';
  }
};

const apiKey = getApiKey();
const ai = new GoogleGenAI({ apiKey });

export const getAIAnalysis = async (record: DanceRecord): Promise<string> => {
  if (!apiKey) {
    return "API Key is missing. Please configure your Gemini API Key.";
  }

  try {
    const prompt = `
      You are an encouraging and insightful dance coach.
      Analyze this practice session:
      Style: ${record.style}
      Duration: ${record.durationMinutes} minutes
      Difficulty: ${record.difficulty}
      Mood: ${record.mood}
      Notes: "${record.notes}"

      Give a short, friendly, 2-sentence tip or encouragement based on the mood and notes.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    return response.text || "Keep dancing! You're doing great.";
  } catch (error) {
    console.error("Error fetching AI analysis:", error);
    return "Could not connect to the digital dance coach right now.";
  }
};

export const getAggregatedAnalysis = async (records: DanceRecord[], period: string): Promise<string> => {
   if (!apiKey) {
    return "API Key is missing.";
  }
  
  try {
     const summary = records.map(r => `- ${r.style} (${r.durationMinutes}m): ${r.mood}`).join('\n');
     const prompt = `
      You are a dance analyst.
      Here is a summary of the user's dance sessions for ${period}:
      ${summary}

      Provide a brief 3-sentence summary of their progress and consistency. Identify any trends in style or mood.
     `;

      const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    return response.text || "Great job keeping up with your practice!";
  } catch (error) {
     console.error("Error fetching AI aggregated analysis:", error);
    return "Analysis unavailable.";
  }
}
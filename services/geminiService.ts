import { GoogleGenAI, Type, Schema } from "@google/genai";
import { Difficulty, WordChallenge } from '../types';

// Using the API key from environment
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const wordSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    arabic: { type: Type.STRING, description: "The word in Arabic script." },
    english: { type: Type.STRING, description: "The direct English translation (single word preferred)." },
  },
  required: ["arabic", "english"],
};

const responseSchema: Schema = {
  type: Type.ARRAY,
  items: wordSchema,
};

export const fetchWordBatch = async (difficulty: Difficulty, count: number = 10): Promise<WordChallenge[]> => {
  const prompt = `
    Generate a list of ${count} distinct Arabic words appropriate for CEFR level ${difficulty}.
    Provide the Arabic word and its most common single-word English translation.
    Ensure the words are diverse (nouns, verbs, adjectives).
    For A1/A2, use very common words.
    For C1/C2, use abstract, complex, or literary words.
    Return strictly JSON.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: responseSchema,
        systemInstruction: "You are a strict language examiner. Provide accurate translations.",
      },
    });

    if (response.text) {
      const data = JSON.parse(response.text) as WordChallenge[];
      // sanitize inputs
      return data.map(d => ({
        arabic: d.arabic.trim(),
        english: d.english.trim().toLowerCase()
      }));
    }
    throw new Error("No data returned");
  } catch (error) {
    console.error("Gemini API Error:", error);
    // Fallback in case of API failure/rate limit to ensure playable demo
    return getFallbackWords(difficulty);
  }
};

// Simple fallback to keep the game running if API fails
const getFallbackWords = (difficulty: Difficulty): WordChallenge[] => {
  switch (difficulty) {
    case Difficulty.A1:
    case Difficulty.A2:
      return [
        { arabic: "بيت", english: "house" },
        { arabic: "سيارة", english: "car" },
        { arabic: "كتاب", english: "book" },
        { arabic: "شمس", english: "sun" },
        { arabic: "قمر", english: "moon" }
      ];
    case Difficulty.C1:
    case Difficulty.C2:
      return [
        { arabic: "استنزاف", english: "depletion" },
        { arabic: "توطيد", english: "consolidation" },
        { arabic: "بلاغة", english: "rhetoric" },
        { arabic: "هيمنة", english: "hegemony" },
        { arabic: "تناقض", english: "contradiction" }
      ];
    default:
      return [
        { arabic: "مدرسة", english: "school" },
        { arabic: "جميل", english: "beautiful" },
        { arabic: "سريع", english: "fast" },
        { arabic: "عمل", english: "work" },
        { arabic: "وقت", english: "time" }
      ];
  }
};
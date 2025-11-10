
import { GoogleGenAI } from "@google/genai";
import { CalculationResult } from '../types';

export const askGeminiWithThinking = async (query: string, data: CalculationResult[]): Promise<string> => {
  if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set");
  }

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  const dataContext = data.length > 0 
    ? `Here is the current data from the plant disease calculations:\n${JSON.stringify(data, null, 2)}`
    : "There is no calculation data yet.";

  const fullPrompt = `
    Based on the user's query and the provided data, provide a detailed and insightful analysis.
    The user is a plant pathologist or a farmer trying to understand their crop health.
    
    ${dataContext}

    User's Query: "${query}"

    Please provide a comprehensive answer.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-pro',
      contents: fullPrompt,
      config: {
        thinkingConfig: {
          thinkingBudget: 32768,
        },
      },
    });
    
    return response.text;
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    if (error instanceof Error) {
        return `An error occurred while contacting the Gemini API: ${error.message}`;
    }
    return "An unknown error occurred while contacting the Gemini API.";
  }
};

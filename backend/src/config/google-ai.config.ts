import { GoogleGenAI } from "@google/genai";
import { Env } from "./env.config";

// Only initialize if API key is provided
export const genAI = Env.GEMINI_API_KEY 
  ? new GoogleGenAI({ apiKey: Env.GEMINI_API_KEY })
  : null;
export const genAIModel = "gemini-2.0-flash";

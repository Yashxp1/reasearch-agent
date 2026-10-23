import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { config } from "../config/env";

export const llm = new ChatGoogleGenerativeAI({
  model: config.model,
  apiKey: config.geminiApi,
  maxOutputTokens: 4096,
});

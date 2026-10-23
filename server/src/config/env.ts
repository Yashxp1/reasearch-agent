import dotenv from "dotenv";

dotenv.config();

function required(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

export const config = {
  port: parseInt(process.env.PORT || "5000", 10),
  nodeEnv: process.env.NODE_ENV || "development",
  corsOrigin: process.env.CORS_ORIGIN || "*",
  isProduction: process.env.NODE_ENV === "production",
  tavilyApiKey: required("TAVILY_API_KEY"),
  geminiApi: required("GEMINI_API_KEY"),
  model: process.env.MODEL ?? "gemini-3.8-flash-lite",
  maxSources: 8,
  maxCharsPerSource: 6000,
  maxRevisions: 1,
} as const;

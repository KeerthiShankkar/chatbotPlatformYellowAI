// gemini.js
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_KEY);

export const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

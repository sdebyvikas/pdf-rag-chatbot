import Groq from 'groq-sdk';
import { config } from './env.js';

let groqInstance = null;

export function getGroqClient() {
  if (!config.groqApiKey) {
    throw new Error('GROQ_API_KEY is not configured in backend/.env');
  }

  if (!groqInstance) {
    groqInstance = new Groq({
      apiKey: config.groqApiKey
    });
  }

  return groqInstance;
}

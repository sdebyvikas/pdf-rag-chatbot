import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env relative to backend root
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

export const config = {
  port: parseInt(process.env.PORT || '5000', 10),
  groqApiKey: process.env.GROQ_API_KEY || '',
  groqModel: process.env.GROQ_MODEL || 'llama-3.3-70b-versatile',
  embeddingModel: process.env.EMBEDDING_MODEL || 'Xenova/all-MiniLM-L6-v2',
  chunkSize: parseInt(process.env.CHUNK_SIZE || '700', 10),
  chunkOverlap: parseInt(process.env.CHUNK_OVERLAP || '150', 10),
  topKDefault: parseInt(process.env.TOP_K_DEFAULT || '4', 10),
  storageDir: path.resolve(__dirname, '../../data/storage'),
  uploadDir: path.resolve(__dirname, '../../data/uploads')
};

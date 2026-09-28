import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { processAndIndexFile } from '../features/ingestion/ingestion.service.js';
import { logger } from '../core/utils/logger.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function seed() {
  const sampleFilePath = path.resolve(__dirname, '../../data/sample_docs/company_rag_guide.md');

  if (!fs.existsSync(sampleFilePath)) {
    logger.error(`Sample file not found at: ${sampleFilePath}`);
    process.exit(1);
  }

  const stat = fs.statSync(sampleFilePath);
  const mockFile = {
    path: sampleFilePath,
    originalname: 'company_rag_guide.md',
    size: stat.size
  };

  logger.info('Seeding sample knowledge document...');
  try {
    const doc = await processAndIndexFile(mockFile);
    logger.success(`Seeded document: ${doc.fileName} (${doc.chunkCount} chunks)`);
    process.exit(0);
  } catch (err) {
    logger.error(`Failed to seed sample document: ${err.message}`);
    process.exit(1);
  }
}

seed();

import fs from 'fs/promises';
import mammoth from 'mammoth';

export async function parseDocx(filePath) {
  const fileBuffer = await fs.readFile(filePath);
  const result = await mammoth.extractRawText({ buffer: fileBuffer });

  return {
    text: result.value || '',
    pageCount: 1, // Mammoth does not provide explicit page count
    messages: result.messages || []
  };
}

import fs from 'fs/promises';
import path from 'path';

export async function parseText(filePath) {
  const content = await fs.readFile(filePath, 'utf-8');
  const ext = path.extname(filePath).toLowerCase();

  let cleanText = content;

  if (ext === '.json') {
    try {
      const parsed = JSON.parse(content);
      cleanText = JSON.stringify(parsed, null, 2);
    } catch {
      cleanText = content;
    }
  }

  return {
    text: cleanText,
    pageCount: 1,
    format: ext.replace('.', '')
  };
}

import fs from 'fs/promises';
import pdfParse from 'pdf-parse';

export async function parsePdf(filePath) {
  const dataBuffer = await fs.readFile(filePath);
  const data = await pdfParse(dataBuffer);

  return {
    text: data.text || '',
    pageCount: data.numpages || 1,
    metadata: data.info || {}
  };
}

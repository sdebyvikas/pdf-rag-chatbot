import { config } from '../../config/env.js';

/**
 * Splits text into overlapping chunks using paragraph, sentence, and word boundaries.
 * 
 * @param {string} text - Raw document text
 * @param {object} options - Overrides for chunkSize and overlap
 * @returns {Array<object>} Array of chunk objects with text and metadata
 */
export function chunkDocumentText(text, options = {}) {
  const chunkSize = options.chunkSize || config.chunkSize || 700;
  const overlap = options.chunkOverlap || config.chunkOverlap || 150;

  if (!text || typeof text !== 'string') {
    return [];
  }

  const cleanText = text.replace(/\r\n/g, '\n').trim();
  if (cleanText.length <= chunkSize) {
    return [
      {
        chunkIndex: 0,
        text: cleanText,
        charCount: cleanText.length,
        startOffset: 0,
        endOffset: cleanText.length
      }
    ];
  }

  const chunks = [];
  let startIndex = 0;
  let chunkIndex = 0;

  while (startIndex < cleanText.length) {
    let targetEnd = startIndex + chunkSize;

    if (targetEnd >= cleanText.length) {
      const finalChunk = cleanText.substring(startIndex).trim();
      if (finalChunk.length > 0) {
        chunks.push({
          chunkIndex,
          text: finalChunk,
          charCount: finalChunk.length,
          startOffset: startIndex,
          endOffset: cleanText.length
        });
      }
      break;
    }

    // Try to find a natural breaking point near targetEnd: newline, period, question mark, exclamation, or space
    let splitPoint = -1;
    const searchWindow = cleanText.substring(Math.max(startIndex, targetEnd - 100), Math.min(cleanText.length, targetEnd + 50));
    const searchOffset = Math.max(startIndex, targetEnd - 100);

    // Look for paragraph break
    const paragraphBreak = searchWindow.lastIndexOf('\n\n');
    if (paragraphBreak !== -1 && (searchOffset + paragraphBreak) > startIndex + 100) {
      splitPoint = searchOffset + paragraphBreak + 2;
    }

    // Otherwise look for sentence break (. ! ? followed by space or newline)
    if (splitPoint === -1) {
      const sentenceRegex = /[.!?](\s|\n)/g;
      let match;
      let lastSentenceEnd = -1;
      while ((match = sentenceRegex.exec(searchWindow)) !== null) {
        lastSentenceEnd = match.index + 1;
      }
      if (lastSentenceEnd !== -1 && (searchOffset + lastSentenceEnd) > startIndex + 100) {
        splitPoint = searchOffset + lastSentenceEnd + 1;
      }
    }

    // Otherwise look for whitespace
    if (splitPoint === -1) {
      const lastSpace = searchWindow.lastIndexOf(' ');
      if (lastSpace !== -1 && (searchOffset + lastSpace) > startIndex + 100) {
        splitPoint = searchOffset + lastSpace + 1;
      }
    }

    // Fallback to strict chunkSize
    if (splitPoint === -1 || splitPoint <= startIndex) {
      splitPoint = targetEnd;
    }

    const chunkContent = cleanText.substring(startIndex, splitPoint).trim();
    if (chunkContent.length > 0) {
      chunks.push({
        chunkIndex,
        text: chunkContent,
        charCount: chunkContent.length,
        startOffset: startIndex,
        endOffset: splitPoint
      });
      chunkIndex++;
    }

    // Move next startIndex backwards by overlap
    startIndex = Math.max(startIndex + 1, splitPoint - overlap);
  }

  return chunks;
}

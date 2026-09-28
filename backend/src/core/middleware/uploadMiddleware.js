import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { config } from '../../config/env.js';

if (!fs.existsSync(config.uploadDir)) {
  fs.mkdirSync(config.uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, config.uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    // Sanitize non-ascii characters for disk storage filename
    const safeBase = Buffer.from(file.originalname, 'latin1').toString('utf8');
    const cleanBase = path.basename(safeBase, ext).replace(/[^a-zA-Z0-9_-]/g, '_');
    cb(null, `${cleanBase || 'doc'}-${uniqueSuffix}${ext}`);
  }
});

const fileFilter = (req, file, cb) => {
  const allowedExtensions = ['.pdf', '.docx', '.txt', '.md', '.markdown', '.csv', '.json'];
  const ext = path.extname(file.originalname).toLowerCase();
  
  if (allowedExtensions.includes(ext)) {
    cb(null, true);
  } else {
    const error = new Error(`Unsupported file type: "${ext}". Supported formats: PDF, DOCX, TXT, MD, CSV, JSON`);
    error.statusCode = 400;
    cb(error, false);
  }
};

export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 20 * 1024 * 1024 // 20MB limit
  }
});

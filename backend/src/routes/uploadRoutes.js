import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { fileURLToPath } from 'url';
import { sendJson, parseJsonBody } from '../utils/http.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const UPLOAD_ROOT = path.join(__dirname, '../../uploads');

// Ensure base upload directories exist
['avatars', 'projects', 'events', 'certificates', 'resumes'].forEach(dir => {
  const p = path.join(UPLOAD_ROOT, dir);
  if (!fs.existsSync(p)) {
    fs.mkdirSync(p, { recursive: true });
  }
});

const ALLOWED_EXTENSIONS = new Set(['.png', '.jpg', '.jpeg', '.webp', '.pdf', '.svg', '.doc', '.docx']);
const ALLOWED_MIME_TYPES = new Set([
  'image/png', 'image/jpeg', 'image/webp', 'image/svg+xml',
  'application/pdf', 'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
]);

/**
 * Handles File Uploads (Images, PDFs, Decks, Resumes)
 * Supports local persistence and presigned cloud storage
 */
export async function handleUploadRoutes({ req, res, pathname, authenticateSession }) {
  if (pathname === '/api/upload' && req.method === 'POST') {
    const auth = await authenticateSession(req);
    if (!auth) {
      sendJson(res, 401, { error: 'Authentication required to upload media.' });
      return true;
    }

    try {
      const body = await parseJsonBody(req);
      const { filename, fileData, mimeType, folder = 'projects' } = body;

      if (!filename || !fileData) {
        sendJson(res, 400, { error: 'File name and fileData (base64) are required.' });
        return true;
      }

      const ext = path.extname(filename).toLowerCase();
      if (!ALLOWED_EXTENSIONS.has(ext)) {
        sendJson(res, 400, { error: `File type ${ext} is not allowed. Allowed: PNG, JPG, WEBP, PDF, SVG, DOCX` });
        return true;
      }

      if (mimeType && !ALLOWED_MIME_TYPES.has(mimeType)) {
        sendJson(res, 400, { error: `MIME type ${mimeType} is not supported.` });
        return true;
      }

      // Sanitize folder path (prevent directory traversal)
      const safeFolder = ['avatars', 'projects', 'events', 'certificates', 'resumes'].includes(folder) ? folder : 'projects';
      const targetDir = path.join(UPLOAD_ROOT, safeFolder);
      if (!fs.existsSync(targetDir)) {
        fs.mkdirSync(targetDir, { recursive: true });
      }

      // Decode base64 payload (strip data:image/...;base64, header if present)
      const base64Data = fileData.replace(/^data:[a-zA-Z0-9/+-]+;base64,/, '');
      const buffer = Buffer.from(base64Data, 'base64');

      // Max size: 10 MB
      if (buffer.length > 10 * 1024 * 1024) {
        sendJson(res, 400, { error: 'File size exceeds 10 MB limit.' });
        return true;
      }

      const uniqueName = `${Date.now()}-${crypto.randomBytes(6).toString('hex')}${ext}`;
      const filePath = path.join(targetDir, uniqueName);
      fs.writeFileSync(filePath, buffer);

      const publicUrl = `/uploads/${safeFolder}/${uniqueName}`;

      console.log(`[Upload Service] 📁 User ${auth.user.email} uploaded: ${publicUrl} (${(buffer.length / 1024).toFixed(1)} KB)`);

      sendJson(res, 201, {
        success: true,
        message: 'File successfully uploaded and stored.',
        url: publicUrl,
        filename: uniqueName,
        originalName: filename,
        size: buffer.length,
        mimeType: mimeType || 'application/octet-stream'
      });
      return true;
    } catch (err) {
      console.error('[Upload Service] Error saving upload:', err);
      sendJson(res, 500, { error: 'Failed to process file upload.', details: err.message });
      return true;
    }
  }

  return false;
}

/**
 * Validation and Security Utilities for CampusNet
 * Enforces domain allowlists, secure file upload validation, and input sanitization.
 */

export interface ValidationResult {
  isValid: boolean;
  error?: string;
  formattedUrl?: string;
  normalizedUrl?: string;
}

export type SocialFieldType = 'linkedin' | 'github' | 'twitter' | 'leetcode' | 'instagram';

const ALLOWED_DOMAINS: Record<SocialFieldType, string[]> = {
  linkedin: ['linkedin.com', 'www.linkedin.com', 'in.linkedin.com'],
  github: ['github.com', 'www.github.com'],
  twitter: ['twitter.com', 'www.twitter.com', 'x.com', 'www.x.com'],
  leetcode: ['leetcode.com', 'www.leetcode.com', 'leetcode.in'],
  instagram: ['instagram.com', 'www.instagram.com']
};

/**
 * Validates social URLs against strict domain allowlists
 */
export function validateSocialUrl(type: SocialFieldType, rawUrl: string): ValidationResult {
  const trimmed = rawUrl.trim();
  if (!trimmed) {
    return { isValid: true, formattedUrl: '', normalizedUrl: '' }; // Optional field: empty is valid
  }

  // Prepend https:// if user entered plain handle or domain without protocol
  let normalized = trimmed;
  if (!/^https?:\/\//i.test(normalized)) {
    // If user provided username like 'aarav-ai' on github
    if (!normalized.includes('.')) {
      const defaultDomain = type === 'twitter' ? 'x.com' : `${type}.com`;
      normalized = `https://${defaultDomain}/${normalized.replace(/^@/, '')}`;
    } else {
      normalized = `https://${normalized}`;
    }
  }

  try {
    const parsed = new URL(normalized);
    
    // Only allow http and https protocols
    if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
      return { isValid: false, error: 'Only secure HTTP/HTTPS URLs are allowed' };
    }

    const hostname = parsed.hostname.toLowerCase();
    const allowed = ALLOWED_DOMAINS[type];

    const isMatch = allowed.some(domain => hostname === domain || hostname.endsWith(`.${domain}`));
    if (!isMatch) {
      const label = type === 'twitter' ? 'Twitter/X (x.com or twitter.com)' : `${type}.com`;
      return {
        isValid: false,
        error: `Invalid domain. Must be an official ${label} profile URL.`
      };
    }

    return {
      isValid: true,
      formattedUrl: parsed.href,
      normalizedUrl: parsed.href
    };
  } catch {
    return {
      isValid: false,
      error: 'Please enter a valid, well-formed URL format (e.g. https://github.com/username)'
    };
  }
}

/**
 * Validates Vidwan Scholar Profile URLs
 */
export function validateVidwanUrl(rawUrl: string): ValidationResult {
  const trimmed = rawUrl.trim();
  if (!trimmed) {
    return { isValid: true, formattedUrl: '', normalizedUrl: '' };
  }

  let normalized = trimmed;
  if (!/^https?:\/\//i.test(normalized)) {
    if (/^\d+$/.test(normalized)) {
      // If user typed only a profile ID like '123456'
      normalized = `https://vidwan.inflibnet.ac.in/profile/${normalized}`;
    } else {
      normalized = `https://${normalized}`;
    }
  }

  try {
    const parsed = new URL(normalized);
    if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
      return { isValid: false, error: 'Only secure HTTP/HTTPS URLs are allowed' };
    }

    const hostname = parsed.hostname.toLowerCase();
    if (!hostname.includes('inflibnet.ac.in') && !hostname.includes('vidwan')) {
      return {
        isValid: false,
        error: 'Invalid Vidwan URL. Must be an official Vidwan INFLIBNET profile link (e.g., https://vidwan.inflibnet.ac.in/profile/12345)'
      };
    }

    return {
      isValid: true,
      formattedUrl: parsed.href,
      normalizedUrl: parsed.href
    };
  } catch {
    return {
      isValid: false,
      error: 'Please enter a valid Vidwan URL format (e.g. https://vidwan.inflibnet.ac.in/profile/12345)'
    };
  }
}

/**
 * Validates and sanitizes file uploads for Event Hosting proposals
 */
export interface DocumentValidationResult {
  isValid: boolean;
  error?: string;
  sanitizedName?: string;
}

const ALLOWED_MIME_TYPES = [
  'application/pdf',
  'image/png',
  'image/jpeg',
  'image/jpg',
  'image/webp'
];

const ALLOWED_EXTENSIONS = ['.pdf', '.png', '.jpg', '.jpeg', '.webp'];
const BLOCKED_EXTENSIONS = ['.exe', '.bat', '.sh', '.cmd', '.js', '.vbs', '.php', '.py', '.html', '.htm', '.apk', '.bin'];
const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024; // 10 MB

export function validateDocumentUpload(file: { name: string; size: number; type: string }): DocumentValidationResult {
  if (!file || !file.name) {
    return { isValid: false, error: 'No file provided' };
  }

  // Check file size
  if (file.size > MAX_FILE_SIZE_BYTES) {
    return { isValid: false, error: `File size exceeds 10 MB limit (${(file.size / (1024 * 1024)).toFixed(1)} MB)` };
  }

  const lowerName = file.name.toLowerCase();
  
  // Block dangerous extensions
  const hasBlockedExt = BLOCKED_EXTENSIONS.some(ext => lowerName.endsWith(ext));
  if (hasBlockedExt) {
    return { isValid: false, error: 'Security violation: Executable or script files are strictly blocked.' };
  }

  // Check allowed extensions
  const hasAllowedExt = ALLOWED_EXTENSIONS.some(ext => lowerName.endsWith(ext));
  if (!hasAllowedExt) {
    return { isValid: false, error: 'Invalid file format. Only PDF, PNG, JPG, or JPEG files are accepted.' };
  }

  // Check mime type if provided by browser
  if (file.type && !ALLOWED_MIME_TYPES.includes(file.type.toLowerCase())) {
    return { isValid: false, error: 'Invalid MIME type. Uploaded document must be PDF or image.' };
  }

  // Sanitize filename to remove dangerous characters and path traversal
  const sanitizedName = file.name
    .replace(/[/\\]/g, '_')
    .replace(/\.\.+/g, '.')
    .replace(/[^a-zA-Z0-9._-]/g, '_');

  return {
    isValid: true,
    sanitizedName
  };
}

/**
 * Basic string sanitizer for user inputs
 */
export function sanitizeInput(input: string): string {
  if (!input) return '';
  return input
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/javascript:/gi, '')
    .trim();
}

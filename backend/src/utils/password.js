import argon2 from 'argon2';
import crypto from 'node:crypto';

/**
 * OWASP-recommended parameters for Argon2id
 * - type: Argon2id (hybrid resistant against side-channel and GPU-cracking attacks)
 * - memoryCost: 65536 KB (64 MB)
 * - timeCost: 3 iterations
 * - parallelism: 1 thread
 */
export const ARGON2_OPTIONS = {
  type: argon2.argon2id,
  memoryCost: 65536,
  timeCost: 3,
  parallelism: 1
};

/**
 * Checks whether a given string is an Argon2id PHC-formatted hash.
 * @param {string} str 
 * @returns {boolean}
 */
export function isArgon2Hash(str) {
  return typeof str === 'string' && str.startsWith('$argon2id$');
}

/**
 * Checks whether a string is any recognized password hash format (Argon2, bcrypt).
 * @param {string} str 
 * @returns {boolean}
 */
export function isRecognizedHash(str) {
  if (typeof str !== 'string') return false;
  return str.startsWith('$argon2id$') || 
         str.startsWith('$argon2i$') || 
         str.startsWith('$argon2d$') || 
         str.startsWith('$2a$') || 
         str.startsWith('$2b$');
}

/**
 * Hashes a plaintext password using Argon2id.
 * @param {string} plaintext 
 * @returns {Promise<string>}
 */
export async function hashPassword(plaintext) {
  if (!plaintext || typeof plaintext !== 'string') {
    throw new Error('Cannot hash empty or non-string password');
  }
  return await argon2.hash(plaintext, ARGON2_OPTIONS);
}

/**
 * Verifies a candidate password against a stored credential.
 * Safely handles both modern Argon2id hashes and legacy plaintext accounts.
 * NEVER silently passes plaintext strings to argon2.verify.
 * 
 * @param {string} storedCredential - Stored hash or legacy plaintext password
 * @param {string} candidatePassword - Password provided by user at login
 * @returns {Promise<{ valid: boolean, needsRehash: boolean }>}
 */
export async function verifyPassword(storedCredential, candidatePassword) {
  if (!storedCredential || typeof storedCredential !== 'string') {
    return { valid: false, needsRehash: false };
  }
  if (!candidatePassword || typeof candidatePassword !== 'string') {
    return { valid: false, needsRehash: false };
  }

  // Modern path: Argon2id hash
  if (isArgon2Hash(storedCredential)) {
    try {
      const match = await argon2.verify(storedCredential, candidatePassword);
      return { valid: match, needsRehash: false };
    } catch (err) {
      // Malformed hash or verification error
      return { valid: false, needsRehash: false };
    }
  }

  // Other recognized hash (e.g. bcrypt or alternate argon2)
  if (isRecognizedHash(storedCredential)) {
    try {
      const match = await argon2.verify(storedCredential, candidatePassword);
      return { valid: match, needsRehash: true };
    } catch {
      return { valid: false, needsRehash: false };
    }
  }

  // Legacy plaintext path: Constant-time comparison using SHA-256 digests
  // Prevents timing attacks while handling legacy accounts during migration
  try {
    const hashA = crypto.createHash('sha256').update(storedCredential).digest();
    const hashB = crypto.createHash('sha256').update(candidatePassword).digest();
    const isLegacyMatch = crypto.timingSafeEqual(hashA, hashB);
    return { valid: isLegacyMatch, needsRehash: isLegacyMatch };
  } catch {
    return { valid: false, needsRehash: false };
  }
}

/**
 * Validates password complexity: minimum 8 characters, non-empty string.
 * @param {string} password 
 * @returns {{ valid: boolean, error?: string }}
 */
export function validatePasswordStrength(password) {
  if (!password || typeof password !== 'string') {
    return { valid: false, error: 'Password is required and must be a string.' };
  }
  if (password.length < 8) {
    return { valid: false, error: 'Password must be at least 8 characters long.' };
  }
  return { valid: true };
}

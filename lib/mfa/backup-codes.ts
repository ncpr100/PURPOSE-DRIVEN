import { randomBytes } from 'crypto';
import bcrypt from 'bcryptjs';
const BACKUP_CODE_COUNT = 10;
const BACKUP_CODE_LENGTH = 8;
const BCRYPT_ROUNDS = 12;
/**
 * Generates a cryptographically secure random backup code
 * Format: XXXX-XXXX (8 characters, easier to read)
 */
function generateBackupCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // Exclude similar-looking chars
  const bytes = randomBytes(BACKUP_CODE_LENGTH);
  let code = '';
  for (let i = 0; i < BACKUP_CODE_LENGTH; i++) {
    code += chars[bytes[i] % chars.length];
    if (i === 3) code += '-'; // Add separator in middle
  }
  return code;
}
/**
 * Generates 10 backup codes and their bcrypt hashes
 */
export async function generateBackupCodes(): Promise<{
  codes: string[];
  hashedCodes: string[];
}> {
  const codes: string[] = [];
  const hashedCodes: string[] = [];
  for (let i = 0; i < BACKUP_CODE_COUNT; i++) {
    const code = generateBackupCode();
    codes.push(code);
    const hashed = await bcrypt.hash(code, BCRYPT_ROUNDS);
    hashedCodes.push(hashed);
  }
  return { codes, hashedCodes };
}
/**
 * Verifies a backup code against the array of hashed codes
 * Returns the index if valid, -1 if invalid or already used
 */
export async function verifyBackupCode(
  hashedCodes: string[],
  inputCode: string
): Promise<number> {
  const normalizedInput = inputCode.toUpperCase().replace(/[-\s]/g, '');
  for (let i = 0; i < hashedCodes.length; i++) {
    const storedCode = hashedCodes[i];
    if (!storedCode) continue; // Already used
    // Remove formatting from stored code for comparison
    const normalizedStored = storedCode.replace(/[-\s]/g, '');
    const isValid = await bcrypt.compare(normalizedInput, normalizedStored);
    if (isValid) {
      return i; // Return index so it can be marked as used
    }
  }
  return -1; // Invalid or not found
}
/**
 * Marks a backup code as used by setting it to null
 */
export function markBackupCodeAsUsed(
  hashedCodes: string[],
  index: number
): string[] {
  const updated = [...hashedCodes];
  updated[index] = ''; // Mark as used (empty string)
  return updated;
}
/**
 * Counts remaining unused backup codes
 */
export function countUnusedBackupCodes(hashedCodes: string[]): number {
  return hashedCodes.filter(code => code && code.length > 0).length;
}

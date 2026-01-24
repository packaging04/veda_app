/**
 * Normalizes a phone number by combining country code and local number
 * @param countryCode - The country code (e.g., "+234")
 * @param phone - The local phone number
 * @returns Formatted phone number with country code
 */
export function normalizePhone(countryCode: string, phone: string): string {
  let clean = phone.trim();

  // Remove spaces and dashes
  clean = clean.replace(/[\s-]/g, "");

  // Remove leading 0
  if (clean.startsWith("0")) {
    clean = clean.slice(1);
  }

  // Remove country code if user typed it again
  const codeWithoutPlus = countryCode.replace("+", "");
  if (clean.startsWith(codeWithoutPlus)) {
    clean = clean.slice(codeWithoutPlus.length);
  }

  // Also handle if they included the + in their input
  if (clean.startsWith(countryCode)) {
    clean = clean.slice(countryCode.length);
  }

  return `${countryCode}${clean}`;
}

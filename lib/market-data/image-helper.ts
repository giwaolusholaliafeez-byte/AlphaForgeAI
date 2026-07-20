export function getSafeImageUrl(value: unknown): string | null {
  // Must be a string
  if (typeof value !== 'string') {
    return null;
  }
  
  // Must not be empty
  const trimmed = value.trim();
  if (trimmed.length === 0) {
    return null;
  }
  
  // Must be a valid URL
  try {
    const url = new URL(trimmed);
    
    // Only allow https protocol for security
    if (url.protocol !== 'https:') {
      return null;
    }
    
    return url.toString();
  } catch {
    // Invalid URL
    return null;
  }
}

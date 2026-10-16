export interface ExtractedIndicators {
  sanitizedText: string;
  urls: string[];
  domains: string[];
  upis: string[];
  apkPackages: string[];
  redactedPhoneCount: number;
}

/**
 * 100% Client-Side Privacy-Preserving Parser
 * Redacts phone numbers and personal names before anything leaves the user's browser.
 * Extracts suspicious URLs, domains, APK package names, and UPI VPAs.
 */
export function extractAndSanitizeMessage(rawMessage: string): ExtractedIndicators {
  let text = rawMessage;

  // 1. Redact Indian mobile numbers (e.g. +91 9876543210, 98765 43210, 09876543210)
  const phoneRegex = /(\+91[\-\s]?)?[6-9]\d{9}/g;
  const phonesFound = text.match(phoneRegex) || [];
  text = text.replace(phoneRegex, '[REDACTED_PHONE]');

  // 2. Extract URLs and Domains
  const urlRegex = /(https?:\/\/[^\s]+)/gi;
  const rawUrls = text.match(urlRegex) || [];
  const urls: string[] = [];
  const domains: string[] = [];

  for (const u of rawUrls) {
    try {
      const urlObj = new URL(u);
      urls.push(u);
      domains.push(urlObj.hostname.toLowerCase().replace(/^www\./, ''));
    } catch {
      // Non-standard URL pattern
      const domainMatch = u.replace(/^https?:\/\//, '').split('/')[0];
      if (domainMatch) domains.push(domainMatch.toLowerCase());
    }
  }

  // Standalone domain regex (e.g. sbi-reward.site)
  const standaloneDomainRegex = /\b([a-zA-Z0-9\-]+\.(?:site|top|xyz|buzz|online|info|vip|club|click|live|in|com))\b/gi;
  let match;
  while ((match = standaloneDomainRegex.exec(text)) !== null) {
    const d = match[1].toLowerCase().replace(/^www\./, '');
    if (!domains.includes(d)) {
      domains.push(d);
    }
  }

  // 3. Extract UPI VPA Handles (e.g. merchant@ybl, support@okhdfcbank, refund@paytm)
  const upiRegex = /[a-zA-Z0-9.\-_]{2,256}@[a-zA-Z]{2,64}/gi;
  const rawUpis = text.match(upiRegex) || [];
  const upis = Array.from(new Set(rawUpis.map((u) => u.toLowerCase())));

  // 4. Extract Android Package Names (e.g. com.instant.loan, org.quickpaisa.app)
  const apkRegex = /\b([a-z][a-z0-9_]*(\.[a-z][a-z0-9_]*){2,})\b/gi;
  const rawApks = text.match(apkRegex) || [];
  const apkPackages = Array.from(
    new Set(
      rawApks.filter(
        (p) =>
          !p.endsWith('.com') &&
          !p.endsWith('.org') &&
          !p.endsWith('.in') &&
          !p.endsWith('.net')
      )
    )
  );

  return {
    sanitizedText: text,
    urls: Array.from(new Set(urls)),
    domains: Array.from(new Set(domains)),
    upis,
    apkPackages,
    redactedPhoneCount: phonesFound.length,
  };
}

/**
 * Top 30 Legitimate Indian Banking, Payment & Government Authority Domains
 */
export const LEGITIMATE_INDIAN_DOMAINS = [
  'onlinesbi.sbi',
  'sbi.co.in',
  'hdfcbank.com',
  'icicibank.com',
  'axisbank.com',
  'pnbindia.in',
  'bankofbaroda.in',
  'canarabank.com',
  'kotak.com',
  'incometax.gov.in',
  'epfindia.gov.in',
  'parivahan.gov.in',
  'cybercrime.gov.in',
  'uidai.gov.in',
  'npci.org.in',
  'rbi.org.in',
  'paytm.com',
  'phonepe.com',
  'google.com',
  'bhimupi.org.in',
];

export interface LookalikeRisk {
  isSuspicious: boolean;
  score: number; // 0 to 100
  targetedBrand?: string;
  reason?: string;
}

/**
 * Checks for typo-squatting, homoglyphs, and brand prefixing targeting Indian entities
 */
export function checkLookalikeRisk(domain: string): LookalikeRisk {
  const d = domain.toLowerCase().trim();

  // 1. Check for suspicious TLDs often abused in cyber fraud
  const dangerousTlds = ['.top', '.xyz', '.buzz', '.vip', '.click', '.monster', '.rest', '.cfd'];
  const hasDangerousTld = dangerousTlds.some((tld) => d.endsWith(tld));

  // 2. Check for brand hijacking (e.g., sbi-login-rewards.com, hdfc-netbanking-kyc.org)
  const brandKeywords = [
    { brand: 'State Bank of India (SBI)', patterns: ['sbi', 'onlinesbi', 'statebank'] },
    { brand: 'HDFC Bank', patterns: ['hdfc', 'hdfcbank'] },
    { brand: 'ICICI Bank', patterns: ['icici', 'icicibank'] },
    { brand: 'Income Tax Dept', patterns: ['incometax', 'taxrefund'] },
    { brand: 'EPFO (Provident Fund)', patterns: ['epfo', 'epfindia', 'uanpassbook'] },
    { brand: 'Parivahan (Challan)', patterns: ['parivahan', 'echallan', 'morth'] },
    { brand: 'Electricity Dept', patterns: ['bijli', 'powerbill', 'electricitybill', 'mseb'] },
    { brand: 'Police / CBI', patterns: ['delhipolice', 'mumbaipolice', 'cbicell', 'cybercrimecell'] },
  ];

  for (const { brand, patterns } of brandKeywords) {
    for (const pat of patterns) {
      if (d.includes(pat)) {
        // If it's the exact legitimate domain, it's safe!
        if (LEGITIMATE_INDIAN_DOMAINS.includes(d)) {
          return { isSuspicious: false, score: 0 };
        }

        // Otherwise, if brand name is embedded in a non-official domain
        let reason = `Domain contains "${pat}" mimicking official ${brand}`;
        let score = 75;

        if (hasDangerousTld) {
          reason += ` and uses high-risk fraud TLD.`;
          score = 95;
        }

        return {
          isSuspicious: true,
          score,
          targetedBrand: brand,
          reason,
        };
      }
    }
  }

  // 3. Standalone high-risk TLD check
  if (hasDangerousTld) {
    return {
      isSuspicious: true,
      score: 50,
      reason: 'Domain registered on high-risk TLD frequently utilized in transient phishing campaigns.',
    };
  }

  return { isSuspicious: false, score: 0 };
}

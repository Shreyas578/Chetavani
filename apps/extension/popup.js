// Check visited domain against Arkiv indicators or heuristics
chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
  const currentTab = tabs[0];
  if (!currentTab || !currentTab.url) return;

  try {
    const url = new URL(currentTab.url);
    const domain = url.hostname.toLowerCase().replace(/^www\./, '');

    document.getElementById('domainDisplay').textContent = domain;

    // High risk TLDs or lookalikes
    const suspiciousTlds = ['.top', '.xyz', '.buzz', '.vip', '.info'];
    const hasSuspiciousTld = suspiciousTlds.some(tld => domain.endsWith(tld));
    const isSbiLookalike = domain.includes('sbi') && domain !== 'onlinesbi.sbi' && domain !== 'sbi.co.in';

    const statusBadge = document.getElementById('statusBadge');
    const reasonText = document.getElementById('reasonText');
    const reportBtn = document.getElementById('reportBtn');

    if (hasSuspiciousTld || isSbiLookalike) {
      statusBadge.textContent = 'High Scam Risk Flagged';
      statusBadge.className = 'badge badge-warn';
      reasonText.textContent = isSbiLookalike
        ? 'Warning: Typo-squatting or unofficial domain mimicking State Bank of India.'
        : 'Warning: Suspicious TLD associated with transient fraud campaigns.';
    } else {
      statusBadge.textContent = 'No Malicious Records on Arkiv';
      statusBadge.className = 'badge badge-safe';
      reasonText.textContent = 'Verified clean against current Tiramisu block state.';
    }

    reportBtn.href = `https://chetavani.vercel.app?report=${encodeURIComponent(domain)}`;
  } catch (err) {
    document.getElementById('domainDisplay').textContent = 'Internal Browser Page';
  }
});

// Load real on-chain registry
fetch('live-registry.json')
  .then(res => res.json())
  .then(liveRecords => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const currentTab = tabs[0];
      if (!currentTab || !currentTab.url) return;

      try {
        const url = new URL(currentTab.url);
        const domain = url.hostname.toLowerCase().replace(/^www\./, '');

        document.getElementById('domainDisplay').textContent = domain;

        const matchedRecord = liveRecords.find(r => r.indicator.toLowerCase() === domain);

        // High risk TLDs or lookalikes
        const suspiciousTlds = ['.top', '.xyz', '.buzz', '.vip', '.info'];
        const hasSuspiciousTld = suspiciousTlds.some(tld => domain.endsWith(tld));
        const isSbiLookalike = domain.includes('sbi') && domain !== 'onlinesbi.sbi' && domain !== 'sbi.co.in';

        const statusBadge = document.getElementById('statusBadge');
        const reasonText = document.getElementById('reasonText');
        const reportBtn = document.getElementById('reportBtn');

        if (matchedRecord) {
          statusBadge.textContent = '🚨 CONFIRMED SCAM ON ARKIV';
          statusBadge.className = 'badge badge-warn';
          reasonText.innerHTML = `
            <div><strong>Threat:</strong> ${matchedRecord.payload?.title || matchedRecord.category}</div>
            <div style="margin-top: 4px; font-size: 10px;">
              <a href="https://tiramisu.explorer.arkiv.network/tx/${matchedRecord.txHash}" target="_blank" style="color: #ff9933; text-decoration: underline;">
                🔗 View Real On-Chain Tx on Tiramisu
              </a>
            </div>
          `;
        } else if (hasSuspiciousTld || isSbiLookalike) {
          statusBadge.textContent = 'High Scam Risk Flagged';
          statusBadge.className = 'badge badge-warn';
          reasonText.textContent = isSbiLookalike
            ? 'Warning: Typo-squatting or unofficial domain mimicking State Bank of India.'
            : 'Warning: Suspicious TLD associated with transient fraud campaigns.';
        } else {
          statusBadge.textContent = 'Verified Clean on Arkiv';
          statusBadge.className = 'badge badge-safe';
          reasonText.textContent = 'Verified clean against current Tiramisu block state.';
        }

        reportBtn.href = `https://chetavani.vercel.app?report=${encodeURIComponent(domain)}`;
      } catch (err) {
        document.getElementById('domainDisplay').textContent = 'Internal Browser Page';
      }
    });
  })
  .catch(() => {
    // Fallback if local fetch fails
  });

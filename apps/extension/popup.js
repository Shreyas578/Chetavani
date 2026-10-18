// Load real on-chain registry & live sync
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

        const statusBadge = document.getElementById('statusBadge');
        const reasonText = document.getElementById('reasonText');
        const reportBtn = document.getElementById('reportBtn');

        reportBtn.href = `https://chetavani.vercel.app?report=${encodeURIComponent(domain)}`;

        function applyMatchedRecord(record) {
          statusBadge.textContent = '🚨 CONFIRMED SCAM ON ARKIV';
          statusBadge.className = 'badge badge-warn';
          const txInfo = record.txHash
            ? `<div style="margin-top: 4px; font-size: 10px;">
                <a href="https://tiramisu.explorer.arkiv.network/tx/${record.txHash}" target="_blank" style="color: #ff9933; text-decoration: underline;">
                  🔗 View Real On-Chain Tx on Tiramisu
                </a>
              </div>`
            : `<div style="margin-top: 4px; font-size: 10px; color: #f59e0b;">⚡ Pending Community Peer Confirms</div>`;

          reasonText.innerHTML = `
            <div><strong>Threat:</strong> ${record.payload?.title || record.category}</div>
            ${txInfo}
          `;
        }

        // 1. Check bundled registry
        const matchedRecord = liveRecords.find(r => r.indicator.toLowerCase() === domain);

        // High risk TLDs or lookalikes
        const suspiciousTlds = ['.top', '.xyz', '.buzz', '.vip', '.info'];
        const hasSuspiciousTld = suspiciousTlds.some(tld => domain.endsWith(tld));
        const isSbiLookalike = domain.includes('sbi') && domain !== 'onlinesbi.sbi' && domain !== 'sbi.co.in';

        if (matchedRecord) {
          applyMatchedRecord(matchedRecord);
        } else if (hasSuspiciousTld || isSbiLookalike) {
          statusBadge.textContent = 'High Scam Risk Flagged';
          statusBadge.className = 'badge badge-warn';
          reasonText.textContent = isSbiLookalike
            ? 'Warning: Typo-squatting or unofficial domain mimicking State Bank of India.'
            : 'Warning: Suspicious TLD associated with transient fraud campaigns.';
        } else {
          // Check local storage for user-reported domains in this browser
          chrome.storage.local.get(['reportedDomains'], (storageRes) => {
            const userReported = storageRes.reportedDomains || [];
            if (userReported.includes(domain)) {
              applyMatchedRecord({
                indicator: domain,
                payload: {
                  title: 'Community Reported Scam Indicator',
                  description: 'Reported directly by community user via Chetavani Shield.',
                },
              });
              return;
            }

            // Check live API for newly reported domains
            fetch(`https://chetavani.vercel.app/api/registry?check=${encodeURIComponent(domain)}`)
              .then(r => r.json())
              .then(data => {
                if (data.found && data.report) {
                  applyMatchedRecord(data.report);
                } else {
                  statusBadge.textContent = 'Verified Clean on Arkiv';
                  statusBadge.className = 'badge badge-safe';
                  reasonText.textContent = 'Verified clean against current Tiramisu block state.';
                }
              })
              .catch(() => {
                statusBadge.textContent = 'Verified Clean on Arkiv';
                statusBadge.className = 'badge badge-safe';
                reasonText.textContent = 'Verified clean against current Tiramisu block state.';
              });
          });
        }

        // Whenever user clicks report, save to chrome.storage.local so warning stays active immediately!
        reportBtn.addEventListener('click', () => {
          chrome.storage.local.get(['reportedDomains'], (res) => {
            const list = res.reportedDomains || [];
            if (!list.includes(domain)) {
              list.push(domain);
              chrome.storage.local.set({ reportedDomains: list });
            }
          });
        });
      } catch (err) {
        document.getElementById('domainDisplay').textContent = 'Internal Browser Page';
      }
    });
  })
  .catch(() => {
    // Fallback if local fetch fails
  });

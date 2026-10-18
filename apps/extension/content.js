// Content script for showing in-page warning banner on flagged domains
(() => {
  const currentHostname = window.location.hostname.toLowerCase().replace(/^www\./, '');

  // Fetch the local on-chain registry snapshot bundled with the extension
  const registryUrl = chrome.runtime.getURL('live-registry.json');

  fetch(registryUrl)
    .then((res) => res.json())
    .then((records) => {
      const matched = records.find(
        (r) => r.indicator.toLowerCase() === currentHostname
      );

      // Known heuristic checks
      const suspiciousTlds = ['.top', '.xyz', '.buzz', '.vip', '.info'];
      const hasSuspiciousTld = suspiciousTlds.some((tld) => currentHostname.endsWith(tld));
      const isSbiLookalike =
        currentHostname.includes('sbi') &&
        currentHostname !== 'onlinesbi.sbi' &&
        currentHostname !== 'sbi.co.in';

      const isThreat = matched || hasSuspiciousTld || isSbiLookalike;

      if (isThreat) {
        const titleText = matched?.payload?.title || 'Phishing / Impersonation Attack';
        const txLink = matched?.txHash
          ? `<a href="https://tiramisu.explorer.arkiv.network/tx/${matched.txHash}" target="_blank" style="color: #fef08a; text-decoration: underline; margin-left: 8px; font-weight: bold;">View On-Chain Tx (#7738577)</a>`
          : '';

        const banner = document.createElement('div');
        banner.id = 'chetavani-scam-shield-banner';
        banner.style.cssText = `
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          z-index: 2147483647;
          background: linear-gradient(90deg, #991b1b, #7f1d1d);
          color: #ffffff;
          padding: 14px 24px;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
          font-size: 13px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          box-shadow: 0 4px 25px rgba(0,0,0,0.7);
          border-bottom: 2px solid #ef4444;
        `;

        banner.innerHTML = `
          <div style="display: flex; align-items: center; gap: 12px;">
            <span style="font-size: 24px;">🚨</span>
            <div>
              <div style="font-weight: 800; font-size: 14px; color: #fca5a5; letter-spacing: 0.5px;">
                CHETAVANI SCAM WARNING (चेतावनी)
              </div>
              <div style="margin-top: 2px; color: #f8fafc;">
                <strong>${currentHostname}</strong> is FLAGGED on the Arkiv Blockchain Scam Registry as: <em>${titleText}</em>.
                Do NOT enter banking credentials, UPI PINs, or OTPs.${txLink}
              </div>
            </div>
          </div>
          <div style="display: flex; align-items: center; gap: 8px;">
            <a href="https://chetavani.vercel.app" target="_blank" style="
              background: #ff7700;
              color: white;
              padding: 6px 12px;
              border-radius: 6px;
              text-decoration: none;
              font-weight: bold;
              font-size: 12px;
            ">Verify on Chetavani</a>
            <button id="chetavani-dismiss-btn" style="
              background: rgba(255,255,255,0.2);
              border: none;
              color: white;
              padding: 6px 10px;
              border-radius: 6px;
              cursor: pointer;
              font-weight: bold;
              font-size: 12px;
            ">✕</button>
          </div>
        `;

        document.body.prepend(banner);

        document.getElementById('chetavani-dismiss-btn')?.addEventListener('click', () => {
          banner.remove();
        });
      }
    })
    .catch((err) => {
      console.warn('Chetavani Shield registry check:', err);
    });
})();

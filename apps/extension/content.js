// Content script for showing in-page warning banner on flagged domains
(() => {
  const currentHostname = window.location.hostname.toLowerCase();

  // Known high risk patterns or domains
  const isHighRisk =
    currentHostname.endsWith('.top') ||
    currentHostname.endsWith('.buzz') ||
    currentHostname.endsWith('.xyz') ||
    (currentHostname.includes('sbi') && !currentHostname.includes('.sbi') && !currentHostname.includes('sbi.co.in'));

  if (isHighRisk) {
    const banner = document.createElement('div');
    banner.id = 'chetavani-scam-shield-banner';
    banner.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      z-index: 999999999;
      background: #7f1d1d;
      color: #ffffff;
      padding: 12px 20px;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      font-size: 13px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      box-shadow: 0 4px 20px rgba(0,0,0,0.5);
      border-bottom: 2px solid #ef4444;
    `;

    banner.innerHTML = `
      <div style="display: flex; items: center; gap: 10px;">
        <span style="font-size: 18px;">🚨</span>
        <div>
          <strong style="color: #fca5a5;">CHETAVANI SCAM WARNING:</strong>
          <span>This domain (<strong>${currentHostname}</strong>) displays suspicious markers or lookalike patterns flagged on Arkiv DB-Chain. Do NOT enter banking passwords or OTPs.</span>
        </div>
      </div>
      <button id="chetavani-dismiss-btn" style="
        background: rgba(255,255,255,0.2);
        border: none;
        color: white;
        padding: 4px 10px;
        border-radius: 6px;
        cursor: pointer;
        font-weight: bold;
      ">Dismiss</button>
    `;

    document.body.prepend(banner);

    document.getElementById('chetavani-dismiss-btn')?.addEventListener('click', () => {
      banner.remove();
    });
  }
})();

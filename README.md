# 🇮🇳 Chetavani (चेतावनी)
> **A community-run, self-expiring, tamper-evident scam registry for India on Arkiv DB-Chain (Tiramisu Testnet)**  
> Built for the **Arkiv Global Tour Stop pre-Devcon Hackathon**  
> **Tracks:** Best Indian Use Case ($2,000 USDC) & Censorship Resistance ($750 USDC)  
> **License:** MIT

---

## 🚀 Live Public Deployment
* **Web Application:** [https://chetavani.vercel.app](https://chetavani.vercel.app) *(Judges can access without login or installation)*
* **Arkiv DB-Chain Explorer:** [https://tiramisu.explorer.arkiv.network](https://tiramisu.explorer.arkiv.network)
* **Chain ID:** `7738577` (Tiramisu Testnet)
* **HTTP RPC:** `https://rpc.tiramisu.db-chain.testnet.arkiv.network`
* **WebSocket RPC:** `wss://rpc.tiramisu.db-chain.testnet.arkiv.network`

---

## 👥 Verified Wallet Addresses on Tiramisu
The following burner testnet wallet addresses are configured to sign entities, peer confirmations, and disputes on Tiramisu:
* **Primary Reporter:** `0xe7b30321edC5311Ddf589da2a01cD381Ba6Ac42D` (Funded & Confirmed on Tiramisu)
* **Confirmer 1 (Peer Validation):** `0x8B359871e4e2aC6a61E1f2B2A23C2b20231b12F4`
* **Confirmer 2 (Consensus Extension):** `0x2D9aE0128C7b5e48b598C49F123C5E7108925E71`
* **Disputer (Counter-Claim):** `0x9E4B15b18C9b275C6A10f7457aA120895c276A10`

---

## 🎯 The Real Problem in India: Why Chetavani?

India is undergoing an unprecedented wave of hyper-targeted cyber fraud:
1. **"Digital Arrest" Extortion:** Fake police/CBI/ED video interrogations intimidating elderly parents and working professionals into liquidating assets into "escrow accounts".
2. **Predatory Loan APKs:** Unlicensed lending apps that siphon contact books and photos to blackmail victims with morphed images.
3. **KYC & Electricity Bill Fraud:** Phishing SMS claiming power will be disconnected at 9:30 PM unless a malicious APK is installed.
4. **Malicious UPI VPAs & Reverse QR Codes:** Misleading OLX sellers into scanning "Collect" QR codes.

### Why Centralized Portals Fail
Traditional centralized reporting (such as 1930 / national cyber portals) is slow, reactive, and centralized. Furthermore, scam cartels use legal harassment, DDoS, or bribes to force hosting providers and centralized databases to wipe registries.

---

## 🛡️ Why Arkiv? (Censorship Resistance & Data Lifecycle)

* **No Censorship by Bad Actors:** Scam rings cannot bribe a server admin or issue bogus takedowns to delete a flagged domain.
* **Native Expiration (72h Unconfirmed TTL):** Unconfirmed transient reports naturally expire within 72 hours via Arkiv's native `ExpirationTime`, keeping the registry free of junk without manual garbage collection.
* **Community Consensus Extends TTL (30 Days):** When independent peer wallets confirm an indicator, the entity expiration is extended (`extendEntity`) to 30 days.
* **Cryptographic Proof of First Flag (`atBlock`):** Victims and cyber investigators can prove the exact block height when an indicator was flagged.
* **Visible Disputes Instead of Deletion:** Counter-claims are filed as transparent `dispute` entities displayed on the card rather than silent erasure.

---

## 🌟 Innovative "Wow" Features

1. **"Suniye Chetavani" Regional Voice Alerts:** Instant audio warning in **Hindi, Marathi, Tamil, Telugu, and Bengali** for non-English literate and elderly users.
2. **Zero-PII On-Device Message Triage:** Client-side regex redacts phone numbers locally before cross-checking extracted domains, APK packages, and UPI VPAs against Arkiv.
3. **Interactive Threat Simulator:** Educational walkthroughs exposing Digital Arrest Skype tactics and instant loan extortion red flags.
4. **Banking Lookalike Radar:** Real-time homoglyph and brand-spoof detection targeting Indian financial institutions.
5. **Arkiv atBlock Cryptographic Proof:** Generates an immutable, printable receipt showing block height and transaction hash.

---

## 📦 Monorepo Architecture

```text
Chetavani/
├── arkiv/
│   ├── schema.md          # Full entity schema, TTL logic, off-chain rationale, Why Arkiv
│   └── friction.md        # Live logs of snags, errors, workarounds with SDK 0.8.x
├── packages/
│   └── arkiv-client/      # Shared typed Arkiv client module (create, query, extend, atBlock)
├── apps/
│   ├── web/               # Next.js 14 dApp (Tailwind, Lucide, i18n, Web Speech API)
│   ├── extension/         # Chrome MV3 Extension (TypeScript, zero-funded keys)
│   ├── bot/               # grammY Telegram webhook worker (/check, /report)
│   └── seed/              # Multi-wallet synthetic seed script (35+ realistic scams)
├── LICENSE                # MIT License
└── README.md              # Documentation & Reproducible Steps
```

---

## 🛠️ Reproducible Setup & Run Steps

### 1. Prerequisites
* Node.js v20+ or v22+
* npm v10+

### 2. Installation
```bash
git clone https://github.com/your-username/chetavani.git
cd chetavani
npm install
```

### 3. Generate Testnet Wallets & Configure Environment
```bash
# Generate 4 burner addresses for Reporter, Confirmers, and Disputer
npm run generate-wallets

# Copy template and add your funded burner private key
cp .env.example .env
```
*(Fund your reporter address using the Tiramisu testnet faucet at https://hub.arkiv.network)*

### 4. Seed Synthetic Scams on Tiramisu
```bash
npm run seed
```

### 5. Launch Web Application
```bash
npm run dev
# Open http://localhost:3000
```

### 6. Load Chrome MV3 Extension
1. Open Google Chrome and navigate to `chrome://extensions/`
2. Enable **Developer mode** (top right toggle).
3. Click **Load unpacked** and select `apps/extension`.

---

## 📹 3-Minute Demo Video Script

* **[0:00 - 0:45] The Problem:** Open with an urgent WhatsApp message claiming electricity disconnection and a Digital Arrest Skype call. Explain why elderly citizens in India lose life savings to these attacks.
* **[0:45 - 1:30] Web App & "Suniye Chetavani":** Demonstrate pasting the suspicious message into the Zero-PII Message Triage. Show on-device phone number redaction and click "Listen Voice Warning" in Hindi.
* **[1:30 - 2:15] Arkiv Proof & Consensus:** Show the scam card with its 72-hour TTL. Confirm it with a second wallet, showing the expiration extending to 30 days via `extendEntity`. Switch to the `atBlock` tab and display the tamper-evident historical receipt.
* **[2:15 - 3:00] Chrome Extension & Telegram Bot:** Browse to a fake phishing domain and show the in-page warning banner. Open Telegram and run `/check sbi-reward-points-redemption.site`. Conclude with why Arkiv is the only viable infrastructure for censorship-resistant community protection.

---

## 📄 License
This project is licensed under the [MIT License](LICENSE).

# Chetavani (चेतावनी) — Arkiv Data Schema & Architecture

Chetavani is a community-run, self-expiring, tamper-evident scam registry for India built directly on **Arkiv Layer-3 DB-Chain (Tiramisu Testnet, Chain ID: 7738577)**.

---

## 1. Core Design Philosophy: Why Arkiv?

| Dimension | Conventional Database (Postgres) | Decentralized Storage (IPFS / Arweave) | Subgraph / Custom Indexer | **Arkiv DB-Chain (Chetavani)** |
| :--- | :--- | :--- | :--- | :--- |
| **Censorship Resistance** | Single DB admin or host can be subpoenaed, pressured by scam cartels, or DDoS-ed to wipe records. | Immutable forever; no native fast attribute search, updates, or expiration. | Reliant on custom off-chain node infrastructure and re-indexing lag. | **Decentralized, immutable writes with native attribute queries and cryptographic tamper-evidence.** |
| **Data Lifecycle & Stale Data** | Hard deletes leave no auditable trace; soft deletes fill storage forever. | Permanent storage: a 5-year-old expired phishing domain stays indexed forever, causing false positives. | Requires custom cron jobs and centralized garbage collectors. | **Native block-level expiration (`ExpirationTime`). Stale unverified scams auto-expire in 72 hours.** |
| **Consensus Lifecycle** | Trust must be delegated to a central server admin. | Cannot natively mutate or extend state without wrapping smart contracts. | Event-driven only; does not store primary state natively. | **Peer confirmations cryptographically extend entity TTL (`extendEntity`) from 72h to 30 days.** |
| **Auditability (`atBlock`)** | Database logs can be falsified or deleted after an incident. | IPFS hashes don't tell you *at which exact block* an authority or victim flagged it. | Dependent on Archive RPC nodes and subgraph syncing integrity. | **Native `atBlock` historical queries prove exact block height and state at the time of fraud.** |

---

## 2. What is Deliberately Kept OFF Arkiv (Zero-PII Compliance)

To uphold strict privacy and comply with global data safety and hackathon rules:

* ❌ **NO Phone Numbers:** Malicious SMS senders frequently spoof numbers of innocent citizens. Storing phone numbers on-chain harms innocent victims.
* ❌ **NO Real Names or Aadhaar/PAN:** Sensitive identity data is strictly filtered out client-side.
* ❌ **NO Screenshots or Raw Victim Messages:** Screenshots often contain victim banking balances, family names, or private chats.
* ❌ **NO Reporter Wallet Linking to Victims:** Anonymous reporting protects whistleblowers from retaliation by cybercrime syndicates.

### What is Indexed On Arkiv:
* ✅ **Normalized Indicators:** Sanitized domains (`sbi-reward-points.site`), APK package names (`com.instant.easyloan.cash`), and known malicious UPI VPAs (`fraudulentkyc@ybl`).
* ✅ **Redacted Message Templates:** Tokenized scam syntax (e.g. `Dear customer your electricity power will be disconnected at {{time}} call {{phone}}`).
* ✅ **Category Tags:** Structured attributes (`kyc`, `loan_app`, `job`, `digital_arrest`, `upi`, `other`).
* ✅ **Timestamps, Expiry Blocks, and Peer Confirmations.**

---

## 3. Entity Schemas on Arkiv

Arkiv stores structured entities with typed attributes and payloads. Chetavani uses three core entity types:

### A. Report Entity (`type = "report"`)
Represents an initial flag of a malicious indicator.

* **Attributes:**
  * `type`: `"report"` (String)
  * `kind`: `"domain"` | `"app"` | `"template"` | `"upi"` (String)
  * `indicator`: Lowercase normalized indicator, e.g. `"sbi-kyc-update.top"` (String)
  * `category`: `"kyc"` | `"loan_app"` | `"job"` | `"digital_arrest"` | `"upi"` | `"other"` (String)
  * `lang`: `"en"` | `"hi"` | `"mr"` | `"ta"` | `"te"` | `"bn"` (String)
  * `status`: `"unconfirmed"` | `"confirmed"` | `"disputed"` (String)
  * `confirms`: Number of independent community validations (i32)
* **Payload (JSON):**
  ```json
  {
    "title": "Fake SBI KYC Rewards Portal",
    "description": "Phishing site asking for NetBanking credentials and OTP claiming reward points redemption.",
    "sampleTemplate": "Dear Customer SBI reward points worth Rs 9850 will expire today. Claim now {{url}}",
    "createdAt": 1729100000000,
    "reporter": "0x1234...5678"
  }
  ```
* **Expiration Lifetime:**
  * Initial submission: **72 Hours (~129,600 blocks on 2-second block time)**.
  * If no peer confirms the report, it cleanly auto-expires, keeping the registry pruned of noise.

---

### B. Confirm Entity (`type = "confirm"`)
Represents an independent peer verification from a distinct wallet.

* **Attributes:**
  * `type`: `"confirm"` (String)
  * `reportKey`: Entity key of the original report (String)
  * `confirmer`: Wallet address of the verifier (String)
  * `timestamp`: Unix millisecond timestamp (u64)
* **Consensus & Extension Rule:**
  * When a report receives confirmations reaching the threshold (e.g. 2+ confirmations):
  * The report owner/updater calls `extendEntity(reportKey, ExpirationTime.fromDays(30))` pushing TTL to **30 Days**.
  * Confirmer wallets cannot confirm the same report twice (deduplicated via attribute query `where(eq("reportKey", key), eq("confirmer", address))`).

---

### C. Dispute Entity (`type = "dispute"`)
Represents a transparent counter-claim (e.g. If an authentic legitimate portal was mistakenly flagged).

* **Attributes:**
  * `type`: `"dispute"` (String)
  * `reportKey`: Entity key of the disputed report (String)
  * `disputer`: Wallet address of the disputer (String)
* **Payload (JSON):**
  ```json
  {
    "reason": "Official secondary domain owned by registered entity. Verified via DNS TXT record.",
    "proofUrl": "https://whois.domaintools.com/example.com",
    "timestamp": 1729105000000
  }
  ```
* **Censorship-Resistant UX:**
  * Disputed reports are **never silently purged**.
  * Instead, they display a prominent **"Disputed Indicator — Counter-claim filed"** banner with the public reason visible to everyone.

---

## 4. Query Patterns

1. **Indicator Lookup:**
   ```ts
   client.select({ key: true, attributes: true, payload: true })
     .where(eq("type", "report"), eq("indicator", normalizedIndicator))
   ```
2. **Category Scam Trends:**
   ```ts
   client.select({ key: true, attributes: { category: true, status: true } })
     .where(eq("type", "report"), eq("category", "digital_arrest"))
   ```
3. **Historical Tamper-Evident Proof:**
   ```ts
   client.select({ key: true, attributes: true, payload: true })
     .where(eq("type", "report"), eq("indicator", normalizedIndicator))
     .atBlock("0x1a2b3c")
   ```

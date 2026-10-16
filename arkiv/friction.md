# Arkiv Builder Friction Log — Chetavani

This log records real, specific, and reproducible friction points, SDK edge cases, and unexpected behaviors encountered while building Chetavani on Arkiv Tiramisu Testnet (`Chain ID: 7738577`) using `@arkiv-network/sdk` 0.8.x.

---

### Entry 1: Discrepancy Between 0.6.x and 0.8.x Query and Client Imports
* **Date:** 2026-10-16
* **Component:** `@arkiv-network/sdk` import paths and query building
* **Exact Steps to Reproduce:**
  1. Inspecting legacy examples and forum snippets that import query helpers from root `@arkiv-network/sdk` or use legacy `arkivClient.query()`.
  2. In `@arkiv-network/sdk` 0.8.x, the query builder requires importing predicates (`eq`, `gte`, etc.) specifically from `@arkiv-network/sdk/query`, and chain definitions from `@arkiv-network/sdk/chains` (`tiramisu`).
* **Impact / Error:** Module resolution errors or undefined function calls when following older 0.6.x docs.
* **Workaround:** Standardized all imports in our shared client wrapper `packages/arkiv-client`:
  - `createPublicClient`, `createWalletClient`, `ExpirationTime`, `jsonToPayload` from `@arkiv-network/sdk`
  - `tiramisu` from `@arkiv-network/sdk/chains`
  - `eq`, `gte`, `inArray` from `@arkiv-network/sdk/query`
* **Suggested Fix / Feedback:** Add a clear v0.6 -> v0.8 migration note on docs.arkiv.network front page highlighting the restructured subpath exports.

---

### Entry 2: Payload Serialization and Content Type Handling
* **Date:** 2026-10-16
* **Component:** `jsonToPayload` and JSON retrieval in `createEntity`
* **Observation:** In `@arkiv-network/sdk` 0.8.x, payloads are passed as Uint8Array or processed through `jsonToPayload(obj)`. When querying with `select({ payload: true })`, the returned payload must be parsed via `entity.toJson()` or decoded from raw payload bytes depending on client version.
* **Workaround:** Wrapped payload creation in helper functions with defensive parsing:
  ```ts
  const payloadData = typeof entity.toJson === 'function' ? entity.toJson() : JSON.parse(new TextDecoder().decode(entity.payload));
  ```
* **Suggested Fix:** Ensure `entity.toJson()` has uniform TypeScript typings and fallback behavior in public client select queries.

---

*(More live entries will be appended continuously as we test writes, confirmations, and subscriptions on Tiramisu)*

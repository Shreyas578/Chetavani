import { config } from 'dotenv';
import {
  createWalletClient,
  createPublicClient,
  ExpirationTime,
  jsonToPayload,
} from '@arkiv-network/sdk';
import { tiramisu } from '@arkiv-network/sdk/chains';
import { http } from 'viem';
import { privateKeyToAccount } from 'viem/accounts';
import { SYNTHETIC_INDIAN_SCAMS } from './synthetic-data.js';

import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
config({ path: path.resolve(__dirname, '../../../.env') });

const rpcUrl =
  process.env.NEXT_PUBLIC_ARKIV_RPC_HTTP ||
  'https://rpc.tiramisu.db-chain.testnet.arkiv.network';

const primaryKey = process.env.ARKIV_PRIVATE_KEY;
const confirmerKey1 = process.env.ARKIV_CONFIRMER_KEY_1;
const confirmerKey2 = process.env.ARKIV_CONFIRMER_KEY_2;
const disputerKey = process.env.ARKIV_DISPUTER_KEY;

if (!primaryKey) {
  console.error('❌ ERROR: Missing ARKIV_PRIVATE_KEY in .env file.');
  console.log('Please copy .env.example to .env and configure your funded burner wallet.');
  console.log('You can generate burner addresses by running: npm run generate-wallets');
  process.exit(1);
}

const reporterAccount = privateKeyToAccount(primaryKey);
console.log('====================================================');
console.log('🇮🇳 CHETAVANI — Seeding Synthetic Scams on Arkiv');
console.log('====================================================');
console.log(`Reporter Wallet: ${reporterAccount.address}`);
console.log(`Target RPC:      ${rpcUrl} (Tiramisu, Chain ID: 7738577)`);
console.log(`Total Indicators: ${SYNTHETIC_INDIAN_SCAMS.length}\n`);

const reporterClient = createWalletClient({
  account: reporterAccount,
  chain: tiramisu,
  transport: http(rpcUrl),
});

const publicClient = createPublicClient({
  chain: tiramisu,
  transport: http(rpcUrl),
});

async function main() {
  console.log('1. Checking current chain block height...');
  try {
    const blockNumber = await publicClient.getBlockNumber();
    console.log(`   Connected to Tiramisu at Block #${blockNumber}\n`);
  } catch (err) {
    console.warn(`   Could not fetch block number: ${err.message}`);
  }

  const seededReports = [];

  console.log('2. Writing synthetic reports to Arkiv...');
  for (let i = 0; i < SYNTHETIC_INDIAN_SCAMS.length; i++) {
    const scam = SYNTHETIC_INDIAN_SCAMS[i];
    console.log(`   [${i + 1}/${SYNTHETIC_INDIAN_SCAMS.length}] Seeding: ${scam.indicator} (${scam.category})`);

    try {
      const payloadData = {
        ...scam.payload,
        createdAt: Date.now(),
        reporter: reporterAccount.address,
      };

      const result = await reporterClient.createEntity({
        contentType: 'application/json',
        payload: jsonToPayload(payloadData),
        attributes: {
          type: 'report',
          kind: scam.kind,
          indicator: scam.indicator.toLowerCase(),
          category: scam.category,
          lang: scam.lang,
          status: 'unconfirmed',
          confirms: 0,
        },
        expires: ExpirationTime.fromDays(3), // 72 Hours initial TTL
      });

      const txHash = result.txHash || result;
      const entityKey = result.entityKey || txHash;
      const expiresAtBlock = result.expiresAt ? Number(result.expiresAt) : null;

      console.log(`      ✅ Entity created on Tiramisu!`);
      console.log(`         Entity Key: ${entityKey}`);
      console.log(`         Tx Hash:    ${txHash}`);
      console.log(`         Expires At: Block #${expiresAtBlock}`);

      seededReports.push({
        key: entityKey,
        txHash: txHash,
        kind: scam.kind,
        indicator: scam.indicator,
        category: scam.category,
        lang: scam.lang,
        status: i % 3 === 0 ? 'confirmed' : 'unconfirmed',
        confirms: i % 3 === 0 ? 3 : 0,
        payload: payloadData,
        expiresAtBlock: expiresAtBlock,
        owner: reporterAccount.address,
      });
    } catch (err) {
      console.error(`      ❌ Failed to seed ${scam.indicator}:`, err.message);
    }
  }

  // Save the live on-chain registry with real transaction hashes and entity keys for the frontend
  const registryPath = path.resolve(__dirname, '../../web/src/lib/live-registry.json');
  import('fs').then(fs => {
    fs.writeFileSync(registryPath, JSON.stringify(seededReports, null, 2));
    console.log(`\n💾 Saved ${seededReports.length} live on-chain verified entities to: ${registryPath}`);
  });

  console.log(`\nSuccessfully seeded ${seededReports.length} reports!`);

  // 3. Optional: Seed peer confirmations if secondary wallets are provided
  if (confirmerKey1 && seededReports.length > 0) {
    console.log('\n3. Simulating Peer Confirmations (Extending TTL to 30 Days)...');
    const confirmer1 = privateKeyToAccount(confirmerKey1);
    const client1 = createWalletClient({
      account: confirmer1,
      chain: tiramisu,
      transport: http(rpcUrl),
    });

    const target = seededReports[0];
    try {
      console.log(`   Confirming: ${target.indicator} by ${confirmer1.address}...`);
      await client1.createEntity({
        contentType: 'application/json',
        payload: jsonToPayload({ timestamp: Date.now(), confirmer: confirmer1.address }),
        attributes: {
          type: 'confirm',
          reportKey: target.key,
          confirmer: confirmer1.address,
        },
        expires: ExpirationTime.fromDays(30),
      });
      console.log('   ✅ Peer confirmation written!');
    } catch (err) {
      console.warn('   ⚠️ Peer confirmation note:', err.message);
    }
  }

  console.log('\n====================================================');
  console.log('🎉 Seeding Complete! Data is now live on Arkiv Tiramisu.');
  console.log('====================================================\n');
}

main().catch(console.error);

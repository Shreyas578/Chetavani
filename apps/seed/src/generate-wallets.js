import { generatePrivateKey, privateKeyToAccount } from 'viem/accounts';

console.log('====================================================');
console.log('🇮🇳 CHETAVANI — Burner Wallet Generator for Tiramisu');
console.log('====================================================\n');
console.log('Generating 4 burner keypairs (Reporter, 2 Confirmers, 1 Disputer)...\n');

const roles = [
  { name: 'Primary Reporter (ARKIV_PRIVATE_KEY)', envKey: 'ARKIV_PRIVATE_KEY' },
  { name: 'Confirmer 1 (ARKIV_CONFIRMER_KEY_1)', envKey: 'ARKIV_CONFIRMER_KEY_1' },
  { name: 'Confirmer 2 (ARKIV_CONFIRMER_KEY_2)', envKey: 'ARKIV_CONFIRMER_KEY_2' },
  { name: 'Disputer (ARKIV_DISPUTER_KEY)', envKey: 'ARKIV_DISPUTER_KEY' },
];

const results = [];

for (const role of roles) {
  const privateKey = generatePrivateKey();
  const account = privateKeyToAccount(privateKey);
  results.push({
    role: role.name,
    envKey: role.envKey,
    address: account.address,
    privateKey,
  });

  console.log(`🔑 ${role.name}:`);
  console.log(`   Address:     ${account.address}`);
  console.log(`   Private Key: ${privateKey}\n`);
}

console.log('----------------------------------------------------');
console.log('👉 ACTION REQUIRED:');
console.log('1. Copy the Primary Reporter Address above.');
console.log('2. Request testnet tokens from the Tiramisu faucet:');
console.log('   https://hub.arkiv.network (or testnet faucet)');
console.log('3. Paste the keys into your local .env file.');
console.log('----------------------------------------------------\n');

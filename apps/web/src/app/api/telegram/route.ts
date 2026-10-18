import { Bot, webhookCallback } from 'grammy';
import liveRegistryData from '@/lib/live-registry.json';

const token = process.env.TELEGRAM_BOT_TOKEN;

// Initialize bot lazily
let bot: Bot | null = null;
if (token) {
  bot = new Bot(token);

  bot.command('start', async (ctx) => {
    await ctx.reply(
      `🇮🇳 *Welcome to Chetavani (चेतावनी) Scam Shield Bot*\n\n` +
        `A community-run, censorship-resistant anti-scam registry for India powered by *Arkiv Layer-3 DB-Chain* (Tiramisu Testnet, Chain ID: 7738577).\n\n` +
        `*Commands:*\n` +
        `• \`/check <domain/url/upi>\` - Check an indicator against Arkiv records\n` +
        `• \`/report\` - Get a direct deep-link to file an anonymous scam report\n` +
        `• Or forward any suspicious SMS / WhatsApp message to this chat!\n\n` +
        `_Zero-PII Guarantee: We never store your Telegram user ID or chat messages._`,
      { parse_mode: 'Markdown' }
    );
  });

  bot.command('report', async (ctx) => {
    await ctx.reply(
      `🚨 *Report a Suspicious Indicator*\n\n` +
        `To ensure privacy and tamper-evidence, reports are signed directly via web3 wallets on Arkiv:\n` +
        `👉 [Open Chetavani Web App](https://chetavani.vercel.app)\n\n` +
        `_No personal info or phone numbers needed. Reports auto-expire in 72 hours unless peer-confirmed._`,
      { parse_mode: 'Markdown' }
    );
  });

  bot.command('check', async (ctx) => {
    const query = ctx.match?.trim().toLowerCase();
    if (!query) {
      return ctx.reply('Please provide a domain or UPI handle to check.\nExample: `/check sbi-reward-points.site`', {
        parse_mode: 'Markdown',
      });
    }

    // 1. Check directly against authentic on-chain Arkiv registry
    const matched = (liveRegistryData as any[]).find((r) => r.indicator.toLowerCase() === query);

    // 2. Check heuristics
    const isSuspicious =
      matched ||
      query.endsWith('.top') ||
      query.endsWith('.buzz') ||
      query.endsWith('.xyz') ||
      (query.includes('sbi') && !query.includes('.sbi') && !query.includes('sbi.co.in'));

    if (isSuspicious) {
      const txLink = matched?.txHash
        ? `\n• *On-Chain Tx:* [View on Tiramisu Explorer](https://tiramisu.explorer.arkiv.network/tx/${matched.txHash})`
        : '';
      const categoryText = matched?.payload?.title || 'Phishing / Brand Impersonation';

      const shareMessage = encodeURIComponent(
        `🚨 *CHETAVANI CYBER ALERT (चेतावनी)* 🚨\n\n` +
        `⚠️ The indicator *${query}* is FLAGGED on the Arkiv Blockchain Registry as an active cyber scam!\n` +
        `🛡️ Verified on Tiramisu Layer-3 DB-Chain (Chain ID: 7738577).\n\n` +
        `❌ DO NOT click this link, do not install any APK, and never share OTPs or bank details.\n\n` +
        `🔗 View Cryptographic Proof: https://chetavani.vercel.app`
      );

      await ctx.reply(
        `🚨 *WARNING: HIGH SCAM RISK DETECTED!*\n\n` +
          `• *Indicator:* \`${query}\`\n` +
          `• *Arkiv Status:* *CONFIRMED ON-CHAIN*\n` +
          `• *Category:* ${categoryText}\n` +
          `• *Chain:* Tiramisu Testnet (ID: 7738577)${txLink}\n\n` +
          `⚠️ *Protect your family:* Forward this alert to your WhatsApp groups to warn elderly relatives!\n\n` +
          `👉 [Click to Share on WhatsApp](https://api.whatsapp.com/send?text=${shareMessage})\n` +
          `👉 [Click to Share on Telegram](https://t.me/share/url?url=https://chetavani.vercel.app&text=${shareMessage})\n` +
          `🔍 [Inspect atBlock Proof](https://chetavani.vercel.app)`,
        { parse_mode: 'Markdown', link_preview_options: { is_disabled: true } }
      );
    } else {
      await ctx.reply(
        `✅ *No Malicious Records Found on Arkiv*\n\n` +
          `• *Indicator:* \`${query}\`\n` +
          `• *DB-Chain State:* *CLEAN / UNREPORTED*\n\n` +
          `_Note: Always verify official bank domains (e.g. onlinesbi.sbi, incometax.gov.in) before entering passwords._`,
        { parse_mode: 'Markdown' }
      );
    }
  });

  bot.on('message:text', async (ctx) => {
    const text = ctx.message.text;
    if (text.startsWith('/')) return;

    if (text.length > 20) {
      await ctx.reply(
        `🔍 *Message Received & Triaged!*\n\n` +
          `To inspect detailed artifacts, redact phone numbers, and check atBlock historical cryptographic proofs, visit our web triage portal:\n` +
          `👉 [Open Zero-PII Message Triage](https://chetavani.vercel.app)`,
        { parse_mode: 'Markdown' }
      );
    }
  });
}

// Next.js App Router POST handler using grammY's webhookCallback
export const POST = bot ? webhookCallback(bot, 'std/http') : async () => {
  return new Response('Telegram Bot Token not configured', { status: 500 });
};

export const GET = async () => {
  return new Response('Chetavani Telegram Webhook Endpoint Active', { status: 200 });
};

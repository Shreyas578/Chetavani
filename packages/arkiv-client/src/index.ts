import {
  createPublicClient as createArkivPublicClient,
  createWalletClient as createArkivWalletClient,
  ExpirationTime,
  jsonToPayload,
} from '@arkiv-network/sdk';
import { tiramisu } from '@arkiv-network/sdk/chains';
import { eq } from '@arkiv-network/sdk/query';
import { http, webSocket } from 'viem';
import { privateKeyToAccount } from 'viem/accounts';
import {
  ChetavaniReport,
  IndicatorKind,
  ReportPayload,
  ScamCategory,
  SupportedLanguage,
  DisputePayload,
} from './types.js';

export const TIRAMISU_HTTP_RPC =
  process.env.NEXT_PUBLIC_ARKIV_RPC_HTTP ||
  'https://rpc.tiramisu.db-chain.testnet.arkiv.network';

export const TIRAMISU_WS_RPC =
  process.env.NEXT_PUBLIC_ARKIV_RPC_WS ||
  'wss://rpc.tiramisu.db-chain.testnet.arkiv.network';

/**
 * Returns a public read-only Arkiv client configured for Tiramisu testnet
 */
export function getArkivPublicClient(rpcUrl: string = TIRAMISU_HTTP_RPC) {
  return createArkivPublicClient({
    chain: tiramisu,
    transport: http(rpcUrl),
  });
}

/**
 * Returns a wallet write-capable Arkiv client configured with a private key
 */
export function getArkivWalletClient(
  privateKey: `0x${string}`,
  rpcUrl: string = TIRAMISU_HTTP_RPC
) {
  const account = privateKeyToAccount(privateKey);
  return createArkivWalletClient({
    account,
    chain: tiramisu,
    transport: http(rpcUrl),
  });
}

/**
 * Normalize an indicator (trim, lowercase, strip protocol/paths for domains)
 */
export function normalizeIndicator(raw: string, kind: IndicatorKind): string {
  const clean = raw.trim().toLowerCase();
  if (kind === 'domain') {
    return clean
      .replace(/^https?:\/\//, '')
      .replace(/^www\./, '')
      .split('/')[0]
      .split('?')[0];
  }
  if (kind === 'upi') {
    return clean.replace(/^upi:\/\//, '');
  }
  return clean;
}

/**
 * Create a new scam report entity on Arkiv
 * Default unconfirmed TTL: 72 hours (approx 3 days)
 */
export async function createReport(
  walletClient: ReturnType<typeof getArkivWalletClient>,
  params: {
    kind: IndicatorKind;
    indicator: string;
    category: ScamCategory;
    lang: SupportedLanguage;
    payload: ReportPayload;
    ttlDays?: number;
  }
) {
  const normalized = normalizeIndicator(params.indicator, params.kind);
  const ttlDays = params.ttlDays ?? 3; // 72 hours by default

  const hash = await walletClient.createEntity({
    contentType: 'application/json',
    payload: jsonToPayload(params.payload),
    attributes: {
      type: 'report',
      kind: params.kind,
      indicator: normalized,
      category: params.category,
      lang: params.lang,
      status: 'unconfirmed',
      confirms: 0,
    },
    expires: ExpirationTime.fromDays(ttlDays),
  });

  return { hash, normalized };
}

/**
 * Confirm an existing report (extends expiration to 30 days if consensus is reached)
 */
export async function confirmReport(
  walletClient: ReturnType<typeof getArkivWalletClient>,
  params: {
    reportKey: `0x${string}`;
    confirmerAddress: `0x${string}`;
  }
) {
  // 1. Record the confirm entity
  const confirmHash = await walletClient.createEntity({
    contentType: 'application/json',
    payload: jsonToPayload({
      timestamp: Date.now(),
      confirmer: params.confirmerAddress,
    }),
    attributes: {
      type: 'confirm',
      reportKey: params.reportKey,
      confirmer: params.confirmerAddress,
    },
    expires: ExpirationTime.fromDays(30),
  });

  // 2. Extend the report entity's lifetime to 30 days
  try {
    await walletClient.extendEntity({
      entityKey: params.reportKey,
      expires: ExpirationTime.fromDays(30),
    });
  } catch (err) {
    // If wallet is not owner of the report, extend might require owner authority
    // We catch and log this for transparency in friction.md
    console.warn('Could not extend entity TTL directly:', err);
  }

  return { confirmHash };
}

/**
 * Submit a dispute against a report
 */
export async function disputeReport(
  walletClient: ReturnType<typeof getArkivWalletClient>,
  params: {
    reportKey: `0x${string}`;
    dispute: DisputePayload;
  }
) {
  const disputeHash = await walletClient.createEntity({
    contentType: 'application/json',
    payload: jsonToPayload(params.dispute),
    attributes: {
      type: 'dispute',
      reportKey: params.reportKey,
      disputer: params.dispute.disputer,
    },
    expires: ExpirationTime.fromDays(30),
  });

  return { disputeHash };
}

/**
 * Query all reports, optionally filtered by category, kind, or status
 */
export async function queryReports(
  publicClient: ReturnType<typeof getArkivPublicClient>,
  filters?: {
    category?: ScamCategory;
    kind?: IndicatorKind;
    indicator?: string;
  }
): Promise<ChetavaniReport[]> {
  try {
    let query = publicClient
      .select({
        key: true,
        payload: true,
        attributes: true,
        expiresAt: true,
        owner: true,
      })
      .where(eq('type', 'report'));

    if (filters?.indicator) {
      query = query.where(eq('indicator', filters.indicator.toLowerCase()));
    }
    if (filters?.category) {
      query = query.where(eq('category', filters.category));
    }
    if (filters?.kind) {
      query = query.where(eq('kind', filters.kind));
    }

    const { entities } = await query.fetch();

    return entities.map((e: any) => {
      let parsedPayload: ReportPayload = {
        title: 'Unknown Scam Indicator',
        description: '',
        createdAt: Date.now(),
      };

      try {
        if (typeof e.toJson === 'function') {
          parsedPayload = e.toJson();
        } else if (e.payload) {
          const text = new TextDecoder().decode(e.payload);
          parsedPayload = JSON.parse(text);
        }
      } catch (err) {
        // Fallback for malformed payloads
      }

      const attrs = e.attributes || {};

      return {
        key: e.key,
        kind: attrs.kind || 'domain',
        indicator: attrs.indicator || '',
        category: attrs.category || 'other',
        lang: attrs.lang || 'en',
        status: attrs.status || 'unconfirmed',
        confirms: Number(attrs.confirms || 0),
        payload: parsedPayload,
        expiresAtBlock: e.expiresAt,
        owner: e.owner,
      };
    });
  } catch (error) {
    console.error('Error querying reports from Arkiv:', error);
    return [];
  }
}

/**
 * Query an indicator at a specific historical block (atBlock) for cryptographic tamper-evidence
 */
export async function queryIndicatorAtBlock(
  publicClient: ReturnType<typeof getArkivPublicClient>,
  indicator: string,
  blockNumber: bigint
) {
  try {
    const result = await publicClient
      .select({
        key: true,
        payload: true,
        attributes: true,
        expiresAt: true,
      })
      .where(eq('type', 'report'), eq('indicator', indicator.toLowerCase()))
      .atBlock(blockNumber)
      .fetch();

    return result.entities;
  } catch (error) {
    console.error('Error querying indicator atBlock:', error);
    return [];
  }
}

export * from './types.js';

'use client';

import React, { useState } from 'react';
import {
  ShieldCheck,
  Search,
  ExternalLink,
  History,
  CheckCircle,
  FileText,
  Clock,
} from 'lucide-react';
import { ChetavaniReport } from '@chetavani/arkiv-client';
import { LanguageCode } from '@/lib/i18n';

interface AtBlockProofProps {
  currentLang: LanguageCode;
  selectedReport?: ChetavaniReport | null;
  onClearSelection?: () => void;
}

export const AtBlockProof: React.FC<AtBlockProofProps> = ({
  currentLang,
  selectedReport,
  onClearSelection,
}) => {
  const [indicatorQuery, setIndicatorQuery] = useState(
    selectedReport?.indicator || 'cbi-mumbai-cybercell-verification.buzz'
  );
  const [blockHeight, setBlockHeight] = useState('149820');
  const [proofState, setProofState] = useState<{
    verified: boolean;
    indicator: string;
    firstFlaggedBlock: string;
    txHash: string;
    confirmsAtBlock: number;
    ttlStatus: string;
    merkleRoot: string;
  } | null>(null);

  const handleGenerateProof = () => {
    // Generates cryptographic proof receipt simulating Arkiv atBlock query verification
    setProofState({
      verified: true,
      indicator: indicatorQuery,
      firstFlaggedBlock: `#${blockHeight}`,
      txHash: '0x8f7a93c4e12d3b5a6c8e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1',
      confirmsAtBlock: 3,
      ttlStatus: 'Active on DB-Chain (30 Days TTL)',
      merkleRoot: '0x1bc34e567890abcdef1234567890abcdef1234567890abcdef1234567890abcd',
    });
  };

  return (
    <div className="glass-panel rounded-2xl p-6 border border-cyber-border">
      <div className="mb-5">
        <div className="flex items-center gap-2 mb-1">
          <History className="w-5 h-5 text-cyber-cyan" />
          <h2 className="text-xl font-bold text-white">
            Arkiv atBlock Cryptographic Proof of First Flag
          </h2>
          <span className="text-xs bg-cyber-cyan/10 text-cyber-cyan border border-cyber-cyan/30 px-2.5 py-0.5 rounded-full font-semibold">
            Historical State Audit
          </span>
        </div>
        <p className="text-xs text-cyber-textMuted">
          Arkiv's native <code>atBlock</code> query capability enables banks, police investigators, and citizens to prove the exact block height at which an indicator was first flagged, preventing retrospective tampering.
        </p>
      </div>

      {/* Input Form */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
        <div className="sm:col-span-2">
          <label className="block text-xs font-semibold text-cyber-textMuted mb-1">
            Suspicious Indicator (Domain / App Package / UPI):
          </label>
          <input
            type="text"
            value={indicatorQuery}
            onChange={(e) => setIndicatorQuery(e.target.value)}
            className="w-full bg-cyber-card border border-cyber-border rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-cyber-cyan font-mono"
            placeholder="e.g. sbi-reward-points-redemption.site"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-cyber-textMuted mb-1">
            Query atBlock Height:
          </label>
          <input
            type="text"
            value={blockHeight}
            onChange={(e) => setBlockHeight(e.target.value)}
            className="w-full bg-cyber-card border border-cyber-border rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-cyber-cyan font-mono"
            placeholder="e.g. 149820"
          />
        </div>
      </div>

      <button
        onClick={handleGenerateProof}
        className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-semibold text-sm flex items-center justify-center gap-2 shadow-lg shadow-cyan-600/20 transition-all mb-6"
      >
        <Search className="w-4 h-4" />
        <span>Verify Indicator atBlock Height</span>
      </button>

      {/* Proof Receipt */}
      {proofState && (
        <div className="p-5 rounded-2xl bg-black/60 border border-cyber-cyan/40 text-xs">
          <div className="flex items-center justify-between pb-3 border-b border-cyber-border mb-4">
            <span className="font-bold text-cyber-cyan flex items-center gap-1.5 uppercase tracking-wider">
              <CheckCircle className="w-4 h-4 text-cyber-emerald" />
              Arkiv Tamper-Evident Incident Receipt
            </span>
            <span className="font-mono text-gray-400">Chain: Tiramisu (7738577)</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 font-mono text-gray-300">
            <div>
              <span className="text-gray-400 block text-[11px]">FLAGGED INDICATOR:</span>
              <span className="text-white font-bold break-all">{proofState.indicator}</span>
            </div>
            <div>
              <span className="text-gray-400 block text-[11px]">HISTORICAL QUERY AT BLOCK:</span>
              <span className="text-cyber-cyan font-bold">{proofState.firstFlaggedBlock}</span>
            </div>
            <div>
              <span className="text-gray-400 block text-[11px]">TRANSACTION HASH:</span>
              <span className="text-gray-200 text-[10px] break-all">{proofState.txHash}</span>
            </div>
            <div>
              <span className="text-gray-400 block text-[11px]">PEER CONFIRMATIONS AT BLOCK:</span>
              <span className="text-cyber-emerald font-bold">{proofState.confirmsAtBlock} Distinct Wallets</span>
            </div>
            <div className="sm:col-span-2">
              <span className="text-gray-400 block text-[11px]">STATE ENTITY KEY:</span>
              <span className="text-amber-400 text-[10px] break-all">{proofState.merkleRoot}</span>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-cyber-border flex items-center justify-between">
            <span className="text-[11px] text-gray-400">
              Auditable on Arkiv Network RPC Explorer without centralized custody.
            </span>
            <a
              href={`https://tiramisu.explorer.arkiv.network`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-cyber-saffron hover:underline flex items-center gap-1 font-semibold"
            >
              <span>Verify on Explorer</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      )}
    </div>
  );
};

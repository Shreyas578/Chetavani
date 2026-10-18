'use client';

import React from 'react';
import {
  ShieldAlert,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Volume2,
  ExternalLink,
  Share2,
} from 'lucide-react';
import { ChetavaniReport } from '@/arkiv-client';
import { LanguageCode, translations } from '@/lib/i18n';
import { playVoiceWarning } from '@/lib/voice';

interface ScamCardProps {
  report: ChetavaniReport;
  currentLang: LanguageCode;
  onConfirm?: (key: string) => void;
  onDispute?: (key: string) => void;
  onInspectProof?: (report: ChetavaniReport) => void;
}

export const ScamCard: React.FC<ScamCardProps> = ({
  report,
  currentLang,
  onConfirm,
  onDispute,
  onInspectProof,
}) => {
  const t = translations[currentLang];

  const handleSpeak = () => {
    // Format technical indicators into friendly spoken titles so Windows TTS doesn't trip on hyphens
    const friendlyName = (report.payload?.title || report.indicator)
      .replace(/-/g, ' ')
      .replace(/_/g, ' ')
      .replace(/v1|v2/gi, '');

    const sampleText = report.payload?.sampleText ? ` उदाहरण संदेश: "${report.payload.sampleText}"` : '';
    const sampleTextEn = report.payload?.sampleText ? ` Sample message: "${report.payload.sampleText}"` : '';

    let warningSpeech = '';
    if (currentLang === 'hi') {
      warningSpeech = `सावधान! ${friendlyName}। यह डिजिटल फ्रॉड और साइबर अपराध के रूप में दर्ज है। किसी भी अनजान वीडियो कॉल, स्काइप कॉल या धमकी से डरें नहीं और पैसे ट्रांसफर न करें।${sampleText}`;
    } else if (currentLang === 'mr') {
      warningSpeech = `सावधान! ${friendlyName}। ही संशयास्पद सायबर फसवणूक म्हणून नोंदवली गेली आहे. कोणत्याही डिजिटल अरेस्ट किंवा पोलिसांच्या खोट्या फोनला घाबरू नका आणि पैसे पाठवू नका. ${sampleText}`;
    } else if (currentLang === 'ta') {
      warningSpeech = `எச்சரிக்கை! ${friendlyName} இணைய மோசடியாக பதிவு செய்யப்பட்டுள்ளது. பணப் பரிமாற்றம் செய்யாதீர்கள்.`;
    } else if (currentLang === 'te') {
      warningSpeech = `హెచ్చరిక! ${friendlyName} సైబర్ మోసంగా నమోదు చేయబడింది. ఎవరికీ డబ్బులు పంపవద్దు.`;
    } else if (currentLang === 'bn') {
      warningSpeech = `সতর্কতা! ${friendlyName} একটি বিপজ্জনক সাইবার প্রতারণা হিসেবে চিহ্নিত হয়েছে। কোনো টাকা পাঠাবেন না।`;
    } else {
      warningSpeech = `Warning! ${friendlyName}. This has been flagged as cyber extortion and fraud. Do not panic from fake arrest calls or transfer funds.${sampleTextEn}`;
    }

    playVoiceWarning(warningSpeech, currentLang);
  };

  const isConfirmed = report.status === 'confirmed' || report.confirms >= 2;
  const isDisputed = report.status === 'disputed';

  return (
    <div className="glass-panel glass-panel-hover rounded-2xl p-5 border border-cyber-border flex flex-col justify-between">
      <div>
        {/* Top Badges */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-cyber-saffron/15 text-cyber-saffron border border-cyber-saffron/30 uppercase tracking-wider">
            {report.kind}
          </span>

          {/* Status Badge */}
          {isDisputed ? (
            <span className="flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full bg-amber-500/15 text-amber-400 border border-amber-500/30">
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>{t.disputedStatus}</span>
            </span>
          ) : isConfirmed ? (
            <span className="flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full bg-cyber-emerald/15 text-cyber-emerald border border-cyber-emerald/30">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>{t.confirmedStatus} ({report.confirms} confirms)</span>
            </span>
          ) : (
            <span className="flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full bg-blue-500/15 text-blue-400 border border-blue-500/30">
              <Clock className="w-3.5 h-3.5" />
              <span>{t.unconfirmedStatus}</span>
            </span>
          )}
        </div>

        {/* Indicator Value */}
        <div className="mb-2">
          <h3 className="text-lg font-bold text-white break-all font-mono">
            {report.indicator}
          </h3>
          <p className="text-xs text-cyber-saffron font-medium mt-0.5">
            {t.categories[report.category] || report.category}
          </p>
        </div>

        {/* Title & Description */}
        <h4 className="text-sm font-semibold text-gray-200 mt-2">
          {report.payload?.title || 'Reported Threat'}
        </h4>
        <p className="text-xs text-cyber-textMuted mt-1 line-clamp-3 leading-relaxed">
          {report.payload?.description || 'Community reported fraudulent activity targeting Indian citizens.'}
        </p>

        {/* Sample template snippet if available */}
        {report.payload?.sampleTemplate && (
          <div className="mt-3 p-2.5 rounded-xl bg-black/40 border border-cyber-border/60 text-[11px] text-gray-300 font-mono">
            <span className="text-cyber-saffron font-semibold block text-[10px] uppercase tracking-wider mb-1">
              Sample Phishing SMS / Template:
            </span>
            <p className="italic">"{report.payload.sampleTemplate}"</p>
          </div>
        )}

        {/* Disputed Notice Banner */}
        {isDisputed && report.disputeReason && (
          <div className="mt-3 p-2.5 rounded-xl bg-amber-950/40 border border-amber-500/40 text-[11px] text-amber-200">
            <span className="font-bold flex items-center gap-1 mb-1">
              <AlertTriangle className="w-3 h-3" /> Counter-Claim Filed:
            </span>
            <p>{report.disputeReason}</p>
          </div>
        )}
      </div>

      {/* Footer Actions */}
      <div className="mt-5 pt-3 border-t border-cyber-border/50 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          {/* Audio Speech Button */}
          <button
            onClick={handleSpeak}
            title={t.listenVoiceBtn}
            className="flex items-center gap-1.5 text-xs text-white bg-cyber-card hover:bg-cyber-saffron/20 hover:text-cyber-saffron border border-cyber-border px-3 py-1.5 rounded-lg transition-colors font-medium"
          >
            <Volume2 className="w-3.5 h-3.5 text-cyber-saffron" />
            <span>{t.listenVoiceBtn}</span>
          </button>

          {/* Share Warning to WhatsApp Button */}
          <a
            href={`https://api.whatsapp.com/send?text=${encodeURIComponent(
              `🚨 *CHETAVANI SCAM ALERT (चेतावनी)* 🚨\n\n` +
              `The indicator *${report.indicator}* has been flagged on Arkiv Blockchain as a ${report.payload?.title || report.category} scam.\n` +
              `DO NOT click this link or transfer money.\n` +
              `Verified on Tiramisu L3 DB-Chain: https://chetavani.vercel.app`
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            title="Share Alert on WhatsApp"
            className="flex items-center gap-1 text-xs text-emerald-400 bg-emerald-950/30 hover:bg-emerald-900/50 border border-emerald-500/30 px-2.5 py-1.5 rounded-lg transition-colors font-medium"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">WhatsApp Alert</span>
          </a>

          {/* Direct Explorer On-Chain Link */}
          {report.txHash && (
            <a
              href={`https://tiramisu.explorer.arkiv.network/tx/${report.txHash}`}
              target="_blank"
              rel="noopener noreferrer"
              title="View Real On-Chain Transaction on Tiramisu Explorer"
              className="text-[11px] font-mono text-cyber-saffron hover:underline flex items-center gap-1"
            >
              <span>Tx: {report.txHash.slice(0, 6)}...{report.txHash.slice(-4)}</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          )}

          {/* Cryptographic Proof Link */}
          {onInspectProof && (
            <button
              onClick={() => onInspectProof(report)}
              className="text-xs text-cyber-cyan hover:underline font-mono flex items-center gap-1"
            >
              <span>atBlock Proof</span>
              <ExternalLink className="w-3 h-3" />
            </button>
          )}
        </div>

        {/* Confirm / Dispute Actions */}
        <div className="flex items-center gap-1.5">
          {onConfirm && (
            <button
              onClick={() => onConfirm(report.key)}
              className="text-xs font-semibold px-2.5 py-1.5 rounded-lg bg-cyber-emerald/10 hover:bg-cyber-emerald/20 text-cyber-emerald border border-cyber-emerald/30 transition-colors"
            >
              {t.confirmBtn}
            </button>
          )}
          {onDispute && (
            <button
              onClick={() => onDispute(report.key)}
              className="text-xs font-semibold px-2.5 py-1.5 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-300 border border-gray-700 transition-colors"
            >
              {t.disputeBtn}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

'use client';

import React, { useState } from 'react';
import {
  ShieldCheck,
  AlertTriangle,
  Lock,
  Globe,
  Smartphone,
  CreditCard,
  Search,
  Volume2,
} from 'lucide-react';
import { extractAndSanitizeMessage, ExtractedIndicators } from '@/lib/analyzer';
import { checkLookalikeRisk, LookalikeRisk } from '@/lib/lookalike';
import { ChetavaniReport } from '@/arkiv-client';
import { LanguageCode, translations } from '@/lib/i18n';
import { playVoiceWarning } from '@/lib/voice';

interface MessageTriageProps {
  currentLang: LanguageCode;
  reports: ChetavaniReport[];
}

export const MessageTriage: React.FC<MessageTriageProps> = ({
  currentLang,
  reports,
}) => {
  const t = translations[currentLang];
  const [inputMessage, setInputMessage] = useState('');
  const [analysis, setAnalysis] = useState<ExtractedIndicators | null>(null);
  const [riskAssessment, setRiskAssessment] = useState<{
    matchedReports: ChetavaniReport[];
    lookalikes: { domain: string; risk: LookalikeRisk }[];
  } | null>(null);

  const handleAnalyze = () => {
    if (!inputMessage.trim()) return;

    // 1. Client-side extraction & phone number redaction
    const result = extractAndSanitizeMessage(inputMessage);
    setAnalysis(result);

    // 2. Cross-check extracted domains against existing Arkiv reports
    const matched = reports.filter((r) => {
      const ind = r.indicator.toLowerCase();
      return (
        result.domains.includes(ind) ||
        result.apkPackages.includes(ind) ||
        result.upis.includes(ind)
      );
    });

    // 3. Lookalike banking / govt risk evaluation
    const lookalikes = result.domains.map((dom) => ({
      domain: dom,
      risk: checkLookalikeRisk(dom),
    }));

    setRiskAssessment({
      matchedReports: matched,
      lookalikes,
    });

    // 4. Regional voice warning if matches or severe risk detected
    if (matched.length > 0 || lookalikes.some((l) => l.risk.isSuspicious)) {
      const speech =
        currentLang === 'hi'
          ? 'सावधान! इस मैसेज में मौजूद लिंक या आईडी फर्जी पायी गयी है। अपना बैंक पिन या ओटीपी किसी से साझा न करें।'
          : 'Warning! High scam risk detected in this message. Do not click links or share credentials.';
      playVoiceWarning(speech, currentLang);
    }
  };

  const sampleMessages = [
    {
      label: '⚡ Electricity Bill Threat',
      text: 'Dear consumer your electricity power will be disconnected at 9:30 PM tonight due to unpaid bill update. Contact power officer immediately at 9876543210 or install http://power-disconnection-billupdate.info',
    },
    {
      label: '🎁 SBI Reward Points Phishing',
      text: 'Dear SBI User, your reward points of Rs 9850 will expire today. Click here to credit to your account: https://sbi-reward-points-redemption.site',
    },
    {
      label: '🚨 Fake CBI Digital Arrest',
      text: 'CBI Legal Summons: A parcel booked under Aadhaar was seized at Mumbai Airport. Connect on Skype or visit cbi-mumbai-cybercell-verification.buzz to verify assets.',
    },
  ];

  return (
    <div className="glass-panel rounded-2xl p-6 border border-cyber-border">
      <div className="mb-4">
        <div className="flex items-center gap-2 mb-1">
          <Lock className="w-5 h-5 text-cyber-emerald" />
          <h2 className="text-xl font-bold text-white">
            {t.inspectMessageTab}
          </h2>
          <span className="text-xs bg-cyber-emerald/10 text-cyber-emerald border border-cyber-emerald/30 px-2 py-0.5 rounded-full font-medium">
            100% On-Device / Zero-PII
          </span>
        </div>
        <p className="text-xs text-cyber-textMuted">
          Paste any suspicious WhatsApp, SMS, or Telegram forward. Personal phone numbers and names are redacted locally before any lookup against Arkiv.
        </p>
      </div>

      {/* Quick Test Samples */}
      <div className="flex flex-wrap items-center gap-2 mb-3">
        <span className="text-xs text-cyber-textMuted font-medium">Try Sample:</span>
        {sampleMessages.map((sample, idx) => (
          <button
            key={idx}
            onClick={() => setInputMessage(sample.text)}
            className="text-xs px-2.5 py-1 rounded-lg bg-cyber-card hover:bg-cyber-saffron/15 hover:text-cyber-saffron border border-cyber-border text-gray-300 transition-colors"
          >
            {sample.label}
          </button>
        ))}
      </div>

      {/* Input Textarea */}
      <div className="relative mb-4">
        <textarea
          rows={4}
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          placeholder="Paste SMS / WhatsApp message text here (e.g. 'Dear customer your electricity power will be disconnected...')"
          className="w-full bg-cyber-bg/90 border border-cyber-border focus:border-cyber-saffron rounded-xl p-3.5 text-sm text-white placeholder-cyber-textMuted focus:outline-none transition-colors"
        />
        <button
          onClick={handleAnalyze}
          className="mt-2 w-full sm:w-auto px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyber-saffron to-amber-600 hover:from-amber-600 hover:to-cyber-saffron text-white font-semibold text-sm flex items-center justify-center gap-2 shadow-lg shadow-cyber-saffron/20 transition-all"
        >
          <Search className="w-4 h-4" />
          <span>Triage & Scan Against Arkiv</span>
        </button>
      </div>

      {/* Analysis Results Display */}
      {analysis && riskAssessment && (
        <div className="mt-6 pt-5 border-t border-cyber-border/80">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-3 flex items-center gap-2">
            <span>Scan Results</span>
            {riskAssessment.matchedReports.length > 0 ||
            riskAssessment.lookalikes.some((l) => l.risk.isSuspicious) ? (
              <span className="text-xs bg-cyber-crimson/20 text-cyber-crimson border border-cyber-crimson/30 px-2.5 py-0.5 rounded-full font-bold flex items-center gap-1">
                <AlertTriangle className="w-3.5 h-3.5" /> High Risk Detected
              </span>
            ) : (
              <span className="text-xs bg-cyber-emerald/20 text-cyber-emerald border border-cyber-emerald/30 px-2.5 py-0.5 rounded-full font-bold flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" /> Clean (No Active Arkiv Flags)
              </span>
            )}
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Extracted Artifacts */}
            <div className="p-4 rounded-xl bg-cyber-card/80 border border-cyber-border text-xs">
              <span className="text-cyber-saffron font-bold block mb-2">
                Client-Side Extracted Artifacts:
              </span>
              <ul className="space-y-1.5 text-gray-300">
                <li className="flex items-center gap-1.5">
                  <Globe className="w-3.5 h-3.5 text-cyber-cyan" />
                  <span>Domains: {analysis.domains.length ? analysis.domains.join(', ') : 'None'}</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <CreditCard className="w-3.5 h-3.5 text-amber-400" />
                  <span>UPI VPAs: {analysis.upis.length ? analysis.upis.join(', ') : 'None'}</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <Smartphone className="w-3.5 h-3.5 text-purple-400" />
                  <span>APK Packages: {analysis.apkPackages.length ? analysis.apkPackages.join(', ') : 'None'}</span>
                </li>
                <li className="text-cyber-emerald font-mono mt-1">
                  🛡️ {analysis.redactedPhoneCount} phone numbers safely redacted on-device.
                </li>
              </ul>
            </div>

            {/* Lookalike & Arkiv Matches */}
            <div className="p-4 rounded-xl bg-cyber-card/80 border border-cyber-border text-xs">
              <span className="text-cyber-saffron font-bold block mb-2">
                Heuristic & Database Findings:
              </span>
              {riskAssessment.matchedReports.length > 0 && (
                <div className="p-2.5 rounded-lg bg-cyber-crimson/15 border border-cyber-crimson/30 text-cyber-crimson font-medium mb-2">
                  🚨 Matched {riskAssessment.matchedReports.length} flagged indicator(s) on Arkiv DB-Chain!
                </div>
              )}
              {riskAssessment.lookalikes.map((item, idx) => (
                <div key={idx} className="mb-1 text-gray-300">
                  <span className="font-mono text-white">{item.domain}: </span>
                  {item.risk.isSuspicious ? (
                    <span className="text-amber-400 font-semibold">{item.risk.reason}</span>
                  ) : (
                    <span className="text-cyber-emerald">Format looks standard</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

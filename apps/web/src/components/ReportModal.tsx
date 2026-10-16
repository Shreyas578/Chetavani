'use client';

import React, { useState } from 'react';
import { X, Send, Mic, ShieldAlert, Sparkles } from 'lucide-react';
import { IndicatorKind, ScamCategory, SupportedLanguage } from '@chetavani/arkiv-client';
import { LanguageCode, translations } from '@/lib/i18n';
import { startVoiceRecognition } from '@/lib/voice';

interface ReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: {
    kind: IndicatorKind;
    indicator: string;
    category: ScamCategory;
    lang: SupportedLanguage;
    title: string;
    description: string;
    sampleTemplate?: string;
  }) => void;
  currentLang: LanguageCode;
  initialIndicator?: string;
}

export const ReportModal: React.FC<ReportModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  currentLang,
  initialIndicator = '',
}) => {
  const t = translations[currentLang];
  const [kind, setKind] = useState<IndicatorKind>('domain');
  const [indicator, setIndicator] = useState(initialIndicator);
  const [category, setCategory] = useState<ScamCategory>('digital_arrest');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [sampleTemplate, setSampleTemplate] = useState('');
  const [isListening, setIsListening] = useState(false);

  if (!isOpen) return null;

  const handleVoiceInput = () => {
    setIsListening(true);
    startVoiceRecognition(
      currentLang,
      (text) => {
        setIsListening(false);
        setDescription((prev) => (prev ? `${prev} ${text}` : text));
      },
      () => setIsListening(false)
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!indicator.trim() || !title.trim()) return;

    onSubmit({
      kind,
      indicator: indicator.trim(),
      category,
      lang: currentLang,
      title: title.trim(),
      description: description.trim(),
      sampleTemplate: sampleTemplate.trim(),
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="glass-panel w-full max-w-xl rounded-2xl border border-cyber-border p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-cyber-textMuted hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 mb-2">
          <ShieldAlert className="w-6 h-6 text-cyber-saffron" />
          <h2 className="text-xl font-bold text-white">
            {t.reportScamBtn}
          </h2>
        </div>
        <p className="text-xs text-cyber-textMuted mb-5">
          Reports are stored directly on Arkiv with an automatic 72-hour expiration window. Peer confirmations extend trust to 30 days. No PII or phone numbers permitted.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {/* Indicator Kind & Category */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-cyber-textMuted font-semibold mb-1">
                Indicator Type:
              </label>
              <select
                value={kind}
                onChange={(e) => setKind(e.target.value as IndicatorKind)}
                className="w-full bg-cyber-bg border border-cyber-border rounded-xl p-2.5 text-white focus:outline-none focus:border-cyber-saffron"
              >
                <option value="domain">Domain / Website URL</option>
                <option value="app">Android App Package (APK)</option>
                <option value="upi">Malicious UPI VPA</option>
                <option value="template">Phishing Message Template</option>
              </select>
            </div>

            <div>
              <label className="block text-cyber-textMuted font-semibold mb-1">
                Scam Category:
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as ScamCategory)}
                className="w-full bg-cyber-bg border border-cyber-border rounded-xl p-2.5 text-white focus:outline-none focus:border-cyber-saffron"
              >
                <option value="digital_arrest">{t.categories.digital_arrest}</option>
                <option value="loan_app">{t.categories.loan_app}</option>
                <option value="kyc">{t.categories.kyc}</option>
                <option value="job">{t.categories.job}</option>
                <option value="upi">{t.categories.upi}</option>
                <option value="other">{t.categories.other}</option>
              </select>
            </div>
          </div>

          {/* Indicator Input */}
          <div>
            <label className="block text-cyber-textMuted font-semibold mb-1">
              Indicator (Normalized):
            </label>
            <input
              type="text"
              required
              value={indicator}
              onChange={(e) => setIndicator(e.target.value)}
              placeholder="e.g. sbi-rewards-gift.site or com.predatory.loan"
              className="w-full bg-cyber-bg border border-cyber-border rounded-xl p-2.5 text-white font-mono focus:outline-none focus:border-cyber-saffron"
            />
          </div>

          {/* Title */}
          <div>
            <label className="block text-cyber-textMuted font-semibold mb-1">
              Short Title:
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Fake CBI Video Summons Portal"
              className="w-full bg-cyber-bg border border-cyber-border rounded-xl p-2.5 text-white focus:outline-none focus:border-cyber-saffron"
            />
          </div>

          {/* Description with Voice Input */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-cyber-textMuted font-semibold">
                Description / Details:
              </label>
              <button
                type="button"
                onClick={handleVoiceInput}
                className={`flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-lg border transition-colors ${
                  isListening
                    ? 'bg-cyber-crimson/20 border-cyber-crimson text-cyber-crimson animate-pulse'
                    : 'bg-cyber-card border-cyber-border text-cyber-saffron hover:bg-cyber-saffron/10'
                }`}
              >
                <Mic className="w-3 h-3" />
                <span>{isListening ? 'Listening...' : 'Speak in Regional Voice'}</span>
              </button>
            </div>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe how the scam operates..."
              className="w-full bg-cyber-bg border border-cyber-border rounded-xl p-2.5 text-white focus:outline-none focus:border-cyber-saffron"
            />
          </div>

          {/* Sample Template */}
          <div>
            <label className="block text-cyber-textMuted font-semibold mb-1">
              Sanitized Message Template (Optional):
            </label>
            <input
              type="text"
              value={sampleTemplate}
              onChange={(e) => setSampleTemplate(e.target.value)}
              placeholder="e.g. Dear customer your electricity power will be disconnected..."
              className="w-full bg-cyber-bg border border-cyber-border rounded-xl p-2.5 text-white focus:outline-none focus:border-cyber-saffron font-mono text-[11px]"
            />
          </div>

          <div className="pt-3">
            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-gradient-to-r from-cyber-saffron to-amber-600 hover:from-amber-600 hover:to-cyber-saffron text-white font-bold flex items-center justify-center gap-2 shadow-lg shadow-cyber-saffron/20 transition-all text-sm"
            >
              <Send className="w-4 h-4" />
              <span>Publish Indicator to Arkiv DB-Chain</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

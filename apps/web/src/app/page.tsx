'use client';

import React, { useState, useMemo } from 'react';
import {
  ShieldAlert,
  Search,
  Filter,
  Plus,
  Radio,
  FileCheck2,
  TrendingUp,
  MessageSquareWarning,
  Eye,
  ExternalLink,
} from 'lucide-react';
import { ChetavaniReport, ScamCategory } from '@chetavani/arkiv-client';
import { LanguageCode, translations } from '@/lib/i18n';
import { Navbar } from '@/components/Navbar';
import { ScamCard } from '@/components/ScamCard';
import { MessageTriage } from '@/components/MessageTriage';
import { ThreatSimulator } from '@/components/ThreatSimulator';
import { AtBlockProof } from '@/components/AtBlockProof';
import { ReportModal } from '@/components/ReportModal';

// Seed initial reports for instant live browsing
import { SYNTHETIC_INDIAN_SCAMS } from '../../../seed/src/synthetic-data.js';

export default function Home() {
  const [currentLang, setCurrentLang] = useState<LanguageCode>('en');
  const [activeTab, setActiveTab] = useState<'feed' | 'triage' | 'simulator' | 'proof'>('feed');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [selectedReportForProof, setSelectedReportForProof] = useState<ChetavaniReport | null>(null);

  const t = translations[currentLang];

  // Convert synthetic seeds to initial report state
  const [reports, setReports] = useState<ChetavaniReport[]>(() => {
    return SYNTHETIC_INDIAN_SCAMS.map((s, idx) => ({
      key: `0x${(idx + 10).toString(16).padStart(64, '0')}`,
      kind: s.kind as any,
      indicator: s.indicator,
      category: s.category as any,
      lang: s.lang as any,
      status: idx % 3 === 0 ? 'confirmed' : 'unconfirmed',
      confirms: idx % 3 === 0 ? 3 : 0,
      payload: {
        title: s.payload.title,
        description: s.payload.description,
        sampleTemplate: s.payload.sampleTemplate,
        createdAt: Date.now() - idx * 3600000,
        reporter: '0x3a4b...9f12',
      },
      expiresAtBlock: 154200 + idx * 100,
    }));
  });

  // Filtered reports
  const filteredReports = useMemo(() => {
    return reports.filter((r) => {
      const matchesSearch =
        r.indicator.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.payload.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (r.payload.sampleTemplate &&
          r.payload.sampleTemplate.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesCat = selectedCategory === 'all' || r.category === selectedCategory;

      return matchesSearch && matchesCat;
    });
  }, [reports, searchQuery, selectedCategory]);

  // Handle report submission
  const handleCreateReport = (data: any) => {
    const newReport: ChetavaniReport = {
      key: `0x${Math.random().toString(16).slice(2).padStart(64, '0')}`,
      kind: data.kind,
      indicator: data.indicator,
      category: data.category,
      lang: data.lang,
      status: 'unconfirmed',
      confirms: 0,
      payload: {
        title: data.title,
        description: data.description,
        sampleTemplate: data.sampleTemplate,
        createdAt: Date.now(),
        reporter: '0xCurrentWallet',
      },
      expiresAtBlock: 154800,
    };

    setReports([newReport, ...reports]);
  };

  const handleConfirm = (key: string) => {
    setReports((prev) =>
      prev.map((r) => {
        if (r.key === key) {
          const newConfirms = r.confirms + 1;
          return {
            ...r,
            confirms: newConfirms,
            status: newConfirms >= 2 ? 'confirmed' : r.status,
          };
        }
        return r;
      })
    );
  };

  const handleDispute = (key: string) => {
    const reason = prompt('Enter your verifiable dispute reason (e.g. Registered brand domain):');
    if (!reason) return;

    setReports((prev) =>
      prev.map((r) => {
        if (r.key === key) {
          return {
            ...r,
            status: 'disputed',
            disputeReason: reason,
          };
        }
        return r;
      })
    );
  };

  return (
    <div className="min-h-screen bg-cyber-bg text-white flex flex-col justify-between selection:bg-cyber-saffron selection:text-white">
      {/* Top Navbar */}
      <Navbar
        currentLang={currentLang}
        onLanguageChange={setCurrentLang}
        activeBlock={154820}
        isLive={true}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full flex-1">
        {/* Hero Section */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-cyber-saffron/10 border border-cyber-saffron/30 text-cyber-saffron text-xs font-semibold mb-4">
            <Radio className="w-3.5 h-3.5 animate-pulse" />
            <span>Community-Run Censorship-Resistant Registry</span>
          </div>

          <h1 className="text-4xl sm:text-5xl font-black tracking-tight bg-gradient-to-r from-cyber-saffron via-amber-400 to-white bg-clip-text text-transparent mb-4 leading-tight">
            {t.tagline}
          </h1>

          <p className="text-sm sm:text-base text-cyber-textMuted leading-relaxed mb-6">
            {t.subtagline}
          </p>

          {/* Quick Action Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={() => setIsReportModalOpen(true)}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-cyber-saffron to-amber-600 hover:from-amber-600 hover:to-cyber-saffron text-white font-bold text-sm flex items-center gap-2 shadow-lg shadow-cyber-saffron/25 transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>{t.reportScamBtn}</span>
            </button>

            <button
              onClick={() => setActiveTab('triage')}
              className="px-5 py-3 rounded-xl bg-cyber-card hover:bg-cyber-card/80 border border-cyber-border text-white font-semibold text-sm flex items-center gap-2 transition-all"
            >
              <MessageSquareWarning className="w-4 h-4 text-cyber-emerald" />
              <span>{t.inspectMessageTab}</span>
            </button>

            <button
              onClick={() => setActiveTab('simulator')}
              className="px-5 py-3 rounded-xl bg-cyber-card hover:bg-cyber-card/80 border border-cyber-border text-white font-semibold text-sm flex items-center gap-2 transition-all"
            >
              <ShieldAlert className="w-4 h-4 text-amber-400" />
              <span>{t.simulatorTab}</span>
            </button>
          </div>
        </div>

        {/* Feature Navigation Tabs */}
        <div className="flex items-center justify-center gap-2 border-b border-cyber-border/80 pb-4 mb-8 overflow-x-auto">
          <button
            onClick={() => setActiveTab('feed')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'feed'
                ? 'bg-cyber-saffron text-white shadow-md'
                : 'text-cyber-textMuted hover:text-white bg-cyber-card border border-cyber-border'
            }`}
          >
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>{t.liveFeedTitle} ({reports.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('triage')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'triage'
                ? 'bg-cyber-saffron text-white shadow-md'
                : 'text-cyber-textMuted hover:text-white bg-cyber-card border border-cyber-border'
            }`}
          >
            <MessageSquareWarning className="w-3.5 h-3.5" />
            <span>{t.inspectMessageTab}</span>
          </button>

          <button
            onClick={() => setActiveTab('simulator')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'simulator'
                ? 'bg-cyber-saffron text-white shadow-md'
                : 'text-cyber-textMuted hover:text-white bg-cyber-card border border-cyber-border'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span>{t.simulatorTab}</span>
          </button>

          <button
            onClick={() => setActiveTab('proof')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'proof'
                ? 'bg-cyber-saffron text-white shadow-md'
                : 'text-cyber-textMuted hover:text-white bg-cyber-card border border-cyber-border'
            }`}
          >
            <FileCheck2 className="w-3.5 h-3.5" />
            <span>{t.proofTab}</span>
          </button>
        </div>

        {/* Tab 1: Live Feed View */}
        {activeTab === 'feed' && (
          <div>
            {/* Search & Category Filter Bar */}
            <div className="flex flex-col sm:flex-row items-center gap-3 mb-6">
              <div className="relative w-full">
                <Search className="w-4 h-4 text-cyber-textMuted absolute left-4 top-3.5" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={t.searchPlaceholder}
                  className="w-full pl-11 pr-4 py-3 bg-cyber-card border border-cyber-border rounded-xl text-sm text-white placeholder-cyber-textMuted focus:outline-none focus:border-cyber-saffron transition-all"
                />
              </div>

              {/* Category Pills Dropdown */}
              <select
                aria-label="Filter by scam category"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full sm:w-auto px-4 py-3 bg-cyber-card border border-cyber-border rounded-xl text-xs text-white font-semibold focus:outline-none focus:border-cyber-saffron cursor-pointer"
              >
                <option value="all">{t.categories.all}</option>
                <option value="digital_arrest">{t.categories.digital_arrest}</option>
                <option value="loan_app">{t.categories.loan_app}</option>
                <option value="kyc">{t.categories.kyc}</option>
                <option value="job">{t.categories.job}</option>
                <option value="upi">{t.categories.upi}</option>
                <option value="other">{t.categories.other}</option>
              </select>
            </div>

            {/* Grid of Scam Cards */}
            {filteredReports.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {filteredReports.map((report) => (
                  <ScamCard
                    key={report.key}
                    report={report}
                    currentLang={currentLang}
                    onConfirm={handleConfirm}
                    onDispute={handleDispute}
                    onInspectProof={(r) => {
                      setSelectedReportForProof(r);
                      setActiveTab('proof');
                    }}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-16 glass-panel rounded-2xl border border-cyber-border">
                <ShieldAlert className="w-12 h-12 text-cyber-textMuted mx-auto mb-3" />
                <p className="text-white font-bold">{t.verifiedClean}</p>
                <p className="text-xs text-cyber-textMuted mt-1">No indicators match "{searchQuery}"</p>
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Zero-PII Message Triage */}
        {activeTab === 'triage' && (
          <MessageTriage currentLang={currentLang} reports={reports} />
        )}

        {/* Tab 3: Interactive Threat Simulator */}
        {activeTab === 'simulator' && (
          <ThreatSimulator currentLang={currentLang} />
        )}

        {/* Tab 4: atBlock Proof Engine */}
        {activeTab === 'proof' && (
          <AtBlockProof
            currentLang={currentLang}
            selectedReport={selectedReportForProof}
            onClearSelection={() => setSelectedReportForProof(null)}
          />
        )}
      </main>

      {/* Report Modal */}
      <ReportModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        onSubmit={handleCreateReport}
        currentLang={currentLang}
      />

      {/* Footer */}
      <footer className="glass-panel border-t border-cyber-border/80 py-6 mt-12">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-cyber-textMuted">
          <div>
            <span className="font-bold text-white">Chetavani (चेतावनी)</span> — Built for the Arkiv Global Tour Stop pre-Devcon Challenge.
          </div>
          <div className="flex items-center gap-4">
            <span className="text-cyber-saffron font-medium">Chain ID: 7738577 (Tiramisu)</span>
            <a
              href="https://github.com/Arkiv-Network"
              target="_blank"
              rel="noreferrer"
              className="hover:text-white transition-colors"
            >
              Arkiv Docs
            </a>
            <a
              href="https://tiramisu.explorer.arkiv.network"
              target="_blank"
              rel="noreferrer"
              className="hover:text-white transition-colors"
            >
              Explorer
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}

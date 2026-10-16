'use client';

import React from 'react';
import { ShieldAlert, Radio, Languages, Volume2, Mic, ExternalLink } from 'lucide-react';
import { LanguageCode, translations } from '@/lib/i18n';

interface NavbarProps {
  currentLang: LanguageCode;
  onLanguageChange: (lang: LanguageCode) => void;
  activeBlock: number | string;
  isLive: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentLang,
  onLanguageChange,
  activeBlock,
  isLive,
}) => {
  const t = translations[currentLang];

  return (
    <header className="sticky top-0 z-50 glass-panel border-b border-cyber-border/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="relative flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-cyber-saffron to-amber-600 text-white shadow-lg shadow-cyber-saffron/20">
            <ShieldAlert className="w-7 h-7" />
            {isLive && (
              <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyber-emerald opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-cyber-emerald border-2 border-cyber-bg"></span>
              </span>
            )}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-extrabold tracking-tight bg-gradient-to-r from-cyber-saffron via-amber-400 to-white bg-clip-text text-transparent">
                {t.appName}
              </span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-cyber-saffron/10 text-cyber-saffron font-semibold border border-cyber-saffron/30">
                Arkiv Tiramisu (7738577)
              </span>
            </div>
            <p className="text-xs text-cyber-textMuted hidden sm:block">
              {t.tagline}
            </p>
          </div>
        </div>

        {/* Arkiv Network Radar & Language Switcher */}
        <div className="flex items-center gap-3">
          {/* Live Arkiv Chain Pulse */}
          <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-cyber-card border border-cyber-border text-xs text-cyber-textMuted">
            <Radio className={`w-3.5 h-3.5 ${isLive ? 'text-cyber-emerald animate-pulse' : 'text-gray-400'}`} />
            <span>Block:</span>
            <span className="font-mono text-white font-semibold">#{activeBlock || '7,738...'}</span>
          </div>

          {/* Language Selector (6 Indian Languages) */}
          <div className="flex items-center gap-1 bg-cyber-card border border-cyber-border rounded-xl p-1">
            <Languages className="w-4 h-4 text-cyber-saffron ml-2 mr-1" />
            <select
              aria-label="Select Indian Language"
              value={currentLang}
              onChange={(e) => onLanguageChange(e.target.value as LanguageCode)}
              className="bg-transparent text-sm text-white font-medium focus:outline-none pr-2 py-1 cursor-pointer"
            >
              <option value="en" className="bg-cyber-card text-white">English</option>
              <option value="hi" className="bg-cyber-card text-white">हिन्दी (Hindi)</option>
              <option value="mr" className="bg-cyber-card text-white">मराठी (Marathi)</option>
              <option value="ta" className="bg-cyber-card text-white">தமிழ் (Tamil)</option>
              <option value="te" className="bg-cyber-card text-white">తెలుగు (Telugu)</option>
              <option value="bn" className="bg-cyber-card text-white">বাংলা (Bengali)</option>
            </select>
          </div>

          {/* Explorer Link */}
          <a
            href="https://tiramisu.explorer.arkiv.network"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden lg:flex items-center gap-1 text-xs text-cyber-saffron hover:text-cyber-saffronLight font-medium transition-colors px-2 py-1"
          >
            <span>Arkiv Explorer</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>
    </header>
  );
};

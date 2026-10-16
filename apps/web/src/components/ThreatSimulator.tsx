'use client';

import React, { useState } from 'react';
import {
  Video,
  ShieldAlert,
  AlertCircle,
  HelpCircle,
  PhoneCall,
  Lock,
  ChevronRight,
  RotateCcw,
} from 'lucide-react';
import { LanguageCode, translations } from '@/lib/i18n';

interface ThreatSimulatorProps {
  currentLang: LanguageCode;
}

export const ThreatSimulator: React.FC<ThreatSimulatorProps> = ({
  currentLang,
}) => {
  const t = translations[currentLang];
  const [activeScenario, setActiveScenario] = useState<'digital_arrest' | 'loan_shark'>('digital_arrest');
  const [activeStep, setActiveStep] = useState(0);

  const digitalArrestSteps = [
    {
      title: 'Step 1: The Panic Call (Spoofed Sender ID)',
      sender: 'TRAI / Mumbai Police Telecom Division',
      message: 'Your mobile number will be disconnected in 2 hours as 23 complaints of money laundering and child sexual abuse material (CSAM) have been filed against your Aadhaar card in Mumbai.',
      redFlags: [
        'TRAI / Police never disconnect numbers over automated IVR calls.',
        'Official summons are served in person or via registered post, never robo-calls.',
      ],
    },
    {
      title: 'Step 2: The Skype / WhatsApp Video Transfer',
      sender: 'CBI Cyber Cell Inspector (Uniformed Impersonator)',
      message: 'Connect to Skype ID: "CBI_Headquarters_Delhi_Officer". Keep your camera ON. You are placed under "Digital Arrest". Do not hang up or inform family members, or an armed team will be dispatched to your house.',
      redFlags: [
        'There is NO legal concept of "Digital Arrest" under the Indian Bharatiya Nagarik Suraksha Sanhita (BNSS) or CrPC.',
        'Law enforcement never conducts interrogation or arrests over Skype video calls.',
        'Background office is a fake fabricated backdrop with Indian flag and official logo.',
      ],
    },
    {
      title: 'Step 3: The Asset Verification Escrow Trap',
      sender: 'Supreme Court of India Forged Warrant',
      message: 'To prove innocence, transfer all your fixed deposits and savings (Rs 8,50,000) to the designated "RBI Secret Security Escrow Account". Once verified by the Supreme Court auditor, funds will be refunded in 30 minutes.',
      redFlags: [
        'RBI never holds individual escrow accounts for citizen asset verification.',
        'Once transferred via RTGS/IMPS, money is immediately laundered through mule bank networks.',
      ],
    },
  ];

  const loanSharkSteps = [
    {
      title: 'Step 1: The Instant 2-Minute Loan Bait',
      sender: 'SMS: FastPaisa Micro Finance',
      message: 'Approved! Rs 50,000 instant cash directly in bank account without CIBIL score or salary slip. Click here to download APK: http://fastloan-apk.site',
      redFlags: [
        'Legitimate lenders are hosted on Google Play Store with RBI NBFC license disclosure.',
        'Sideloaded APKs request dangerous permissions: READ_CONTACTS, READ_SMS, ACCESS_PHOTOS.',
      ],
    },
    {
      title: 'Step 2: The 6-Day 200% Usury Shock',
      sender: 'Loan App Dashboard',
      message: 'Disbursed Amount: Rs 3,000 (Processing fee deducted: Rs 2,000). Total Repayment Due on Day 6: Rs 6,500. Pay immediately or your data will be leaked.',
      redFlags: [
        'Predatory apps disburse only 50-60% of the loan while demanding repayment within 6 days.',
        'Violation of RBI Fair Practices Code for digital lending.',
      ],
    },
    {
      title: 'Step 3: The Morphed Photo Blackmail Call',
      sender: 'WhatsApp Recovery Agent',
      message: 'We have downloaded your entire phone gallery and contact list. If you do not pay Rs 15,000 right now, we will send these morphed compromising photos to your parents, office colleagues, and relatives.',
      redFlags: [
        'Extortion racket targeting victims through contact book exfiltration.',
        'Immediate action: Report immediately to National Cyber Crime Reporting Portal (1930) and block numbers.',
      ],
    },
  ];

  const currentSteps = activeScenario === 'digital_arrest' ? digitalArrestSteps : loanSharkSteps;
  const currentStepData = currentSteps[activeStep];

  return (
    <div className="glass-panel rounded-2xl p-6 border border-cyber-border">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-cyber-saffron" />
            <span>Interactive Threat Simulator</span>
          </h2>
          <p className="text-xs text-cyber-textMuted mt-0.5">
            Step-by-step educational breakdown of India's most dangerous cyber extortion syndicates.
          </p>
        </div>

        {/* Scenario Switcher */}
        <div className="flex items-center gap-2 bg-cyber-card border border-cyber-border rounded-xl p-1">
          <button
            onClick={() => {
              setActiveScenario('digital_arrest');
              setActiveStep(0);
            }}
            className={`text-xs px-3 py-1.5 rounded-lg font-semibold transition-all ${
              activeScenario === 'digital_arrest'
                ? 'bg-cyber-saffron text-white shadow-md'
                : 'text-cyber-textMuted hover:text-white'
            }`}
          >
            Digital Arrest Extortion
          </button>
          <button
            onClick={() => {
              setActiveScenario('loan_shark');
              setActiveStep(0);
            }}
            className={`text-xs px-3 py-1.5 rounded-lg font-semibold transition-all ${
              activeScenario === 'loan_shark'
                ? 'bg-cyber-saffron text-white shadow-md'
                : 'text-cyber-textMuted hover:text-white'
            }`}
          >
            Predatory Loan Shark APK
          </button>
        </div>
      </div>

      {/* Simulator Stepper Card */}
      <div className="p-5 rounded-2xl bg-black/50 border border-cyber-border/80">
        <div className="flex items-center justify-between text-xs text-cyber-saffron font-bold uppercase tracking-wider mb-2">
          <span>{currentStepData.title}</span>
          <span>
            Step {activeStep + 1} of {currentSteps.length}
          </span>
        </div>

        {/* Fake Incident Display */}
        <div className="p-4 rounded-xl bg-cyber-card/90 border border-cyber-border mb-4">
          <div className="flex items-center gap-2 text-xs font-semibold text-cyber-crimson mb-2">
            <PhoneCall className="w-3.5 h-3.5 animate-pulse" />
            <span>Incoming Spoofed Communication: [{currentStepData.sender}]</span>
          </div>
          <p className="text-sm text-gray-200 leading-relaxed font-sans italic bg-black/40 p-3 rounded-lg border border-cyber-border/40">
            "{currentStepData.message}"
          </p>
        </div>

        {/* Tell-Tale Red Flags */}
        <div className="p-4 rounded-xl bg-amber-950/20 border border-amber-500/30">
          <span className="text-xs font-bold text-amber-400 flex items-center gap-1.5 mb-2 uppercase tracking-wide">
            <AlertCircle className="w-4 h-4" /> Crucial Tell-Tale Red Flags:
          </span>
          <ul className="space-y-1.5 text-xs text-gray-300">
            {currentStepData.redFlags.map((flag, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="text-cyber-crimson font-bold">✕</span>
                <span>{flag}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Stepper Navigation */}
        <div className="mt-5 flex items-center justify-between pt-3 border-t border-cyber-border/60">
          <button
            disabled={activeStep === 0}
            onClick={() => setActiveStep((prev) => Math.max(0, prev - 1))}
            className="text-xs font-semibold px-4 py-2 rounded-lg bg-cyber-card hover:bg-cyber-border disabled:opacity-40 text-white transition-all"
          >
            Previous Stage
          </button>

          {activeStep < currentSteps.length - 1 ? (
            <button
              onClick={() => setActiveStep((prev) => prev + 1)}
              className="text-xs font-semibold px-5 py-2 rounded-lg bg-cyber-saffron hover:bg-cyber-saffronLight text-white flex items-center gap-1.5 shadow-lg shadow-cyber-saffron/20 transition-all"
            >
              <span>See Next Escalation Stage</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          ) : (
            <button
              onClick={() => setActiveStep(0)}
              className="text-xs font-semibold px-4 py-2 rounded-lg bg-cyber-emerald hover:bg-emerald-600 text-white flex items-center gap-1.5 transition-all"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Restart Scenario</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

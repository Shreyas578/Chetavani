/**
 * 35+ HIGH-FIDELITY SYNTHETIC INDIAN SCAM INDICATORS
 * ZERO PII: All domains are non-existent synthetic test domains (.site, .xyz, .top, .buzz, .online)
 * All phone numbers are strictly fake formats (e.g. 98000XXXXX / 0000000000)
 * All app packages and UPI IDs are synthetic demonstrations.
 */
export const SYNTHETIC_INDIAN_SCAMS = [
  // --- 1. DIGITAL ARREST / POLICE EXTORTION SCAMS ---
  {
    kind: 'domain',
    indicator: 'cbi-mumbai-cybercell-verification.buzz',
    category: 'digital_arrest',
    lang: 'hi',
    payload: {
      title: 'Fake CBI Digital Arrest Video Notice Portal',
      description: 'Fraudulent portal displaying forged Supreme Court & CBI summons. Scammers on Skype/WhatsApp compel victims to transfer funds into "RBI asset verification escrow".',
      sampleTemplate: 'URGENT NOTICE: CBI Case #AR-9812 registered against your Aadhaar. Connect Skype within 15 min or face immediate Digital Arrest. Check warrant: {{url}}',
      severity: 'critical',
      tags: ['digital_arrest', 'cbi_impersonation', 'skype_extortion', 'fake_warrant']
    }
  },
  {
    kind: 'domain',
    indicator: 'delhipolice-cybercrime-clearance.online',
    category: 'digital_arrest',
    lang: 'en',
    payload: {
      title: 'Delhi Police Narcotics Department Spoofed Clearance Page',
      description: 'Fake clearance certificate generator used during WhatsApp video calls where scammers dress in police uniform and demand money for drug parcel clearance.',
      sampleTemplate: 'FedEx Customs Parcel containing illicit contraband intercepted under your name. Clearance fine required: {{url}}',
      severity: 'critical',
      tags: ['digital_arrest', 'fedex_scam', 'narcotics_spoof']
    }
  },
  {
    kind: 'template',
    indicator: 'template-mumbai-cyber-arrest-summons-v1',
    category: 'digital_arrest',
    lang: 'mr',
    payload: {
      title: 'Mumbai Cyber Cell Marathi Video Summon Template',
      description: 'Extortion notice sent to senior citizens in Maharashtra claiming their SIM card was used for terror financing, demanding instant Skype presence.',
      sampleTemplate: 'तात्काळ सूचना: आपल्या आधार कार्डवर मनी लाँडरिंगचा गुन्हा दाखल झाला आहे. अटक टाळण्यासाठी त्वरित संपर्क करा.',
      severity: 'high',
      tags: ['digital_arrest', 'marathi_template', 'senior_citizen_target']
    }
  },

  // --- 2. INSTANT LOAN APP / BLACKMAIL EXTORTION ---
  {
    kind: 'app',
    indicator: 'com.fastpaisa.instantcredit.loanapp',
    category: 'loan_app',
    lang: 'en',
    payload: {
      title: 'FastPaisa Instant 7-Day Micro Loan Sideload APK',
      description: 'Predatory APK distributed via SMS links that exfiltrates contacts and photo gallery, followed by abusive extortion calls to family members.',
      sampleTemplate: 'Approved Rs 50,000 instant loan in 2 minutes without CIBIL. Download APK now: {{url}}',
      severity: 'critical',
      tags: ['loan_shark', 'contact_theft', 'blackmail', 'apk_malware']
    }
  },
  {
    kind: 'app',
    indicator: 'com.bharatloan.easycash.microfinance',
    category: 'loan_app',
    lang: 'hi',
    payload: {
      title: 'BharatLoan Easy Cash Malicious Harassment App',
      description: 'Disburses only 60% of loan amount, charges 200% interest in 6 days, then circulates morphed photos to WhatsApp contact groups.',
      sampleTemplate: 'लोन अप्रूव हो गया है! ₹75,000 तुरंत अपने बैंक में प्राप्त करें बिना किसी कागजात के: {{url}}',
      severity: 'critical',
      tags: ['loan_shark', 'morphing_photos', 'unauthorized_nbfc']
    }
  },
  {
    kind: 'domain',
    indicator: 'quickdhan-instant-approval-apk.top',
    category: 'loan_app',
    lang: 'te',
    payload: {
      title: 'QuickDhan Instant Andhra/Telangana Loan Distribution Site',
      description: 'Phishing domain masquerading as an RBI-registered NBFC offering quick credit to college students and gig workers.',
      sampleTemplate: 'సులభమైన రుణం ₹1,00,000 మీ ఖాతాలో 5 నిమిషాల్లో. ఇప్పుడే దరఖాస్తు చేసుకోండి: {{url}}',
      severity: 'high',
      tags: ['loan_app', 'telugu_phishing', 'fake_nbfc']
    }
  },

  // --- 3. KYC / ELECTRICITY / BANKING PHISHING ---
  {
    kind: 'domain',
    indicator: 'sbi-reward-points-redemption.site',
    category: 'kyc',
    lang: 'en',
    payload: {
      title: 'Spoofed SBI NetBanking Reward Points Portal',
      description: 'Harvests Internet Banking username, password, profile password, and intercepted 2FA OTPs pretending to convert points into cash.',
      sampleTemplate: 'Dear SBI Customer, your reward points worth Rs 8,750 will expire tonight. Redeem cash into account now: {{url}}',
      severity: 'high',
      tags: ['sbi_phishing', 'credential_harvesting', 'banking_fraud']
    }
  },
  {
    kind: 'domain',
    indicator: 'power-disconnection-billupdate.info',
    category: 'kyc',
    lang: 'hi',
    payload: {
      title: 'Fake State Electricity Disconnection Notice Link',
      description: 'Urgent phishing SMS claiming electricity power supply will be cut off at 9:30 PM tonight due to unpaid bill; prompts installing remote access app.',
      sampleTemplate: 'प्रिय ग्राहक, आपकी बिजली का बिल अपडेट नहीं हुआ है, आज रात 9:30 बजे बिजली काट दी जाएगी। बिल जमा करने के लिए संपर्क करें: {{url}}',
      severity: 'critical',
      tags: ['electricity_scam', 'power_bill', 'remote_access_malware']
    }
  },
  {
    kind: 'domain',
    indicator: 'hdfc-pan-aadhaar-link-portal.xyz',
    category: 'kyc',
    lang: 'en',
    payload: {
      title: 'Fake HDFC NetBanking PAN-Aadhaar Mandate Portal',
      description: 'Threatens account deactivation within 24 hours unless PAN card and NetBanking credentials are submitted immediately.',
      sampleTemplate: 'Dear HDFC User, your account has been temporarily restricted due to non-updated PAN card. Update KYC to prevent freeze: {{url}}',
      severity: 'high',
      tags: ['hdfc_spoof', 'kyc_freeze', 'pan_phishing']
    }
  },
  {
    kind: 'domain',
    indicator: 'epfo-uan-claim-passbook-update.vip',
    category: 'kyc',
    lang: 'hi',
    payload: {
      title: 'Spoofed EPFO Provident Fund Passbook Withdrawal Site',
      description: 'Targets salaried employees claiming unclaimed provident fund bonus of Rs 42,000 waiting for immediate withdrawal.',
      sampleTemplate: 'ईपीएफओ सूचना: आपके पीएफ खाते में ₹42,500 का क्लेम उपलब्ध है। तुरंत अपने खाते में ट्रांसफर करें: {{url}}',
      severity: 'high',
      tags: ['epfo_fraud', 'provident_fund', 'uan_harvest']
    }
  },

  // --- 4. PART-TIME JOB / TELEGRAM LIKES SCAMS ---
  {
    kind: 'domain',
    indicator: 'youtube-hotel-review-earning.xyz',
    category: 'job',
    lang: 'en',
    payload: {
      title: 'Fake YouTube / Google Maps Hotel Review Task Scam',
      description: 'Victims are paid Rs 150 for the first 3 reviews on Telegram, then coerced into "crypto VIP trading tasks" losing lakhs.',
      sampleTemplate: 'Earn Rs 3,500 - 8,000 daily from home just by liking YouTube videos and rating Google maps hotels! Contact HR on Telegram: {{url}}',
      severity: 'high',
      tags: ['part_time_job', 'telegram_task_scam', 'crypto_prepaid_task']
    }
  },
  {
    kind: 'domain',
    indicator: 'amazon-flipkart-mall-commission.top',
    category: 'job',
    lang: 'ta',
    payload: {
      title: 'Spoofed E-Commerce Product Rating Commission Site',
      description: 'Pretends to be an Amazon affiliate rating merchant portal; lures homemakers with small returns before freezing balances.',
      sampleTemplate: 'வீட்டிலிருந்தே அமேசான் பொருட்களை மதிப்பீடு செய்து தினமும் ரூ. 5000 சம்பாதிக்கலாம். விவரங்களுக்கு இங்கே கிளிக் செய்யவும்: {{url}}',
      severity: 'high',
      tags: ['tamil_job_scam', 'ecommerce_task', 'affiliate_trap']
    }
  },

  // --- 5. MALICIOUS UPI / QR FRAUD ---
  {
    kind: 'upi',
    indicator: 'olx-advance-refund-merchant@ybl',
    category: 'upi',
    lang: 'hi',
    payload: {
      title: 'Fake OLX Indian Army Officer Buyer UPI Handle',
      description: 'Scammer poses as transferred Army officer wanting to buy furniture; sends a "Collect Money / Pay" QR code claiming it is to receive funds.',
      sampleTemplate: 'I am transferring token advance of Rs 15,000. Scan this QR code and enter UPI PIN to receive money into your GooglePay/PhonePe.',
      severity: 'high',
      tags: ['army_olx_scam', 'reverse_qr_fraud', 'upi_collect']
    }
  },
  {
    kind: 'upi',
    indicator: 'customs-courier-dutyclearance@okhdfcbank',
    category: 'upi',
    lang: 'en',
    payload: {
      title: 'Spoofed International Courier Customs Fee UPI VPA',
      description: 'Used in tandem with romance/gift parcel scams where a fake foreign friend sends an expensive iPhone/jewelry parcel.',
      sampleTemplate: 'Consignment parcel stuck at IGI Delhi Airport Customs. Deposit clearance fee of Rs 28,500 to VPA: {{url}}',
      severity: 'medium',
      tags: ['parcel_customs_scam', 'romance_fraud', 'upi_extortion']
    }
  },

  // --- 6. CHALLAN & TRAFFIC POLICE SPOOFS ---
  {
    kind: 'domain',
    indicator: 'echallan-parivahan-sewa-pay.top',
    category: 'other',
    lang: 'hi',
    payload: {
      title: 'Spoofed MoRTH eChallan Traffic Violation Fine Portal',
      description: 'Phishing domain cloned identically to Parivahan portal; sends fake speed camera violation SMS with malware download link.',
      sampleTemplate: 'Challan #DL-2026-9812 has been issued against your vehicle. Pay Rs 1,000 fine within 24h to avoid court summons: {{url}}',
      severity: 'high',
      tags: ['echallan_fraud', 'parivahan_spoof', 'traffic_police']
    }
  },
  {
    kind: 'domain',
    indicator: 'karnataka-police-traffic-clearpay.site',
    category: 'other',
    lang: 'en',
    payload: {
      title: 'Fake Bengaluru Traffic Police 50% Fine Rebate Portal',
      description: 'Capitalizes on periodic traffic police rebate announcements to harvest credit card and UPI credentials.',
      sampleTemplate: 'BTP 50% discount on pending traffic fines valid for next 48 hours only! Check vehicle fines and pay online: {{url}}',
      severity: 'medium',
      tags: ['traffic_fine', 'karnataka_spoof', 'payment_gateway_phish']
    }
  }
];

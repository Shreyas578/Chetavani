export type LanguageCode = 'en' | 'hi' | 'mr' | 'ta' | 'te' | 'bn';

export interface TranslationDictionary {
  appName: string;
  tagline: string;
  subtagline: string;
  searchPlaceholder: string;
  liveFeedTitle: string;
  reportScamBtn: string;
  verifiedClean: string;
  flaggedWarning: string;
  unconfirmedStatus: string;
  confirmedStatus: string;
  disputedStatus: string;
  inspectMessageTab: string;
  scamTrendsTab: string;
  simulatorTab: string;
  proofTab: string;
  listenVoiceBtn: string;
  speechInputBtn: string;
  digitalArrestTitle: string;
  instantLoanTitle: string;
  confirmBtn: string;
  disputeBtn: string;
  categories: {
    all: string;
    kyc: string;
    loan_app: string;
    job: string;
    digital_arrest: string;
    upi: string;
    other: string;
  };
}

export const translations: Record<LanguageCode, TranslationDictionary> = {
  en: {
    appName: 'Chetavani',
    tagline: 'Self-Expiring, Tamper-Evident Scam Registry for India',
    subtagline: 'Built on Arkiv DB-Chain — Protecting citizens against Digital Arrests, predatory loan apps, and UPI phishing without centralized censorship.',
    searchPlaceholder: 'Search domain, app package, UPI VPA, or message snippet...',
    liveFeedTitle: 'Live Community Scam Feed',
    reportScamBtn: 'Report Suspicious Indicator',
    verifiedClean: 'No malicious records found',
    flaggedWarning: 'Warning: Malicious Indicator Flagged',
    unconfirmedStatus: 'Under Verification (72h Expiry)',
    confirmedStatus: 'Community Confirmed (30d Expiry)',
    disputedStatus: 'Dispute Filed (Visible Counter-Claim)',
    inspectMessageTab: 'Message Triage (Zero-PII)',
    scamTrendsTab: 'Scam Radar & Trends',
    simulatorTab: 'Threat Simulator',
    proofTab: 'atBlock Cryptographic Proof',
    listenVoiceBtn: 'Listen Voice Warning',
    speechInputBtn: 'Voice Input',
    digitalArrestTitle: 'Digital Arrest Threat Simulator',
    instantLoanTitle: 'Predatory Loan App Explainer',
    confirmBtn: 'Confirm Threat',
    disputeBtn: 'Dispute Report',
    categories: {
      all: 'All Scams',
      kyc: 'KYC & Electricity',
      loan_app: 'Predatory Loan Apps',
      job: 'Part-Time Job Tasks',
      digital_arrest: 'Digital Arrest / Police Extortion',
      upi: 'Malicious UPI & QR',
      other: 'Traffic / Other Frauds',
    },
  },
  hi: {
    appName: 'चेतावनी',
    tagline: 'भारत का पहला कम्युनिटी-संचालित, आत्म-समाप्त होने वाला फ्रॉड रजिस्ट्री',
    subtagline: 'आर्किव (Arkiv) ब्लॉकचेन पर निर्मित — डिजिटल अरेस्ट, फर्जी लोन ऐप्स और यूपीआई धोखाधड़ी से आम नागरिकों की सुरक्षा।',
    searchPlaceholder: 'वेबसाइट लिंक, ऐप नाम, यूपीआई आईडी या संदिग्ध मैसेज खोजें...',
    liveFeedTitle: 'लाइव कम्युनिटी फ्रॉड फीड',
    reportScamBtn: 'संदिग्ध फ्रॉड की रिपोर्ट करें',
    verifiedClean: 'कोई फ्रॉड रिकॉर्ड नहीं मिला',
    flaggedWarning: 'सावधान: यह एक फर्जी व खतरनाक लिंक/ऐप है!',
    unconfirmedStatus: 'जांच जारी (72 घंटे में स्वतः समाप्त)',
    confirmedStatus: 'कम्युनिटी द्वारा सत्यापित (30 दिन सुरक्षित)',
    disputedStatus: 'आपत्ति दर्ज (सार्वजनिक प्रतिवाद)',
    inspectMessageTab: 'मैसेज जांचें (गोपनीयता सुरक्षित)',
    scamTrendsTab: 'फ्रॉड ट्रेंड्स व आंकड़े',
    simulatorTab: 'थ्रेट सिम्युलेटर',
    proofTab: 'ब्लॉकचेन प्रमाण (atBlock)',
    listenVoiceBtn: 'आवाज़ में चेतावनी सुनें',
    speechInputBtn: 'बोलकर सर्च करें',
    digitalArrestTitle: 'डिजिटल अरेस्ट सिम्युलेटर',
    instantLoanTitle: 'फर्जी लोन ऐप की असलियत',
    confirmBtn: 'पुष्टि करें',
    disputeBtn: 'आपत्ति दर्ज करें',
    categories: {
      all: 'सभी फ्रॉड',
      kyc: 'केवाईसी व बिजली बिल',
      loan_app: 'फर्जी लोन ऐप्स',
      job: 'पार्ट-टाइम जॉब टास्क',
      digital_arrest: 'डिजिटल अरेस्ट / पुलिस धमकी',
      upi: 'फर्जी यूपीआई व क्यूआर',
      other: 'ट्रैफिक चालान व अन्य',
    },
  },
  mr: {
    appName: 'चेतावनी',
    tagline: 'भारताची पहिली स्वयं-कालबाह्य सायबर फसवणूक नोंदवही',
    subtagline: 'आर्किव (Arkiv) तंत्रज्ञानावर आधारित — डिजिटल अटक, बेकायदेशीर कर्ज ॲप्स आणि यूपीआय स्कॅमपासून नागरिकांचे संरक्षण.',
    searchPlaceholder: 'वेबसाइट, ॲप किंवा संशयास्पद संदेश शोधा...',
    liveFeedTitle: 'थेट सायबर फसवणूक फीड',
    reportScamBtn: 'संशयास्पद लिंकची नोंद करा',
    verifiedClean: 'कोणतीही फसवणूक आढळली नाही',
    flaggedWarning: 'धोका: ही फसवणूक करणारी लिंक/ॲप आहे!',
    unconfirmedStatus: 'पडताळणी सुरू (७२ तासात कालबाह्य)',
    confirmedStatus: 'समुदायाने प्रमाणित (३० दिवस मुदत)',
    disputedStatus: 'आक्षेप नोंदवला आहे',
    inspectMessageTab: 'संदेश तपासा',
    scamTrendsTab: 'फसवणूक ट्रेंड्स',
    simulatorTab: 'धमकी सिम्युलेटर',
    proofTab: 'ब्लॉकचेन पुरावा',
    listenVoiceBtn: 'चेतावणी ऐका',
    speechInputBtn: 'आवाजाद्वारे शोधा',
    digitalArrestTitle: 'डिजिटल अटक सिम्युलेटर',
    instantLoanTitle: 'कर्ज ॲप्सची माहिती',
    confirmBtn: 'पुष्टी करा',
    disputeBtn: 'आक्षेप घ्या',
    categories: {
      all: 'सर्व प्रकार',
      kyc: 'केवायसी व वीज बिल',
      loan_app: 'कर्ज ॲप्स फसवणूक',
      job: 'पार्ट-टाइम नोकरी',
      digital_arrest: 'डिजिटल अटक खंडणी',
      upi: 'यूपीआय व क्यूआर कोड',
      other: 'इतर सायबर गुन्हे',
    },
  },
  ta: {
    appName: 'சேதாவனி',
    tagline: 'இந்தியாவின் தன்னாட்சி மோசடி தடுப்பு பதிவேடு',
    subtagline: 'ஆர்கிவ் (Arkiv) பிளாக்செயினில் உருவாக்கப்பட்டது — டிஜிட்டல் கைது, போலி கடன் செயலிகள் மற்றும் UPI மோசடிகளிலிருந்து பாதுகாப்பு.',
    searchPlaceholder: 'இணையதளம், செயலி அல்லது செய்தியை தேடுங்கள்...',
    liveFeedTitle: 'நேரடி மோசடி எச்சரிக்கை',
    reportScamBtn: 'சந்தேகத்திற்கிடமானதை புகாரளிக்கவும்',
    verifiedClean: 'மோசடி பதிவுகள் எதுவும் இல்லை',
    flaggedWarning: 'எச்சரிக்கை: இது ஆபத்தான போலி இணைப்பு/செயலி!',
    unconfirmedStatus: 'சரிபார்ப்பில் உள்ளது (72 மணிநேரம்)',
    confirmedStatus: 'சமூகத்தால் உறுதிப்படுத்தப்பட்டது (30 நாட்கள்)',
    disputedStatus: 'மறுப்பு தெரிவிக்கப்பட்டுள்ளது',
    inspectMessageTab: 'செய்தி சோதனை',
    scamTrendsTab: 'மோசடி புள்ளிவிவரங்கள்',
    simulatorTab: 'மோசடி மாதிரி',
    proofTab: 'பிளாக்செயின் சான்று',
    listenVoiceBtn: 'குரல் எச்சரிக்கையை கேளுங்கள்',
    speechInputBtn: 'குரல் உள்ளீடு',
    digitalArrestTitle: 'டிஜிட்டல் கைது விளக்கம்',
    instantLoanTitle: 'போலி கடன் செயலி விளக்கம்',
    confirmBtn: 'உறுதி செய்',
    disputeBtn: 'மறுப்பு தெரிவி',
    categories: {
      all: 'அனைத்து மோசடிகள்',
      kyc: 'KYC & மின்கட்டணம்',
      loan_app: 'கடன் செயலிகள்',
      job: 'பகுதி நேர வேலை',
      digital_arrest: 'டிஜிட்டல் கைது மிரட்டல்',
      upi: 'UPI & QR மோசடி',
      other: 'பிற மோசடிகள்',
    },
  },
  te: {
    appName: 'చేతావని',
    tagline: 'భారతదేశ కమ్యూనిటీ ఆధారిత సైబర్ మోసాల నిరోధక రిజిస్ట్రీ',
    subtagline: 'ఆర్కివ్ (Arkiv) పై రూపొందించబడింది — డిజిటల్ అరెస్ట్, నకిలీ లోన్ యాప్‌లు మరియు UPI స్కామ్‌ల నుండి రక్షణ.',
    searchPlaceholder: 'వెబ్‌సైట్, యాప్ లేదా సందేశాన్ని శోధించండి...',
    liveFeedTitle: 'లైవ్ మోసాల సమాచారం',
    reportScamBtn: 'అనుమానాస్పద లింక్‌ను నివేదించండి',
    verifiedClean: 'మోసపూరిత రికార్డులు కనుగొనబడలేదు',
    flaggedWarning: 'హెచ్చరిక: ఇది ప్రమాదకరమైన నకిలీ లింక్/యాప్!',
    unconfirmedStatus: 'ధృవీకరణలో ఉంది (72 గంటల గడువు)',
    confirmedStatus: 'కమ్యూనిటీ ధృవీకరించబడింది (30 రోజులు)',
    disputedStatus: 'వివాదం దాఖలు చేయబడింది',
    inspectMessageTab: 'సందేశ విశ్లేషణ',
    scamTrendsTab: 'మోసాల ట్రెండ్స్',
    simulatorTab: 'మోసాల సిమ్యులేటర్',
    proofTab: 'బ్లాక్‌చెయిన్ రుజువు',
    listenVoiceBtn: 'హెచ్చరికను వినండి',
    speechInputBtn: 'వాయిస్ ఇన్‌పుట్',
    digitalArrestTitle: 'డిజిటల్ అరెస్ట్ సిమ్యులేటర్',
    instantLoanTitle: 'నకిలీ లోన్ యాప్ సమాచారం',
    confirmBtn: 'ధృవీకరించు',
    disputeBtn: 'వివాదం చేయి',
    categories: {
      all: 'అన్ని మోసాలు',
      kyc: 'KYC & విద్యుత్ బిల్లు',
      loan_app: 'నకిలీ లోన్ యాప్‌లు',
      job: 'పార్ట్ టైమ్ జాబ్ స్కామ్',
      digital_arrest: 'డిజిటల్ అరెస్ట్ బెదిరింపులు',
      upi: 'UPI & QR మోసాలు',
      other: 'ఇతర మోసాలు',
    },
  },
  bn: {
    appName: 'চেতাবনী',
    tagline: 'ভারতের স্বয়ংক্রিয়-মেয়াদোত্তীর্ণ স্ক্যাম রেজিস্ট্রি',
    subtagline: 'আর্কাইভ (Arkiv) ব্লকচেইনে নির্মিত — ডিজিটাল অ্যারেস্ট, ভুয়ো লোন অ্যাপ এবং ইউপিআই প্রতারণা থেকে নাগরিকদের সুরক্ষা।',
    searchPlaceholder: 'ওয়েবসাইট লিঙ্ক, অ্যাপের নাম বা বার্তা খুঁজুন...',
    liveFeedTitle: 'লাইভ প্রতারণা ফিড',
    reportScamBtn: 'সন্দেহজনক স্ক্যাম রিপোর্ট করুন',
    verifiedClean: 'কোনো ক্ষতিকারক রেকর্ড পাওয়া যায়নি',
    flaggedWarning: 'সতর্কতা: এটি একটি ক্ষতিকারক বা ভুয়ো লিঙ্ক!',
    unconfirmedStatus: 'যাচাইকরণ চলছে (৭২ ঘণ্টা মেয়াদ)',
    confirmedStatus: 'কমিউনিটি দ্বারা প্রমাণিত (৩০ দিন মেয়াদ)',
    disputedStatus: 'আপত্তি নথিভুক্ত',
    inspectMessageTab: 'মেসেজ বিশ্লেষণ',
    scamTrendsTab: 'স্ক্যাম পরিসংখ্যান',
    simulatorTab: 'থ্রেট সিমুলেটর',
    proofTab: 'ব্লকচেইন প্রমাণ',
    listenVoiceBtn: 'সতর্কবার্তা শুনুন',
    speechInputBtn: 'ভয়েস সার্চ',
    digitalArrestTitle: 'ডিজিটাল অ্যারেস্ট সিমুলেটর',
    instantLoanTitle: 'ভুয়ো লোন অ্যাপের তথ্য',
    confirmBtn: 'নিশ্চিত করুন',
    disputeBtn: 'আপত্তি জানান',
    categories: {
      all: 'সকল স্ক্যাম',
      kyc: 'কেওয়াইসি ও বিদ্যুৎ বিল',
      loan_app: 'ভুয়ো লোন অ্যাপ',
      job: 'পার্ট-টাইম কাজ',
      digital_arrest: 'ডিজিটাল অ্যারেস্ট',
      upi: 'ইউপিআই ও কিউআর প্রতারণা',
      other: 'অন্যান্য সাইবার অপরাধ',
    },
  },
};

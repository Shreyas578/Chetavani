import { LanguageCode } from './i18n';

// Language codes to speech synthesis BCP-47 tags
const SPEECH_LANG_MAP: Record<LanguageCode, string> = {
  en: 'en-IN',
  hi: 'hi-IN',
  mr: 'mr-IN',
  ta: 'ta-IN',
  te: 'te-IN',
  bn: 'bn-IN',
};

/**
 * Native Web Speech Synthesis: speaks a localized audio warning alert reliably across all browsers
 */
export function playVoiceWarning(text: string, lang: LanguageCode) {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    console.warn('Speech synthesis not supported in this browser.');
    return;
  }

  // Cancel any ongoing speech
  window.speechSynthesis.cancel();

  const doSpeak = () => {
    const utterance = new SpeechSynthesisUtterance(text);
    const targetLang = SPEECH_LANG_MAP[lang] || 'hi-IN';
    utterance.lang = targetLang;
    utterance.rate = 0.95;
    utterance.pitch = 1.0;

    const voices = window.speechSynthesis.getVoices();
    if (voices && voices.length > 0) {
      // 1. Try exact language match (e.g. mr-IN, ta-IN, hi-IN)
      let matched = voices.find(
        (v) =>
          v.lang.toLowerCase() === targetLang.toLowerCase() ||
          v.lang.toLowerCase().replace('_', '-').startsWith(lang)
      );

      // 2. Fallback to Hindi (which reads Devanagari like Marathi, Hindi, Sanskrit natively)
      if (!matched && (lang === 'mr' || lang === 'hi')) {
        matched = voices.find(
          (v) =>
            v.lang.toLowerCase().startsWith('hi') ||
            v.name.toLowerCase().includes('hindi') ||
            v.name.toLowerCase().includes('kalpana') ||
            v.name.toLowerCase().includes('hemant')
        );
      }

      // 3. Fallback to Indian English (en-IN) which handles Indian accents/terms cleanly
      if (!matched) {
        matched = voices.find(
          (v) =>
            v.lang.toLowerCase() === 'en-in' ||
            v.name.toLowerCase().includes('india') ||
            v.name.toLowerCase().includes('neerja') ||
            v.name.toLowerCase().includes('ravi')
        );
      }

      if (matched) {
        utterance.voice = matched;
      }
    }

    utterance.onerror = (e) => {
      console.warn('SpeechSynthesis error:', e);
    };

    window.speechSynthesis.speak(utterance);
  };

  // Chrome on Windows sometimes requires voices to be loaded asynchronously
  const voices = window.speechSynthesis.getVoices();
  if (!voices || voices.length === 0) {
    window.speechSynthesis.onvoiceschanged = () => {
      window.speechSynthesis.onvoiceschanged = null;
      doSpeak();
    };
    // Also trigger immediate speak attempt in case onvoiceschanged does not fire
    setTimeout(doSpeak, 50);
  } else {
    doSpeak();
  }
}

/**
 * Web Speech Recognition helper for hands-free voice search/reporting
 */
export function startVoiceRecognition(
  lang: LanguageCode,
  onResult: (text: string) => void,
  onError?: (err: any) => void
): { stop: () => void } | null {
  if (typeof window === 'undefined') return null;

  const SpeechRecognition =
    (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

  if (!SpeechRecognition) {
    alert('Voice recognition is not supported in your browser. Please try Chrome or Edge.');
    return null;
  }

  const recognition = new SpeechRecognition();
  recognition.lang = SPEECH_LANG_MAP[lang] || 'hi-IN';
  recognition.continuous = false;
  recognition.interimResults = false;

  recognition.onresult = (event: any) => {
    const transcript = event.results[0][0].transcript;
    onResult(transcript);
  };

  recognition.onerror = (event: any) => {
    if (onError) onError(event.error);
  };

  recognition.start();

  return {
    stop: () => recognition.stop(),
  };
}

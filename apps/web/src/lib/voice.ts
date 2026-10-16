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
 * Native Web Speech Synthesis: speaks a localized audio warning alert
 */
export function playVoiceWarning(text: string, lang: LanguageCode) {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    console.warn('Speech synthesis not supported in this browser.');
    return;
  }

  // Cancel any ongoing speech
  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = SPEECH_LANG_MAP[lang] || 'hi-IN';
  utterance.rate = 0.95; // Slightly slower for clarity
  utterance.pitch = 1.0;

  // Try to find a matching Indian accent voice
  const voices = window.speechSynthesis.getVoices();
  const matchedVoice = voices.find(
    (v) =>
      v.lang.toLowerCase() === SPEECH_LANG_MAP[lang]?.toLowerCase() ||
      v.lang.toLowerCase().startsWith(lang)
  );

  if (matchedVoice) {
    utterance.voice = matchedVoice;
  }

  window.speechSynthesis.speak(utterance);
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

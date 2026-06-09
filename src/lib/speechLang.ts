import { getTextDirection } from './textDirection'

const RTL_SCRIPT =
  /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF]/

/** Pashto-specific letters (helps separate from Urdu when both use Arabic script) */
const PASHTO_HINTS = /[\u067C\u067E\u0681\u0685\u0693\u0696\u069A\u06AB\u06BC\u06CD]|ښ|ږ|څ|ړ|ډ|ڼ|ټ|پښتو/

export type SpeechLangCode = 'en-US' | 'ur-PK' | 'ps-AF'

export function inferSpeechLang(text: string): SpeechLangCode {
  const sample = text.trim().slice(0, 400)

  if (!sample) {
    const nav = navigator.language.toLowerCase()
    if (nav.startsWith('ps')) return 'ps-AF'
    if (nav.startsWith('ur')) return 'ur-PK'
    if (nav.startsWith('en')) return 'en-US'
    return 'ur-PK'
  }

  const rtlCount = (sample.match(RTL_SCRIPT) ?? []).length
  const latinCount = (sample.match(/[A-Za-z]/g) ?? []).length

  if (latinCount > rtlCount && rtlCount < 2) {
    return 'en-US'
  }

  if (PASHTO_HINTS.test(sample)) {
    return 'ps-AF'
  }

  if (getTextDirection(sample) === 'rtl') {
    return 'ur-PK'
  }

  return 'en-US'
}

export function inferSpeechLangFromTranscript(
  transcript: string,
  fallback: SpeechLangCode,
): SpeechLangCode {
  const trimmed = transcript.trim()
  if (!trimmed) return fallback
  return inferSpeechLang(trimmed)
}

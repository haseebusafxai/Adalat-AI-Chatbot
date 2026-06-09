import { useCallback, useRef, useState } from 'react'
import { inferSpeechLang, type SpeechLangCode } from '../lib/speechLang'

interface SpeechRecognitionAlternative {
  transcript: string
}

interface SpeechRecognitionResult {
  readonly isFinal: boolean
  readonly length: number
  [index: number]: SpeechRecognitionAlternative
}

interface SpeechRecognitionResultList {
  readonly length: number
  [index: number]: SpeechRecognitionResult
}

interface SpeechRecognitionEvent extends Event {
  readonly resultIndex: number
  readonly results: SpeechRecognitionResultList
}

interface SpeechRecognitionErrorEvent extends Event {
  readonly error: string
}

interface SpeechRecognitionInstance extends EventTarget {
  continuous: boolean
  interimResults: boolean
  lang: string
  maxAlternatives: number
  start(): void
  stop(): void
  abort(): void
  onresult: ((event: SpeechRecognitionEvent) => void) | null
  onerror: ((event: SpeechRecognitionErrorEvent) => void) | null
  onend: (() => void) | null
}

type SpeechRecognitionCtor = new () => SpeechRecognitionInstance

const FALLBACK_CHAIN: SpeechLangCode[] = ['ur-PK', 'en-US', 'ps-AF']

function getSpeechRecognitionCtor(): SpeechRecognitionCtor | null {
  if (typeof window === 'undefined') return null
  const w = window as Window & {
    SpeechRecognition?: SpeechRecognitionCtor
    webkitSpeechRecognition?: SpeechRecognitionCtor
  }
  return w.SpeechRecognition ?? w.webkitSpeechRecognition ?? null
}

function collectTranscript(event: SpeechRecognitionEvent): string {
  let text = ''
  for (let i = event.resultIndex; i < event.results.length; i++) {
    text += event.results[i][0]?.transcript ?? ''
  }
  return text.trim()
}

function buildLangChain(primary: SpeechLangCode): SpeechLangCode[] {
  return [primary, ...FALLBACK_CHAIN.filter((l) => l !== primary)]
}

export function useSpeechRecognition(
  onTranscript: (text: string) => void,
  contextText: string,
) {
  const [listening, setListening] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const recognitionRef = useRef<SpeechRecognitionInstance | null>(null)
  const baseTextRef = useRef('')
  const langChainRef = useRef<SpeechLangCode[]>([])
  const langIndexRef = useRef(0)

  const Ctor = getSpeechRecognitionCtor()
  const isSupported = Ctor !== null

  const stop = useCallback(() => {
    recognitionRef.current?.abort()
    recognitionRef.current = null
    setListening(false)
  }, [])

  const runRecognition = useCallback(
    (lang: SpeechLangCode) => {
      if (!Ctor) return

      const recognition = new Ctor()
      recognition.continuous = false
      recognition.interimResults = true
      recognition.lang = lang
      recognition.maxAlternatives = 1

      recognition.onresult = (event) => {
        const spoken = collectTranscript(event)
        if (!spoken) return
        const prefix = baseTextRef.current
        onTranscript(prefix ? `${prefix}${spoken}` : spoken)
      }

      recognition.onerror = (event) => {
        if (event.error === 'aborted') return

        if (
          event.error === 'no-speech' &&
          langIndexRef.current < langChainRef.current.length - 1
        ) {
          langIndexRef.current += 1
          runRecognition(langChainRef.current[langIndexRef.current])
          return
        }

        const messages: Record<string, string> = {
          'not-allowed':
            'Microphone access denied. Allow mic permission in browser settings.',
          'service-not-allowed':
            'Speech recognition is blocked. Use Chrome or Edge on localhost or HTTPS.',
          network: 'Voice input needs a network connection.',
        }
        setError(messages[event.error] ?? `Voice input error: ${event.error}`)
        setListening(false)
      }

      recognition.onend = () => {
        recognitionRef.current = null
        setListening(false)
      }

      recognitionRef.current = recognition
      setListening(true)
      setError(null)
      recognition.start()
    },
    [Ctor, onTranscript],
  )

  const start = useCallback(() => {
    if (!Ctor) {
      setError('Voice input is not supported. Please use Chrome or Edge.')
      return
    }

    const primary = inferSpeechLang(contextText)
    langChainRef.current = buildLangChain(primary)
    langIndexRef.current = 0

    const trimmed = contextText.trim()
    baseTextRef.current = trimmed ? `${trimmed} ` : ''

    runRecognition(langChainRef.current[0])
  }, [Ctor, contextText, runRecognition])

  const toggle = useCallback(() => {
    if (listening) {
      stop()
      return
    }
    start()
  }, [listening, start, stop])

  return {
    isSupported,
    listening,
    error,
    toggle,
    stop,
    clearError: () => setError(null),
  }
}

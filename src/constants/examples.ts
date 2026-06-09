export interface ExampleQuery {
  id: string
  label: string
  query: string
  tag: string
}

export const EXAMPLE_QUERIES: ExampleQuery[] = [
  {
    id: 'bail',
    label: 'How to apply for bail',
    query:
      'How can I apply for bail in Pakistan? Explain the role of an FIR, bailable vs non-bailable offences, and my rights under Articles 9 and 10.',
    tag: 'CrPC · Bail',
  },
  {
    id: 'arrest',
    label: 'Rights when arrested',
    query:
      'What are my constitutional rights when police arrest me in Pakistan? Cover Article 10, 10A, and fair trial safeguards.',
    tag: 'Constitution',
  },
  {
    id: 'fir',
    label: 'FIR & legal options',
    query:
      'What is an FIR in Pakistan, and what legal options do I have after one is registered against me?',
    tag: 'CrPC · FIR',
  },
  {
    id: 'urdu-bail',
    label: 'بیل کیسے ملتی ہے؟',
    query:
      'پاکستان میں گرفتاری کے بعد بیل (ضمانت) کیسے لی جا سکتی ہے؟ آئین کے آرٹیکل 9 اور 10 کے حوالے سے وضاحت کریں۔',
    tag: 'اردو',
  },
  {
    id: 'pashto-bail',
    label: 'څنګه ضمانت (بیل) ترلاسه کړم؟',
    query:
      'په پاکستان کې د بیل یا ضمانت غوښتنه څنګه کیږي؟ د ایف آئی آر نقش او د آئین د Article 9 او 10 حقونه تشریح کړئ.',
    tag: 'پښتو',
  },
  {
    id: 'ppc',
    label: 'Bailable offences',
    query:
      'Explain bailable and non-bailable offences under the Pakistan Penal Code with common examples.',
    tag: 'PPC',
  },
]

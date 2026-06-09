const RTL_SCRIPT =
  /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF]/

export function getTextDirection(text: string): 'rtl' | 'ltr' {
  const sample = text.slice(0, 200)
  const rtlChars = (sample.match(RTL_SCRIPT) ?? []).length
  const latinChars = (sample.match(/[A-Za-z]/g) ?? []).length
  if (rtlChars > latinChars) return 'rtl'
  return 'ltr'
}

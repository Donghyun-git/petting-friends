/**
 * Panel text in each language. To add a language: add it to LANGS, fill in
 * STRINGS and every character's `name`/`sound` (the compiler lists what is
 * missing), then add it to the `language` setting in orca-plugin.json.
 */
export const LANGS = ['ko', 'en'] as const
export type Lang = (typeof LANGS)[number]
export type Localized = Record<Lang, string>

/** The `language` setting: a language, or `auto` to follow Orca's own UI language. */
export type LanguageSetting = Lang | 'auto'

type Strings = {
  /** Mood lines from happiest to calmest, matching MOOD_STEPS in panel.ts. */
  moods: [string, string, string, string]
  bliss: string
  stageLabel: string
  moodLabel: string
  count(n: string): string
  total(n: string): string
  /** Tooltips of the button that switches between the full and the small view. */
  compactView: string
  fullView: string
}

export const STRINGS: Record<Lang, Strings> = {
  ko: {
    moods: ['최고야!! 더 해줘!', '헤헤… 기분 좋아', '음~ 거기 거기', '쓰다듬어 줄래?'],
    bliss: '골골골골… 행복해 ♥',
    stageLabel: '쓰다듬기: 누른 채 좌우로 문지르세요',
    moodLabel: '기분',
    count: (n) => `쓰담 ${n}번`,
    total: (n) => `모두 합쳐 ${n}번`,
    compactView: '작게 보기',
    fullView: '크게 보기'
  },
  en: {
    moods: ['The best!! Keep going!', 'Hehe… that feels nice', 'Mm~ right there', 'Pet me?'],
    bliss: 'Purrrrr… so happy ♥',
    stageLabel: 'Pet: hold the button down and rub left and right',
    moodLabel: 'Mood',
    count: (n) => `Pets: ${n}`,
    total: (n) => `All friends: ${n}`,
    compactView: 'Compact view',
    fullView: 'Full view'
  }
}

/** Picks the language to show. `locale` is Orca's UI language as a BCP-47 tag such as `ko` or `en-US`. */
export function resolveLang(setting: unknown, locale: string): Lang {
  const known = LANGS.find((lang) => lang === setting)
  if (known) return known
  const base = locale.toLowerCase().split('-')[0]
  return LANGS.find((lang) => lang === base) ?? 'en'
}

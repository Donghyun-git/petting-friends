import { assert, test } from 'orca/testing'
import { CHARACTERS } from './characters'
import { LANGS, resolveLang, STRINGS } from './i18n'

test('an explicit language wins over the locale', () => {
  assert.equal(resolveLang('en', 'ko'), 'en')
  assert.equal(resolveLang('ko', 'en-US'), 'ko')
})

test('auto follows the Orca locale', () => {
  assert.equal(resolveLang('auto', 'ko-KR'), 'ko')
  assert.equal(resolveLang('auto', 'en-US'), 'en')
})

test('unknown settings and locales fall back to English', () => {
  assert.equal(resolveLang(undefined, 'ja'), 'en')
  assert.equal(resolveLang('fr', 'fr-FR'), 'en')
})

test('every language has all its text', () => {
  for (const lang of LANGS) {
    assert.equal(STRINGS[lang].moods.every(Boolean), true)
    for (const c of CHARACTERS) {
      assert.ok(c.name[lang], `${c.id} name in ${lang}`)
      assert.ok(c.sound[lang], `${c.id} sound in ${lang}`)
    }
  }
})

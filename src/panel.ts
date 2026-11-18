import { CHARACTERS, type Character } from './characters'
import { resolveLang, STRINGS, type Lang } from './i18n'
import { createStrokeDetector } from './strokes'
import { STYLES } from './styles'

type Saved = {
  selected: string
  counts: Record<string, number>
  /** The person asked for the small view. */
  compact: boolean
}

/** Lowest mood for each line of STRINGS[lang].moods, happiest first. */
const MOOD_STEPS = [80, 50, 20, 0]
const BLISS_MS = 3500
const STORAGE_KEY = 'state'

// ---------------------------------------------------------------
// Page
// ---------------------------------------------------------------

const style = document.createElement('style')
style.textContent = STYLES
document.head.append(style)

document.body.innerHTML = `
  <header>
    <h1 id="name"></h1>
    <span id="says"></span>
  </header>
  <div id="stage-wrap">
    <div id="stage" tabindex="0" role="button"></div>
    <span id="mini"></span>
    <button id="toggle" type="button"></button>
  </div>
  <div id="gauge" role="progressbar" aria-valuemin="0" aria-valuemax="100">
    <div id="gauge-fill"></div>
  </div>
  <div id="stats">
    <span id="count"></span>
    <span id="total"></span>
  </div>
  <div id="picker"></div>`

function el(id: string): HTMLElement {
  const found = document.getElementById(id)
  if (!found) throw new Error(`missing #${id}`)
  return found
}

const stage = el('stage')
const picker = el('picker')
const nameLabel = el('name')
const says = el('says')
const gauge = el('gauge')
const gaugeFill = el('gauge-fill')
const countLabel = el('count')
const totalLabel = el('total')
const miniLabel = el('mini')
const toggle = el('toggle')

// ---------------------------------------------------------------
// State
// ---------------------------------------------------------------

const state: Saved = { selected: CHARACTERS[0].id, counts: {}, compact: false }
const strokes = createStrokeDetector()

let mood = 0 // 0..100
let blissUntil = 0 // 0 when not in bliss
let pressed = false
let lastX = 0
let lastMove = 0
let pointer = { x: 0, y: 0 }
let tilt = 0
let looping = false
let lastFrame = 0
let lastBurst = 0
let saysNow = ''

// `orca` is missing when the panel is opened outside Orca (a plain browser preview).
const inOrca = typeof orca !== 'undefined'
let lang: Lang = resolveLang('auto', inOrca ? orca.locale : navigator.language)

function current(): Character {
  return CHARACTERS.find((c) => c.id === state.selected) ?? CHARACTERS[0]
}

// ---------------------------------------------------------------
// Saved progress (the plugin's own storage)
// ---------------------------------------------------------------

const canStore = inOrca && orca.host.has('storage.get') && orca.host.has('storage.set')
let saveTimer: ReturnType<typeof setTimeout> | undefined

async function load(): Promise<void> {
  if (!canStore) return
  try {
    const { value } = await orca.host.call('storage.get', { key: STORAGE_KEY })
    if (!value || typeof value !== 'object' || Array.isArray(value)) return
    const saved = value as Partial<Saved>
    if (CHARACTERS.some((c) => c.id === saved.selected)) state.selected = saved.selected as string
    state.compact = saved.compact === true
    for (const c of CHARACTERS) {
      const n = saved.counts?.[c.id]
      if (typeof n === 'number' && Number.isFinite(n) && n > 0) state.counts[c.id] = Math.floor(n)
    }
  } catch (error) {
    console.warn('could not load saved pets', error)
  }
}

function save(): void {
  if (!canStore) return
  clearTimeout(saveTimer)
  saveTimer = setTimeout(() => {
    orca.host
      .call('storage.set', { key: STORAGE_KEY, value: state })
      .catch((error: unknown) => console.warn('could not save pets', error))
  }, 800)
}

// ---------------------------------------------------------------
// Rendering
// ---------------------------------------------------------------

function renderPicker(): void {
  picker.replaceChildren()
  for (const c of CHARACTERS) {
    const button = document.createElement('button')
    button.type = 'button'
    button.setAttribute('aria-pressed', String(c.id === state.selected))
    button.innerHTML = c.draw('thumb') + `<span>${c.name[lang]}</span>`
    button.addEventListener('click', () => select(c.id))
    picker.append(button)
  }
}

function renderCharacter(): void {
  const c = current()
  for (const svg of stage.querySelectorAll('svg')) svg.remove()
  stage.insertAdjacentHTML('afterbegin', c.draw('stage'))
  nameLabel.textContent = c.name[lang]
  renderStats()
}

function renderStats(): void {
  const mine = state.counts[state.selected] ?? 0
  const total = Object.values(state.counts).reduce((a, b) => a + b, 0)
  countLabel.textContent = STRINGS[lang].count(mine.toLocaleString(lang))
  totalLabel.textContent = STRINGS[lang].total(total.toLocaleString(lang))
  miniLabel.textContent = `♥ ${mine.toLocaleString(lang)}`
}

function renderMood(): void {
  gaugeFill.style.width = mood.toFixed(1) + '%'
  gauge.setAttribute('aria-valuenow', String(Math.round(mood)))
  const strings = STRINGS[lang]
  const step = MOOD_STEPS.findIndex((min) => mood >= min)
  const text = blissUntil ? strings.bliss : strings.moods[step === -1 ? MOOD_STEPS.length - 1 : step]
  if (text !== saysNow) {
    saysNow = text
    says.textContent = text
  }
}

function select(id: string): void {
  if (id === state.selected) return
  state.selected = id
  mood = 0
  blissUntil = 0
  stage.classList.remove('bliss', 'petting')
  renderCharacter()
  renderPicker()
  renderMood()
  save()
}

// ---------------------------------------------------------------
// Effects
// ---------------------------------------------------------------

function spawn(text: string, x: number, y: number, size: number): void {
  if (stage.querySelectorAll('.fx').length > 40) return
  const fx = document.createElement('span')
  fx.className = 'fx'
  fx.textContent = text
  fx.style.left = x + 'px'
  fx.style.top = y + 'px'
  fx.style.fontSize = size + 'px'
  fx.style.setProperty('--dx', (Math.random() * 60 - 30).toFixed(0) + 'px')
  fx.addEventListener('animationend', () => fx.remove())
  stage.append(fx)
}

function burst(): void {
  const rect = stage.getBoundingClientRect()
  const x = rect.width * (0.2 + Math.random() * 0.6)
  const y = rect.height * (0.25 + Math.random() * 0.45)
  spawn(Math.random() < 0.8 ? '♥' : '✦', x, y, 14 + Math.random() * 14)
}

// ---------------------------------------------------------------
// Petting
// ---------------------------------------------------------------

function pet(): void {
  const id = state.selected
  const n = (state.counts[id] = (state.counts[id] ?? 0) + 1)
  mood = Math.min(100, mood + 5)
  if (n % 6 === 0) spawn(current().sound[lang], pointer.x, pointer.y - 10, 16)
  else spawn('♥', pointer.x, pointer.y, 16 + Math.random() * 8)
  if (mood >= 100 && !blissUntil) {
    blissUntil = performance.now() + BLISS_MS
    stage.classList.add('bliss')
  }
  renderStats()
  save()
  kick()
}

function track(event: PointerEvent): void {
  const rect = stage.getBoundingClientRect()
  pointer = { x: event.clientX - rect.left, y: event.clientY - rect.top }
}

stage.addEventListener('pointerdown', (event) => {
  if (event.button !== 0) return
  pressed = true
  try {
    stage.setPointerCapture(event.pointerId)
  } catch {
    // No capture (pointer already gone): petting still works inside the stage.
  }
  lastX = event.clientX
  strokes.reset()
  track(event)
  kick()
})

stage.addEventListener('pointermove', (event) => {
  if (!pressed) return
  const dx = event.clientX - lastX
  lastX = event.clientX
  track(event)
  if (Math.abs(dx) < 0.5) return
  lastMove = performance.now()
  mood = Math.min(100, mood + Math.abs(dx) * 0.015)
  if (strokes.move(dx)) pet()
})

function release(): void {
  pressed = false
  strokes.reset()
}
stage.addEventListener('pointerup', release)
stage.addEventListener('pointercancel', release)
stage.addEventListener('lostpointercapture', release)

// Keyboard: Space or Enter gives one pet.
stage.addEventListener('keydown', (event) => {
  if (event.key !== ' ' && event.key !== 'Enter') return
  event.preventDefault()
  const rect = stage.getBoundingClientRect()
  pointer = { x: rect.width / 2, y: rect.height * 0.4 }
  lastMove = performance.now()
  pet()
})

// ---------------------------------------------------------------
// Frame loop: runs only while something is happening.
// ---------------------------------------------------------------

function kick(): void {
  if (looping) return
  looping = true
  lastFrame = performance.now()
  requestAnimationFrame(tick)
}

function tick(now: number): void {
  const dt = Math.min(0.1, (now - lastFrame) / 1000)
  lastFrame = now
  const stroking = now - lastMove < 300

  if (blissUntil) {
    if (now - lastBurst > 110) {
      lastBurst = now
      burst()
    }
    if (now >= blissUntil) {
      blissUntil = 0
      mood = 55
      stage.classList.remove('bliss')
    }
  } else if (!stroking) {
    mood = Math.max(0, mood - 9 * dt)
  }

  stage.classList.toggle('petting', stroking)

  // The head leans toward the hand.
  const half = (stage.clientWidth || 1) / 2
  const target = pressed ? Math.max(-1, Math.min(1, (pointer.x - half) / half)) * 9 : 0
  tilt += (target - tilt) * Math.min(1, dt * 12)
  stage.style.setProperty('--tilt', tilt.toFixed(2) + 'deg')

  renderMood()

  if (pressed || stroking || blissUntil || mood > 0 || Math.abs(tilt) > 0.05) {
    requestAnimationFrame(tick)
  } else {
    looping = false
  }
}

// ---------------------------------------------------------------
// Compact view: on when the person asks for it, or when the panel is
// too small for the full view anyway.
// ---------------------------------------------------------------

const tooSmall = matchMedia('(max-width: 200px), (max-height: 320px)')

function renderLayout(): void {
  const compact = state.compact || tooSmall.matches
  document.body.classList.toggle('compact', compact)
  document.body.classList.toggle('forced', tooSmall.matches)
  toggle.textContent = compact ? '+' : '−'
  const label = compact ? STRINGS[lang].fullView : STRINGS[lang].compactView
  toggle.title = label
  toggle.setAttribute('aria-label', label)
}

tooSmall.addEventListener('change', renderLayout)
toggle.addEventListener('click', () => {
  state.compact = !state.compact
  renderLayout()
  save()
})

// ---------------------------------------------------------------
// Language (the plugin's `language` setting)
// ---------------------------------------------------------------

function renderAll(): void {
  renderLayout()
  document.documentElement.lang = lang
  stage.setAttribute('aria-label', STRINGS[lang].stageLabel)
  gauge.setAttribute('aria-label', STRINGS[lang].moodLabel)
  renderCharacter()
  renderPicker()
  renderMood()
}

const canReadSettings = inOrca && orca.host.has('settings.get')

async function loadLanguage(): Promise<void> {
  if (!canReadSettings) return
  try {
    lang = resolveLang(await orca.settings.get('language'), orca.locale)
  } catch (error) {
    console.warn('could not read the language setting', error)
  }
}

if (canReadSettings) {
  orca.settings.onDidChange(() => void loadLanguage().then(renderAll))
}

// ---------------------------------------------------------------

renderAll()
void Promise.all([load(), loadLanguage()]).then(renderAll)

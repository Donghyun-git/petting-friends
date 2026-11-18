/**
 * Four original friends, drawn as inline SVG.
 *
 * Every drawing uses the same part classes (.pet .tail .head .ear .eyes-open
 * .eyes-happy .mouth .mouth-open .blush), so the reactions in styles.ts work
 * for all of them. To add a friend, add an entry to CHARACTERS.
 */
import type { Localized } from './i18n'

export type Character = {
  id: string
  name: Localized
  /** Little noise it makes every few pets. */
  sound: Localized
  /** SVG markup. `uid` keeps ids unique when the same friend is drawn twice on a page. */
  draw(uid: string): string
}

type FaceOptions = {
  y?: number
  /** Half the distance between the eyes. */
  gap?: number
  r?: number
  eye?: string
  /** Ring around the pupil, for eyes that sit on dark fur. */
  iris?: string
  /** Stroke of the closed happy eyes; defaults to the eye colour. */
  happy?: string
  nose?: string
}

function face(o: FaceOptions): string {
  const y = o.y ?? 96
  const gap = o.gap ?? 19
  const r = o.r ?? 5
  const eye = o.eye ?? '#3a2e39'
  const happy = o.happy ?? eye
  const lx = 100 - gap
  const rx = 100 + gap
  const eyeDot = (x: number) =>
    (o.iris ? `<circle cx="${x}" cy="${y}" r="${r + 2}" fill="${o.iris}"/>` : '') +
    `<circle cx="${x}" cy="${y}" r="${r}" fill="${eye}"/>` +
    `<circle cx="${x + r * 0.35}" cy="${y - r * 0.38}" r="${r * 0.34}" fill="#fff"/>`
  const arc = (x: number) => `<path d="M${x - 6} ${y + 2} q6 -9 12 0"/>`
  return `
    <g class="eyes-open">${eyeDot(lx)}${eyeDot(rx)}</g>
    <g class="eyes-happy" fill="none" stroke="${happy}" stroke-width="3.2" stroke-linecap="round">
      ${arc(lx)}${arc(rx)}
    </g>
    <ellipse class="blush" cx="${lx - 10}" cy="${y + 11}" rx="7" ry="4.5"/>
    <ellipse class="blush" cx="${rx + 10}" cy="${y + 11}" rx="7" ry="4.5"/>
    ${o.nose ? `<path d="M97 ${y + 5} h6 l-3 3.5 z" fill="${o.nose}"/>` : ''}
    <path class="mouth" d="M94 ${y + 9} q3 4 6 0 q3 4 6 0" fill="none" stroke="#3a2e39" stroke-width="2" stroke-linecap="round"/>
    <ellipse class="mouth-open" cx="100" cy="${y + 13}" rx="4.5" ry="5.5" fill="#e8697d"/>`
}

function frame(backdrop: string, inner: string): string {
  return `<svg viewBox="0 0 200 200" aria-hidden="true">
    <circle cx="100" cy="104" r="92" fill="${backdrop}"/>
    <ellipse class="shadow" cx="100" cy="188" rx="46" ry="6"/>
    <g class="pet">${inner}</g>
  </svg>`
}

export const CHARACTERS: Character[] = [
  {
    id: 'mongsil',
    name: { ko: '몽실이', en: 'Mongsil' },
    sound: { ko: '뀨!', en: 'Squee!' },
    draw() {
      const s = 'stroke="#cdb9a6" stroke-width="2.5"'
      const fur = '#fffaf3'
      return frame(
        '#ffd3de',
        `
        <g class="tail" style="transform-origin:138px 164px">
          <circle cx="144" cy="162" r="9" fill="${fur}" ${s}/>
        </g>
        <ellipse cx="82" cy="182" rx="12" ry="6.5" fill="${fur}" ${s}/>
        <ellipse cx="118" cy="182" rx="12" ry="6.5" fill="${fur}" ${s}/>
        <ellipse cx="100" cy="152" rx="40" ry="32" fill="${fur}" ${s}/>
        <ellipse cx="68" cy="150" rx="8" ry="12" fill="${fur}" ${s} transform="rotate(18 68 150)"/>
        <ellipse cx="132" cy="150" rx="8" ry="12" fill="${fur}" ${s} transform="rotate(-18 132 150)"/>
        <g class="head">
          <g class="ear ear-l">
            <circle cx="63" cy="54" r="13" fill="${fur}" ${s}/>
            <circle cx="63" cy="55" r="6" fill="#ffc9d0"/>
          </g>
          <g class="ear ear-r">
            <circle cx="137" cy="54" r="13" fill="${fur}" ${s}/>
            <circle cx="137" cy="55" r="6" fill="#ffc9d0"/>
          </g>
          <ellipse cx="100" cy="92" rx="52" ry="46" fill="${fur}" ${s}/>
          <path d="M97 47 q-3 -12 6 -13 q-5 6 1 13" fill="${fur}" ${s} stroke-linejoin="round"/>
          ${face({ y: 97 })}
        </g>`
      )
    }
  },
  {
    id: 'toto',
    name: { ko: '토토', en: 'Toto' },
    sound: { ko: '뿅!', en: 'Boing!' },
    draw() {
      const s = 'stroke="#d8a195" stroke-width="2.5"'
      const fur = '#ffdcd3'
      return frame(
        '#cfe7ff',
        `
        <g class="tail" style="transform-origin:136px 166px">
          <circle cx="143" cy="165" r="10" fill="#fff" ${s}/>
        </g>
        <ellipse cx="82" cy="182" rx="13" ry="6.5" fill="${fur}" ${s}/>
        <ellipse cx="118" cy="182" rx="13" ry="6.5" fill="${fur}" ${s}/>
        <ellipse cx="100" cy="153" rx="38" ry="31" fill="${fur}" ${s}/>
        <ellipse cx="100" cy="160" rx="22" ry="19" fill="#fff5f0"/>
        <ellipse cx="70" cy="150" rx="8" ry="12" fill="${fur}" ${s} transform="rotate(18 70 150)"/>
        <ellipse cx="130" cy="150" rx="8" ry="12" fill="${fur}" ${s} transform="rotate(-18 130 150)"/>
        <g class="head">
          <g class="ear ear-l">
            <ellipse cx="80" cy="34" rx="11" ry="30" fill="${fur}" ${s} transform="rotate(-6 80 60)"/>
            <ellipse cx="80" cy="36" rx="5" ry="20" fill="#ffb3ba" transform="rotate(-6 80 60)"/>
          </g>
          <g class="ear ear-r">
            <ellipse cx="122" cy="34" rx="11" ry="30" fill="${fur}" ${s} transform="rotate(24 122 60)"/>
            <ellipse cx="122" cy="36" rx="5" ry="20" fill="#ffb3ba" transform="rotate(24 122 60)"/>
          </g>
          <ellipse cx="100" cy="97" rx="48" ry="42" fill="${fur}" ${s}/>
          ${face({ y: 98, gap: 18, nose: '#f08a9b' })}
        </g>`
      )
    }
  },
  {
    id: 'banban',
    name: { ko: '반반이', en: 'Banban' },
    sound: { ko: '냐~', en: 'Mew~' },
    draw(uid) {
      const dark = '#4b4a58'
      const s = 'stroke="#35343f" stroke-width="2.5"'
      const fur = '#fffdf8'
      return frame(
        '#ffe7a3',
        `
        <defs>
          <clipPath id="mask-${uid}"><ellipse cx="100" cy="94" rx="52" ry="44"/></clipPath>
        </defs>
        <g class="tail" style="transform-origin:134px 168px">
          <path d="M134 168 q32 -4 26 -42" fill="none" stroke="#35343f" stroke-width="13" stroke-linecap="round"/>
          <path d="M134 168 q32 -4 26 -42" fill="none" stroke="${dark}" stroke-width="8.5" stroke-linecap="round"/>
        </g>
        <ellipse cx="82" cy="182" rx="12" ry="6.5" fill="${fur}" ${s}/>
        <ellipse cx="118" cy="182" rx="12" ry="6.5" fill="${fur}" ${s}/>
        <ellipse cx="100" cy="153" rx="38" ry="31" fill="${fur}" ${s}/>
        <ellipse cx="70" cy="151" rx="8" ry="12" fill="${fur}" ${s} transform="rotate(18 70 151)"/>
        <ellipse cx="130" cy="151" rx="8" ry="12" fill="${fur}" ${s} transform="rotate(-18 130 151)"/>
        <g class="head">
          <g class="ear ear-l">
            <path d="M56 70 L60 26 L94 52 Z" fill="${dark}" ${s} stroke-linejoin="round"/>
            <path d="M65 58 L66 39 L80 50 Z" fill="#ffb3ba"/>
          </g>
          <g class="ear ear-r">
            <path d="M144 70 L140 26 L106 52 Z" fill="${dark}" ${s} stroke-linejoin="round"/>
            <path d="M135 58 L134 39 L120 50 Z" fill="#ffb3ba"/>
          </g>
          <ellipse cx="100" cy="94" rx="52" ry="44" fill="${fur}"/>
          <path clip-path="url(#mask-${uid})" fill="${dark}"
            d="M40 30 H160 V120 Q134 122 116 104 Q106 88 100 66 Q94 88 84 104 Q66 122 40 120 Z"/>
          <ellipse cx="100" cy="94" rx="52" ry="44" fill="none" ${s}/>
          <g stroke="#35343f" stroke-width="1.6" stroke-linecap="round">
            <path d="M58 108 l-14 -3 M58 114 l-14 3 M142 108 l14 -3 M142 114 l14 3"/>
          </g>
          ${face({ y: 94, eye: '#2b2a33', iris: '#ffe27a', r: 4.5, happy: fur, nose: '#f08a9b' })}
        </g>`
      )
    }
  },
  {
    id: 'nalda',
    name: { ko: '날다', en: 'Nalda' },
    sound: { ko: '삐!', en: 'Peep!' },
    draw() {
      const fur = '#b99d8a'
      const belly = '#fff4e6'
      const s = 'stroke="#86695a" stroke-width="2.5"'
      return frame(
        '#cdebd0',
        `
        <g class="tail" style="transform-origin:134px 174px">
          <ellipse cx="152" cy="146" rx="15" ry="34" fill="${fur}" ${s} transform="rotate(26 152 146)"/>
        </g>
        <path d="M72 130 L28 150 Q24 159 33 164 L74 185 H126 L167 164 Q176 159 172 150 L128 130 Z"
          fill="${fur}" ${s} stroke-linejoin="round"/>
        <ellipse cx="100" cy="158" rx="29" ry="25" fill="${belly}"/>
        <circle cx="31" cy="157" r="6" fill="${belly}" ${s}/>
        <circle cx="169" cy="157" r="6" fill="${belly}" ${s}/>
        <g class="head">
          <g class="ear ear-l">
            <ellipse cx="66" cy="56" rx="11" ry="13" fill="${fur}" ${s}/>
            <ellipse cx="66" cy="58" rx="5" ry="7" fill="#ffc9d0"/>
          </g>
          <g class="ear ear-r">
            <ellipse cx="134" cy="56" rx="11" ry="13" fill="${fur}" ${s}/>
            <ellipse cx="134" cy="58" rx="5" ry="7" fill="#ffc9d0"/>
          </g>
          <ellipse cx="100" cy="92" rx="50" ry="44" fill="${fur}" ${s}/>
          <ellipse cx="100" cy="106" rx="33" ry="25" fill="${belly}"/>
          ${face({ y: 95, gap: 22, r: 7, nose: '#7a5a4c' })}
        </g>`
      )
    }
  }
]

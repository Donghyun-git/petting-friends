/** The panel's stylesheet. Colours come from Orca's theme variables; only fur and hearts are fixed. */
export const STYLES = /* css */ `
  * { box-sizing: border-box; }
  html, body { height: 100%; }
  body {
    margin: 0;
    padding: 12px;
    display: flex;
    flex-direction: column;
    gap: 10px;
    font: 13px var(--orca-font-sans, system-ui, sans-serif);
    color: var(--orca-foreground);
    background: var(--orca-background);
    user-select: none;
    -webkit-user-select: none;
    overflow: hidden;
  }

  header {
    display: flex;
    align-items: baseline;
    justify-content: space-between;
    gap: 8px;
  }
  #name { margin: 0; font-size: 15px; font-weight: 600; }
  #says {
    color: var(--orca-muted-foreground);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  #stage-wrap {
    position: relative;
    display: flex;
    flex: 1 1 auto;
    min-height: 140px;
  }
  #stage {
    position: relative;
    flex: 1 1 auto;
    border: 1px solid var(--orca-border);
    border-radius: var(--orca-radius, 8px);
    background: var(--orca-card);
    cursor: grab;
    touch-action: none;
    overflow: hidden;
    --tilt: 0deg;
  }
  #stage:active { cursor: grabbing; }
  #stage:focus-visible { outline: 2px solid var(--orca-ring); outline-offset: 1px; }
  #stage svg {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
  }

  /* ---- character parts ---- */
  .shadow { fill: rgba(0, 0, 0, 0.14); }
  .head {
    transform-origin: 100px 135px;
    transform: rotate(var(--tilt));
    transition: scale 0.15s ease-out;
  }
  .tail { animation: wag 2.4s ease-in-out infinite alternate; }
  .ear { transform-box: fill-box; transform-origin: 50% 100%; }
  .eyes-open {
    transform-box: fill-box;
    transform-origin: center;
    animation: blink 4.2s infinite;
  }
  .eyes-happy, .mouth-open { display: none; }
  .blush { fill: #ff9fb0; opacity: 0.55; transition: opacity 0.2s; }

  /* ---- being petted ---- */
  .petting .eyes-open { display: none; }
  .petting .eyes-happy { display: inline; }
  .petting .blush { opacity: 0.95; }
  .petting .head { scale: 1.04 0.95; }
  .petting .tail { animation-duration: 0.45s; }
  .petting .ear-l { animation: earL 0.5s ease-in-out infinite alternate; }
  .petting .ear-r { animation: earR 0.5s ease-in-out infinite alternate; }
  .petting .pet { animation: bob 0.5s ease-in-out infinite alternate; }

  /* ---- gauge full: over the moon ---- */
  .bliss .eyes-open, .bliss .mouth { display: none; }
  .bliss .eyes-happy, .bliss .mouth-open { display: inline; }
  .bliss .blush { opacity: 1; }
  .bliss .tail { animation-duration: 0.22s; }
  .bliss .pet {
    transform-origin: 100px 185px;
    animation: jump 0.36s ease-in-out infinite;
  }

  @keyframes wag { from { transform: rotate(-7deg); } to { transform: rotate(9deg); } }
  @keyframes blink {
    0%, 93%, 100% { transform: scaleY(1); }
    96% { transform: scaleY(0.1); }
  }
  @keyframes earL { to { transform: rotate(-9deg); } }
  @keyframes earR { to { transform: rotate(9deg); } }
  @keyframes bob { to { transform: translateY(3px); } }
  @keyframes jump {
    0%, 100% { transform: translateY(0) rotate(-3deg) scale(1.03, 0.97); }
    50% { transform: translateY(-12px) rotate(3deg) scale(0.98, 1.03); }
  }

  /* ---- floating hearts and little noises ---- */
  .fx {
    position: absolute;
    pointer-events: none;
    color: #ff5c93;
    font-weight: 700;
    text-shadow: 0 1px 0 rgba(255, 255, 255, 0.7);
    white-space: nowrap;
    animation: floatUp 1.1s ease-out forwards;
  }
  @keyframes floatUp {
    from { opacity: 1; transform: translate(-50%, -50%) scale(0.6); }
    to {
      opacity: 0;
      transform: translate(calc(-50% + var(--dx)), calc(-50% - 70px)) scale(1.25);
    }
  }

  /* ---- mood gauge ---- */
  #gauge {
    height: 10px;
    border: 1px solid var(--orca-border);
    border-radius: 999px;
    background: var(--orca-muted);
    overflow: hidden;
  }
  #gauge-fill {
    height: 100%;
    width: 0%;
    border-radius: 999px;
    background: linear-gradient(90deg, #ffb3c7, #ff5c93);
  }
  #stats {
    display: flex;
    justify-content: space-between;
    color: var(--orca-muted-foreground);
    font-variant-numeric: tabular-nums;
  }

  /* ---- picker ---- */
  #picker { display: grid; grid-template-columns: repeat(4, 1fr); gap: 6px; }
  #picker button {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 2px;
    padding: 4px 2px;
    font: inherit;
    font-size: 11px;
    color: var(--orca-muted-foreground);
    background: transparent;
    border: 1px solid var(--orca-border);
    border-radius: var(--orca-radius, 8px);
    cursor: pointer;
  }
  #picker button:hover { background: var(--orca-accent); color: var(--orca-accent-foreground); }
  #picker button:focus-visible { outline: 2px solid var(--orca-ring); outline-offset: 1px; }
  #picker button[aria-pressed='true'] {
    border-color: var(--orca-primary);
    box-shadow: 0 0 0 1px var(--orca-primary);
    color: var(--orca-foreground);
  }
  #picker svg { width: 100%; max-width: 56px; aspect-ratio: 1; }
  #picker .tail, #picker .eyes-open { animation: none; }

  /* ---- compact view: just the friend, small, out of the way ---- */
  #toggle {
    position: absolute;
    top: 6px;
    right: 6px;
    width: 22px;
    height: 22px;
    padding: 0;
    font: inherit;
    font-size: 14px;
    line-height: 1;
    color: var(--orca-muted-foreground);
    background: var(--orca-card);
    border: 1px solid var(--orca-border);
    border-radius: 6px;
    opacity: 0.5;
    cursor: pointer;
  }
  #toggle:hover, #toggle:focus-visible { opacity: 1; color: var(--orca-foreground); }
  #toggle:focus-visible { outline: 2px solid var(--orca-ring); outline-offset: 1px; }
  /* The panel is too small for the full view, so there is nothing to switch to. */
  body.forced #toggle { display: none; }
  #mini {
    display: none;
    position: absolute;
    left: 8px;
    top: 8px;
    font-size: 11px;
    color: var(--orca-muted-foreground);
    font-variant-numeric: tabular-nums;
    pointer-events: none;
  }

  body.compact {
    --compact: min(100%, 200px, 100vh - 56px);
    padding: 6px;
    gap: 5px;
  }
  body.compact header, body.compact #stats { display: none; }
  body.compact #stage-wrap {
    flex: 0 0 auto;
    width: var(--compact);
    min-width: 72px;
    min-height: 0;
    aspect-ratio: 1;
  }
  body.compact #mini { display: block; }
  body.compact #gauge { width: var(--compact); min-width: 72px; height: 6px; flex: 0 0 auto; }
  body.compact #picker { width: var(--compact); min-width: 72px; gap: 4px; }
  body.compact #picker button { padding: 2px; }
  body.compact #picker span { display: none; }
  body.compact #picker svg { max-width: 30px; }
  @media (max-height: 190px) {
    body.compact { --compact: min(100%, 200px, 100vh - 12px); }
    body.compact #gauge, body.compact #picker { display: none; }
  }

  @media (prefers-reduced-motion: reduce) {
    .tail, .eyes-open, .petting .pet, .petting .ear-l, .petting .ear-r, .bliss .pet {
      animation: none;
    }
  }
`

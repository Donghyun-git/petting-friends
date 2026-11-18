# Petting Friends

**English** | [한국어](README.ko.md)

A just-for-fun Orca plugin: pet a cute friend in the right sidebar.

- Hold the mouse button down on your friend and **rub left and right** to pet it. Every time your hand turns around counts as one pet.
- The more you pet, the more the mood gauge fills. When it is full, your friend goes into a purring frenzy.
- Four friends to choose from with the buttons below: Mongsil, Toto (rabbit), Banban (cat), Nalda (flying squirrel).
- Your pet counts and chosen friend are kept in the plugin's own storage (`storage:own`).
- Compact view: the `−` button at the top right of your friend leaves just the friend at 200px (`+` brings the full view back). A very narrow or short panel switches to it by itself.
- Keyboard: focus the friend and press Space or Enter.
- Language: choose Auto / 한국어 / English under **Language / 언어** in Orca Settings → Plugins → Petting Friends (`settings:own`). Auto follows Orca's own language.

## Layout

Written in TypeScript with **no build step**: Orca transpiles the `.ts` files when it loads them.

| File                | What it does                                                        |
| ------------------- | ------------------------------------------------------------------- |
| `orca-plugin.json`  | Manifest: the panel, the setting and the access the plugin asks for |
| `src/panel.ts`      | Panel entry: page, pointer input, mood gauge, saving                |
| `src/characters.ts` | The friends' SVG drawings (the `CHARACTERS` array)                  |
| `src/strokes.ts`    | Decides what counts as a pet (pure logic, no DOM)                   |
| `src/styles.ts`     | Styles and reaction animations                                      |
| `src/i18n.ts`       | Text per language and the language choice                           |
| `src/*.test.ts`     | Tests for the petting logic and the language choice                 |

## Run it in Orca

The Orca desktop app must be running.

```sh
orca plugin dev watch . --check
```

1. The first run needs approval: it exits with code 3 and prints the access the plugin asks for, plus the command to run with `--approve <fingerprint>`.
   It asks for three things: running its code in a sandboxed panel, its own storage, and reading and changing its own settings.
2. Read that list, then run the printed command as it is.
   ```sh
   orca plugin dev watch . --check --approve ap1-...
   ```
3. Click the star icon (Petting Friends) in the right sidebar's activity bar.
   From a terminal: `orca plugin open local.petting-friends --panel petting-friends`.
4. While the watch runs, saving a file reloads the panel at once. Errors show in the watch output as `[frame] file:line`.
5. `Ctrl-C` stops the watch and unloads the plugin.

Code edits need no new approval. Asking for more access does, with a new fingerprint.

## Contributing

```sh
npm install         # only typescript, for type checking
orca plugin types . # writes Orca's typings to .orca/types (dev watch does this too)
npm run check       # type check + tests + manifest validation
```

- Loading never type-checks, so run `npm run check` before you push.
- Imports can only be `orca`, `orca/*` and relative files. npm packages cannot be imported.
- There is no network access. Drawings go in as inline SVG.
- Colours come from the `--orca-*` theme variables; only fur and hearts have fixed colours.

### Adding a friend

Add one entry to `CHARACTERS` in `src/characters.ts`; its picker button appears by itself.
Draw in `viewBox="0 0 200 200"` and use the shared part classes so the reactions work:
`.tail`, `.head`, `.ear.ear-l` / `.ear.ear-r`, and the eyes, mouth and blush that `face()` makes.
Give the name and sound in every language (the compiler tells you what is missing).
Original designs only, please: no drawings of other people's characters.

### Adding a language

Add it to `LANGS` and `STRINGS` in `src/i18n.ts` and to each friend's `name`/`sound`,
then to the `enum`/`enumLabels` of the `language` setting in `orca-plugin.json`.
When you change the docs, update `README.md` and `README.ko.md` together.

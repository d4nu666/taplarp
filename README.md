# Taplarp 🤡→😎💯

A satirical tap/idle game about climbing the internet grift ladder — from broke **Bozo** to **MAXLARPER**. Tap to hustle, buy increasingly absurd "businesses" (all parody names, no real brands), and rank up.

See [`DESIGN.md`](./DESIGN.md) for the full game design (economy, generator tiers, rank ladder, tone guidelines, roadmap).

## Run it locally

No build step — it's plain HTML/CSS/JS.

**Easiest:** double-click `index.html` to open it in a browser.

**Recommended (so `localStorage` behaves like a normal site):**

```bash
cd taplarp
python3 -m http.server 8000
# then open http://localhost:8000
```

or with Node:

```bash
npx serve .
```

## Project structure

```
taplarp/
├── index.html    # markup/structure
├── style.css     # visual design, animations
├── script.js     # game state, loop, save/load
├── DESIGN.md      # full game design doc
└── README.md      # this file
```

## Roadmap to iOS

The game was deliberately built with zero framework/build dependencies so it can be wrapped almost as-is:

1. **Wrap with [Capacitor](https://capacitorjs.com/):**
   ```bash
   npm init -y
   npm install @capacitor/core @capacitor/cli
   npx cap init taplarp com.yourname.taplarp
   npx cap add ios
   npx cap copy
   npx cap open ios
   ```
   Capacitor treats `index.html`/`style.css`/`script.js` as your `www/` folder — copy them in as-is (or point `webDir` at this folder in `capacitor.config.json`).

2. **Things to add before an App Store submission:**
   - App icon + splash screen assets.
   - Haptic feedback on tap/rank-up via the `@capacitor/haptics` plugin.
   - Sound effects (tap, rank-up, cash register on generator purchase).
   - Review Apple's guidelines on apps that reference making money — frame everything clearly as comedy/satire in the App Store description, not as financial guidance (the in-game copy is already written this way).
   - Decide on monetization (this game currently has none): rewarded ads for a temporary income boost, or a cosmetic-only IAP (e.g. alternate tap-button skins) fit the tone without breaking the "line goes up" loop.

3. **Nice-to-haves once wrapped:**
   - Local push notification when a big offline-earnings milestone is ready to collect.
   - Prestige/"Rebrand" reset loop for replayability (see DESIGN.md roadmap).

## Notes

Every business/platform name in this game (`ClawedAI`, `Cordway`, etc.) is an invented parody — intentionally, so the game and any future App Store listing don't reference real companies or trademarks.

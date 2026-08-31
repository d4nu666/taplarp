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

## Roadmap to Google Play

Same idea as the iOS path above: wrap the existing `index.html`/`style.css`/`script.js` with Capacitor, but target Android instead.

```bash
npm install @capacitor/core @capacitor/cli
npx cap init taplarp com.yourname.taplarp
npx cap add android
npx cap copy
npx cap open android   # opens Android Studio
```

From Android Studio: set `targetSdkVersion` to **36** (Android 16) in `android/app/build.gradle` — Google requires new apps to target API 36+ as of August 31, 2026 — then build a **signed Android App Bundle (.aab)** for release (Build → Generate Signed Bundle). Let Google manage the signing key via **Play App Signing** (the default/recommended option) rather than keeping your own upload key.

**Google Play Console checklist before you can publish:**

1. **Developer account** — one-time $25 fee, 18+, personal or organization account, accept the Developer Distribution Agreement. Google is also rolling out a separate, broader **Android Developer Verification** requirement (name/address/ID, effective September 2026) for registering apps on certified Android devices — check the Play Console at signup time to see what it's currently asking for.
2. **Closed testing gate (new personal accounts only)** — before you can request production access you must run a closed test with **at least 12 testers opted in continuously for 14 days**. Practically: create a Closed testing track, share the opt-in link with 12+ people (friends, a subreddit, testing-exchange communities), wait out the 14 days, then apply for production access from the Play Console dashboard.
3. **Store listing** — app icon (512×512), feature graphic (1024×500), a few phone screenshots, short (80 char) and full description, category (Games → Simulation or Casual fits), contact email, and a **privacy policy URL** (required even for a no-data-collection game — a one-page "we don't collect personal data" statement is enough here).
4. **Data safety section** — since the game only uses `localStorage` on-device with no accounts, analytics, or servers, this should be a straightforward "No data collected" declaration. Revisit it if you add ads or an analytics SDK later.
5. **Content rating questionnaire (IARC)** — answer honestly; expect something like Everyone 10+ or Teen given the crude-humor meme references (no real violence, gambling, or sexual content). Declare "no simulated gambling" — Stacks aren't wagered, just earned/spent.
6. **App content / target audience declarations** — do **not** mark this as designed for children given the grift-culture satire, and make sure the store listing copy reads clearly as comedy (e.g. "satirical idle clicker") rather than anything that could be misread as a real money-making or investment app — Google (like Apple) enforces strict policies against apps that imply real financial gain, and this game's whole premise pattern-matches that category at a glance.
7. **First review** — typically resolves within about a week once production access is requested.

Total unavoidable cost to publish is the one-time $25 developer fee; everything else above is process, not spend.

## Roadmap to Steam

Steam only distributes native desktop apps, not web pages, so the game needs a thin desktop wrapper first. That's what's in the `desktop/` folder: an **Electron** shell that loads the exact same `index.html`/`style.css`/`script.js` used everywhere else, so there's still only one copy of the actual game.

**Run it:**

```bash
cd desktop
npm install
npm start
```

That opens Taplarp in its own resizable window — confirmed working (see `desktop/main.js`'s smoke-test mode, which loads the game headlessly and screenshots it for quick regression checks: `TAPLARP_SMOKE_TEST=1 npm start`).

**Steamworks / Steam Direct checklist:**

1. **Steamworks account** — needs an existing Steam account with at least $5 of purchase history, then a one-time **$100 Steam Direct fee per game** (recouped out of your first $1,000 in sales), plus tax forms and banking details.
2. **30-day clock** — Valve requires a mandatory ~30-day wait between creating the app in Steamworks and being able to release it, so start this well before any target launch date, even if the build isn't finished yet.
3. **Store page** — at least 5 screenshots, capsule/header images at Steam's specific pixel sizes, a description, tags/genre (Casual/Simulation fits), and pricing. Submit the store page for review a week or so before launch (review typically takes 3-5 business days).
4. **Build upload** — package the Electron app for Windows/Mac/Linux (via `electron-builder` or `electron-forge` — not set up yet in this scaffold, since the right packaging config depends on final art/signing decisions), then upload through Valve's **SteamPipe**/ContentBuilder tool. The build also goes through a 3-5 business day review before it can go live.
5. **Steamworks API integration (optional but a natural fit)** — the rank ladder maps directly onto Steam achievements (one per rank, Bozo → MAXLARPER), and Steam Cloud could sync the save file across machines. The current recommended library for Electron is [`steamworks.js`](https://github.com/ceifa/steamworks.js) (the older `greenworks` is unmaintained) — this needs a real Steam App ID to test against, so it's a step for after your Steamworks account/app exists, not before.
6. **Steam Deck** — since this is just a lightweight local web app in a window, it should run on Deck without extra work; the one gap is that the game currently only handles mouse/touch input, so if you want native gamepad/trackpad-button support you'd add a small key/gamepad handler that also triggers `onTap()`.

Total unavoidable cost to publish on Steam is the $100 Steam Direct fee (recoupable) — everything else above is packaging work and lead time, mainly the 30-day waiting period.

## Notes

Every business/platform name in this game (`ClawedAI`, `Cordway`, etc.) is an invented parody — intentionally, so the game and any store listing (Google Play, the App Store, or Steam) don't reference real companies or trademarks.

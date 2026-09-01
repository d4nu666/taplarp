# Taplarp 🤡→😎💯

A satirical tap/idle game about climbing the internet grift ladder — from broke **Bozo** to **MAXLARPER**. Tap to hustle, buy increasingly absurd "businesses" (all parody names, no real brands), and rank up.

Taplarp is a **web game** — it runs entirely in the browser, with no native app, no build step, and no platform wrapper.

**Play it live:** https://d4nu666.github.io/taplarp/ (once GitHub Pages is enabled -- see below)

See [`DESIGN.md`](./DESIGN.md) for the full game design (economy, generator tiers, rank ladder, tone guidelines).

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

## Deploying it

Since it's static HTML/CSS/JS with no server, it can be hosted anywhere that serves static files — GitHub Pages, Netlify, Vercel, Cloudflare Pages, or any plain web host. Just upload/point at `index.html`, `style.css`, and `script.js`.

### GitHub Pages (this repo)

1. Push `main` to GitHub (`git push`).
2. Make sure the repo is **public** -- GitHub's free plan only serves Pages from public repos (GitHub Pro/Team is needed to publish from a private one).
3. On GitHub: **Settings -> Pages -> Build and deployment -> Source: "Deploy from a branch"**, branch **main**, folder **/ (root)** -> **Save**.
4. Wait a minute or two -- it'll be live at `https://<your-username>.github.io/<repo-name>/`.

A `.nojekyll` file is included so GitHub serves the files as-is instead of running them through Jekyll.

## Project structure

```
taplarp/
├── index.html      # markup/structure
├── style.css       # visual design, animations
├── script.js       # game state, loop, save/load
├── DESIGN.md        # full game design doc
├── README.md        # this file
└── .gitignore
```

## Notes

Every business/platform name in this game (`ClawedAI`, `Cordway`, etc.) is an invented parody — intentionally, so the game doesn't reference real companies or trademarks.

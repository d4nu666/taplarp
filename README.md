# Taplarp 🤡→😎💯

A satirical tap/idle game about climbing the internet grift ladder — from broke **Bozo** to **MAXLARPER**. Tap to hustle, buy increasingly absurd "businesses" (all parody names, no real brands), and rank up.

Taplarp is a **web game** — it runs entirely in the browser, with no native app, no build step, and no platform wrapper.

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

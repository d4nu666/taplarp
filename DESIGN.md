# Taplarp — Game Design Document

**Genre:** Idle / incremental tapper (Cookie Clicker–style), satirical "hustle culture" theme
**Platform plan:** Browser (HTML5/CSS/JS) first → wrapped as a native iOS app later via Capacitor
**Tone:** Meme-y, self-aware, satirizes internet "get rich quick" / fake-guru culture. Nobody in this game is a real person, brand, or company — every name is an obvious parody.

---

## 1. Premise

You start as a **Bozo** with $0 and a dream. You tap your phone to hustle up cash, then reinvest that cash into increasingly absurd "businesses" that are all thin parodies of real online money-grift tactics: an AI chatbot subscription that "writes" money-making courses for you, a paid Discord-style server where people pay to access those courses, and renting exotic cars to fake a lifestyle for social media so more people join your server. The more money you fake your way into, the higher your **Larp Rank** climbs — from Bozo all the way to the mythical **MAXLARPER**.

The game is a light satire, not a real business simulator or financial advice — nothing in it depicts real companies, real platforms, or real people.

## 2. Core Loop

1. **Tap** the hustle button to earn Stacks (the currency).
2. **Spend** Stacks on Generators — passive income sources that earn Stacks per second even while you're not tapping.
3. **Unlock** new, more absurd Generators as your lifetime earnings cross thresholds.
4. **Rank up** through the Larp Ladder as lifetime earnings grow, each rank-up delivering a title, a flavor joke, and a little dopamine hit (toast + animation).
5. Repeat, watching numbers climb, until you hit **MAXLARPER**.

This is the standard idle-game loop (tap → buy generators → exponential growth → milestones) reskinned with the user's grift-ladder narrative.

## 3. Currency

**Stacks ($)** — the only currency. Displayed with standard abbreviations at scale (1.2K, 3.4M, etc).

Two running totals matter internally:
- `stacks` — current spendable balance
- `lifetimeStacks` — total ever earned (never decreases; this is what drives rank-ups and generator unlocks, so spending never "de-ranks" you)

## 4. Tapping

- Base tap value: **$1** per tap.
- Upgrade: **"Bigger Bag Energy"** — each purchase adds +$1 to tap value. Cost scales `25 * 1.6^level`.
- Tapping matters most early game and becomes a "bonus on top of idle income" later — this mirrors real idle games and keeps tapping satisfying without making it mandatory late game.

## 5. Generators ("The Grift Ladder")

Each generator has: a display name/emoji, a base cost, a cost-scaling multiplier (cost rises ~15–18% per unit owned, standard idle-game curve), a production rate per unit owned (Stacks/second), and a lifetime-earnings threshold that unlocks it (keeps the shop from overwhelming a new player and paces the narrative).

| # | Generator (parody flavor) | Emoji | Unlocks at (lifetime $) | Base cost | Rate / unit / sec | Cost mult |
|---|---|---|---|---|---|---|
| 1 | **ClawedAI Pro** — an AI chatbot subscription that auto-generates "make money online" courses | 🤖 | $25 | $50 | $0.5 | 1.15 |
| 2 | **Cordway VIP Server** — a paid chat server where people pay to "get close to" your courses | 💬 | $300 | $500 | $5 | 1.16 |
| 3 | **Rental Flex Content** — renting exotic cars and filming fits/reels to drive server signups | 🏎️ | $5,000 | $8,000 | $70 | 1.17 |
| 4 | **Coaching-the-Coaches Empire** — a meta-course teaching other larpers how to sell courses | 🎓 | $100,000 | $150,000 | $1,200 | 1.18 |

Total passive income per second = sum of (units owned × rate) across all owned generators. This is added to `stacks` and `lifetimeStacks` every game tick (10×/second, in small increments, so the counter feels alive).

Why these four and in this order: they follow the user's original pitch exactly (AI subscription → paid Discord-style server → car-rental flex-posting) with a 4th "meta" tier added for late-game depth so the game doesn't run out of content right before Maxlarper.

## 6. The Larp Ladder (Rank Titles)

Ranks are cosmetic-narrative milestones keyed to `lifetimeStacks`. Reaching one triggers a full-screen toast: rank icon, new title, and a one-line meme joke. This is the "bozo, son, ... maxlarper" progression from the original pitch, fleshed into a full ladder that paces alongside the generator unlocks above:

| Lifetime $ | Rank | Emoji | Flavor line |
|---|---|---|---|
| $0 | Bozo | 🤡 | "You have $0 and a dream." |
| $25 | NPC | 🚶 | "Still walking to a 9-to-5, unfortunately." |
| $150 | Wagie | 💼 | "Trading time for money like a sucker." |
| $750 | Grindset Newbie | 📈 | "5am cold showers. Mandatory." |
| $3,000 | Son | 👦 | "Ay, you already up? Get in, son." |
| $12,000 | Sigma Bro | 🗿 | "Mewing, maxxing, and slightly unhinged." |
| $60,000 | Certified Guru | 🧘 | "You've never had a real job, but you teach business now." |
| $250,000 | Sensei | 🥋 | "Disciples. You have disciples now." |
| $1,000,000 | Larper | 🎭 | "The lifestyle is 90% rented and 10% real." |
| $5,000,000 | **MAXLARPER** | 😎💯 | "You have ascended. Nothing about this is real, and it doesn't matter." |

Reaching MAXLARPER shows an "ascension" screen and is the current end of content (see Roadmap for a prestige/New Game+ loop to extend replay value).

## 7. Progression Pacing (why these numbers)

Unlock thresholds and rank thresholds intentionally interleave, so the player is never grinding the same static shop for too long before something new appears (new generator OR new title) roughly every 2–5x growth in net worth:

$0 → $25 (Bozo→NPC, ClawedAI unlocks) → $150 (NPC→Wagie) → $300 (Cordway unlocks) → $750 (Wagie→Newbie) → $3,000 (Newbie→Son) → $5,000 (Rental Flex unlocks) → $12,000 (Son→Sigma Bro) → $60,000 (Sigma Bro→Guru) → $100,000 (Coaching Empire unlocks) → $250,000 (Guru→Sensei) → $1,000,000 (Sensei→Larper) → $5,000,000 (Larper→MAXLARPER)

This was verified by simulation (see `balance_check.py` notes in the repo / verification step) to make sure there's no "dead zone" where a player has nothing worth saving up for.

## 8. Offline Progress

On load, the game checks `Date.now()` against the last-saved timestamp and grants offline earnings at the player's saved production rate, capped at **8 hours** (standard idle-game anti-abuse cap, keeps the game feeling generous without letting a player earn infinite money by leaving the tab closed for a week). Shown as a "While you were larping..." summary modal.

## 9. Tone & Copy Guidelines

- Everything is a wink, never a real brand, platform, or person. "ClawedAI", "Cordway", "Rental Flex" — invented names only.
- Self-deprecating, not mean — the joke is on grift culture in general, not on any real individual or company.
- No real financial claims, no actual "how to get rich" advice — purely satirical numbers-go-up idle mechanics.
- Copy should read like it was written by the character the game is satirizing (a little unhinged, over-confident, slightly cringe) — that's the joke.

## 10. Tech Stack

- Plain HTML5 + CSS3 + vanilla JavaScript (no build step, no framework) — runs by opening `index.html` in any browser.
- `localStorage` for save/load (autosave every few seconds + on tab close).
- Chosen specifically so the exact same code can be wrapped 1:1 with **Capacitor** for an iOS build later with minimal rework (see README.md).

## 11. Roadmap / Future Ideas (not in this first playable build)

- **Prestige loop ("Rebrand"):** after hitting MAXLARPER, let the player reset progress for a permanent multiplier ("Personal Brand Points") — classic idle-game replay hook.
- **Random events:** "A follower is asking for a refund" (-$), "Your video went viral" (+$ burst), etc.
- **Cosmetic customization:** unlockable avatar/emoji sets per rank.
- **Sound & haptics:** tap feedback, rank-up stinger — trivial to add once wrapped for iOS (Capacitor Haptics plugin).
- **iOS-specific:** App Store copy needs to clearly frame this as satire/comedy, not real financial guidance, per Apple review guidelines around apps referencing making money.

## 12. File Structure

```
taplarp/                 # git repo (origin: d4nu666/taplarp)
├── index.html            # markup/structure (the web game)
├── style.css             # visual design, animations
├── script.js             # game state, loop, save/load
├── DESIGN.md             # this document
├── README.md             # how to run + Android/iOS/Steam packaging notes
├── .gitignore
└── desktop/               # Electron shell -- first step toward a Steam build
    ├── main.js            # loads ../index.html into a native window
    ├── package.json
    └── .gitignore
```

The web game (`index.html`/`style.css`/`script.js`) is the single source of truth --
the desktop shell and any future Capacitor (iOS/Android) wrapper all load these same
three files rather than keeping their own copies.

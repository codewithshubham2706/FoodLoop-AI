# FoodLoop AI — UI/UX Brief

**Live reference:** design tokens in `src/index.css` · flow details in [03-app-flow.md](03-app-flow.md)

## 1. Design principles

1. **One clear action per screen.** Primary CTA is *Join the pilot*; everything else is secondary or demo exploration.
2. **Explain, don't dazzle.** Every AI number pairs with its factor breakdown; no unexplained scores.
3. **Trust through safety-first copy.** Quality grades always show their signals (temp, CV, rules) — vision never claims microbiological safety.
4. **Calm, fresh, institutional.** Deep-green palette signals sustainability; generous whitespace reads "ops tool", not "consumer app".
5. **Accessible by default.** AA contrast, visible focus, keyboard paths, reduced-motion respected.

## 2. Brand tokens

| Token | Value | Use |
| --- | --- | --- |
| `--brand-800` | `#0B3D2E` | Primary brand, dark sections |
| `--brand-500` | `#1B7A5C` | Focus rings, chart fills |
| `--accent` | `#0B7A4F` | Primary buttons (AA on white) |
| `--accent-soft` | `#D7F2E4` | Badges, icon chips |
| `--ink` / `--ink-soft` / `--ink-faint` | `#14231C` / `#3C5247` / `#4A6155` | Text hierarchy on light |
| `--on-dark-soft` / `--on-dark-faint` | `#D3E7DD` / `#9DBFAF` | Text on brand-900/800 |
| `--danger` | `#B42318` | Errors, REJECT signals |
| Radius | 10 / 14 / 20 px | inputs / cards / large |
| Font | Plus Jakarta Sans 400–800 | Headings 800, body 400–600 |

Logo: loop-arrow + leaf mark (`public/brand/favicon.svg`) — regeneration loop representing the
closed loop; `em` in the wordmark is accent-colored ("FoodLoop **AI**").

## 3. Layout system

- Container `min(1080px, 100% - 40px)`; 28px gutters under 560px.
- Grids: engines/extras 4-col → 2-col (≤980px) → 1-col (≤560px); pipeline 7 → 3 → 2.
- Sections: 72px vertical rhythm (52px mobile); cards on `--surface` with 1px border + soft shadow.
- Sticky header (66px) with blur; mobile nav collapses ≤860px into accessible disclosure.

## 4. Component conventions

- **Buttons:** `.btn-primary` (accent bg, white text), `.btn-ghost` (bordered), `.btn-on-dark`;
  min-height 44px touch target; spinner state for async; disabled while pending.
- **Forms:** labels always visible; errors inline with `role="alert"` + `aria-invalid`;
  focus moves to first invalid field; honeypot visually hidden.
- **Tables:** scroll-wrapped on mobile; `caption.sr-only`; `th[scope=col]`.
- **Badges:** grade (A/B), status chips, tier chips — color + text (never color alone).
- **Empty/error states:** friendly copy + recovery action ("This plate is empty" 404, trace-not-found with demo chips).

## 5. Accessibility contract (WCAG 2.1 AA)

- Contrast pairs audited by `npm run check:contrast` (script in `scripts/contrast-check.mjs`).
- Landmarks: `header/main/footer/nav[aria-label]`; skip-link to `#main`.
- Icon-only buttons carry `aria-label`; decorative icons `aria-hidden`.
- Visible `:focus-visible` ring (3px brand-500) on all interactive elements.
- `prefers-reduced-motion` kills animations; no motion conveys meaning.
- Form errors announced (`role="alert"`); live regions for async status.

## 6. Imagery & icons

- All `<img>` carry descriptive `alt`; decorative images use `alt=""`.
- Demo QR image: `alt="QR code linking to demo batch FL-2026-0042 trace page"`.
- Icons: lucide-react, sized 13–24px, always paired with text or labelled.
- Images ship as compressed PNG (palette) or SVG; brand assets ≤ 40 KB; OG image 38 KB.

## 7. Motion

- 150–250ms eases on hover/focus; no parallax; no autoplaying video.
- Hero panel is static glassmorphism — decor only (`aria-hidden`).

## 8. Pre-launch UX checklist (implemented in this repo)

- [x] One clear CTA (`Join the pilot`) repeated consistently (hero, header, 404).
- [x] Custom 404 with recovery links (React route + static `404.html`).
- [x] Form validation with accessible errors; anti-spam (honeypot + time-trap).
- [x] Cookie consent banner (essential vs analytics; withdrawable).
- [x] Mobile-first responsive at 360/390/768/1024/1440 breakpoints.
- [x] Contrast-checked palette; alt text everywhere; visible focus.

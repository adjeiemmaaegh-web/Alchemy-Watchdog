# ALCHEMY — marketing website package

## Launch locally
Double-click `index.html` in an up-to-date browser. No build system or installation required. All eleven pages use shared `assets/style.css` and `assets/app.js`.

## What is included
- Unified Alchemy parent brand and dedicated Watchdog and Tallybook pages.
- Responsive navigation, product cards, accessible FAQ accordions, illustrative dashboards, contact inquiry flow.
- Favicon and logo SVGs, one AI-generated **concept image** clearly identified as concept art.
- Draft privacy notice and website terms.

## Critical pre-publication tasks
1. Replace placeholder `hello@alchemy.example` in `assets/app.js` with a verified official inbox. The current form opens an email program. It **does not save or send website registrations**. Connect consent-based secure registration handling separately if a real waitlist is required.
2. Review privacy terms, business name, data retention, email/contact details and legal documents with appropriate advisers.
3. Approve product claims and screenshots against verified current releases; sample UI and the generated image are **not** product screenshots or accuracy evidence.
4. Confirm live Tallybook connection and real CPU AI inference remain deferred before any release claims.
5. Test deployment on actual hosting, confirm TLS, domain/SEO settings, mobile browsers, email workflow and accessibility.
6. Optional: self-host web fonts or remove the Google Fonts CSS import if completely offline website assets are desired.

## Developer details
Pure HTML/CSS/vanilla JS. No npm, APIs, remote forms or external JS libraries. Sitemap can be authored after the final domain is chosen. No actual payment, subscriptions, software downloads, or automated surveillance claims.

## Watchdog learning and FAQ
- `learn.html`: six beginner lessons with one multiple-choice question each. Browser-local completion only, no accounts or telemetry. Reset progress clears the local completion markers.
- `faq.html`: 17 searchable questions across setup, stores, camera/AI, privacy and integration. Search runs only in the browser; questions remain available without JavaScript.
- `assets/learning.js`, `assets/faq.js`: progressive enhancements. The content is static HTML and must be validated against the exact Windows build before customer use.
- Current training content describes an **unreleased development preview**. It does not claim finished installer availability, live Tallybook integration, validated theft detection, or production approval.
- Review navigation, mobile layout, keyboard use and storage-denied behavior before merging; no live browser or hosting deployment was performed by this change.

## Quality hardening (October 2026)
- All pages use one consistent primary navigation and footer, plus a visible mobile contact action.
- The inquiry form is a **local message generator**. It does not send messages, collect registrations, or store personal details. Copy works with a manual fallback. Display-only placeholder: `hello@alchemy.example`.
- Only after verifying an inbox, set `contactEmail` in `assets/site-config.js` to enable an optional user-initiated `mailto:` link. That is still not a registration backend.
- Run `node --test tests/site.test.mjs` and `node --check assets/app.js` before review. GitHub Actions performs repository checks.
- There is **no backend**, cloud storage, telemetry, real-time product demo, or customer registration. No payment or production deployment is authorized by this change.
- Privacy/terms remain draft pending legal and owner review. A canonical site URL and complete external SEO assets require an approved final domain.
- Verify on Windows, macOS, Android and iOS browsers before launch. Human keyboard, screen reader, and visual QA remain mandatory.

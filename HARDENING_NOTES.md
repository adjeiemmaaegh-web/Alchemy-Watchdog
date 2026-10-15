# Alchemy website hardening — 2026-10-15
Scope: static parent-brand marketing site only. No Watchdog Windows engine or Tallybook runtime changes.

## Implemented
- Unified header, footer and seven-link site navigation across all ten pages
- Mobile-visible contact CTA, keyboard Escape handling, outside-click dismissal, semantic nav states
- Local-only contact inquiry preview and clipboard fallback; placeholder inbox remains deliberately INACTIVE
- Accurate disclaimers: no registration, email dispatch, backend, or lead storage
- Focus-visible styling, responsive navigation overrides, reduced-motion behavior
- Page descriptions and Open Graph / Twitter preview metadata
- Reformatted stylesheet, Node built-in smoke tests and GitHub Actions CI
- Corrected outdated Watchdog CPU-model marketing copy

## Before launch (blocked by owner decisions or manual verification)
- Replace placeholder with verified official contact details; choose/approve actual lead intake provider and privacy handling if registrations are needed.
- Approve legal/privacy copy and official website domain; configure canonical tags, sitemap and production email delivery only after approval.
- Run browser/assistive technology visual QA, mobile breakpoints, and deployment smoke tests. Confirm claims with current Watchdog/Tallybook release evidence.
- No deploy, main-branch merge, cloud service, payment or production release in this work.

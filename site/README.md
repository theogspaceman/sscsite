# Superior Solutions Consulting — Website Plan

## Nav structure (locked)
1. Home
2. Capabilities (two-silo layout)
3. About
4. Contact

**Past Performance** — page will be built but NOT linked in nav or published at launch. Add later once Superior Solutions has its own contract history to point to.

## Positioning
- Forward-facing "legitimacy" site — used for business cards / outreach outside the existing network
- Site should stand on its own — no reference to other entities or relationships
- Public language kept vague/general — no program specifics, no classified/sensitive detail
- Goal: attract new prime/sub contracts

## Capabilities (two silos)
**Silo 1 — Logistics, Management & Sourcing**
- Supply Chain & Logistics Management
- Program & Project Management Support
- Sourcing & Vendor Management

**Silo 2 — Sales, Acquisition & Program Support**
- Business Development & Capture Support
- Acquisition Support
- Program Support Services

## Technical plan
- **Stack:** Plain HTML/CSS/JS, static site (no CMS)
- **Hosting:** Netlify (free tier)
- **Contact form:** Netlify Forms (native, no third-party service)
- **Domain:** Already owned — DNS to be pointed at Netlify at build time
- **Deploy workflow:** Build files with Claude Code → push to GitHub repo → connect repo to Netlify → auto-deploy on push
- **Build tool:** Claude Code

## Copy status
- [x] Capabilities — drafted (see /copy/capabilities.md)
- [x] Home — drafted (see /copy/home.md); trust signals (SAM.gov/CAGE/UEI/certs) omitted at launch, add later
- [x] About — drafted (see /copy/about.md); needs your years of experience / background framing for leadership paragraph
- [x] Contact — drafted (see /copy/contact.md); needs your actual business email
- [ ] Past Performance (reserved, unpublished — not built yet)

## Build status
- [x] Site built as static HTML/CSS in /site — index.html, capabilities.html, about.html, contact.html, css/style.css
- [ ] Fill in placeholder blocks in about.html and contact.html (marked "Placeholder — edit before launch")
- [ ] Push /site contents to a GitHub repo
- [ ] Connect repo to Netlify, set publish directory to the repo root (or wherever /site's contents land)
- [ ] Point domain DNS at Netlify (Netlify's dashboard gives exact records once the site's created)
- [ ] Netlify Forms works automatically once deployed — no extra setup needed for the Contact form to start receiving submissions

## Folder structure
```
superior-solutions-site/
├── README.md          ← this file, master plan reference
├── copy/
│   ├── capabilities.md
│   ├── home.md
│   ├── about.md
│   ├── contact.md
│   └── past-performance.md   (placeholder, not for launch)
└── site/               ← built, deployable static site
    ├── index.html
    ├── capabilities.html
    ├── about.html
    ├── contact.html
    └── css/
        └── style.css
```

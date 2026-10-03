# Superior Solutions Consulting — website

Public site for Superior Solutions Consulting, live at https://ssconsult.biz.
Plain static HTML/CSS/JS: no framework, no build step, no package manager.

## Layout
- `site/` is the published folder. Everything the site serves lives here.
  - `index.html`: the whole site, one scrolling page (hero → ticker → Capabilities → About → Contact).
  - `css/style.css`: all styles. Design tokens are on `:root` at the top.
  - `js/main.js`: menu, scroll reveals, the scroll thread, hover tilt.
  - `Assets/`: logo PNGs with transparent backgrounds (`ss-logo-lockup.png`, `ss-mark.png`).
- `netlify.toml`: publish settings, plus 301 redirects from the old multi-page URLs (`/about.html` etc.) to page sections. Keep these.
- `README.md`: original planning notes. Partly out of date: it still describes four pages.

## Content rules
- Public wording stays general: no program specifics, client names or sensitive detail.
- The site stands on its own. Don't mention other companies or relationships.
- Business email: info@ssconsult.biz.
- The contact form uses Netlify Forms (`data-netlify="true"` and the honeypot field). Don't remove those attributes.
  - Form detection is enabled on the Netlify site. New submissions email info@ssconsult.biz (a `submission_created` email hook).
  - If you rename the form or its fields, redeploy and check `netlify api listSiteForms`.

## Design rules
- Dark and sharp: near-black backgrounds, square corners (no border-radius), thin 1px lines, silver/chrome accents. No bright colors.
- Use the CSS variables on `:root` (`--bg`, `--silver`, `--line`, ...) instead of new hard-coded colors.
- Fonts: Inter (body) and Inter Tight (headings), loaded from Google Fonts.
- Logos must sit on the page with no visible box. Use the transparent PNGs; never use blend-mode tricks.
- **Scroll thread:** elements with `data-node` are the stops where the line lights up. Add `data-node` to any new section heading that should be a stop.
- **Reduced motion:** honor `prefers-reduced-motion`. The one exception is the service ticker, which keeps moving at a slower speed so every service is visible. The scroll thread shows fully drawn under reduced motion. That's intentional; leave it.
- Check changes at desktop width and at phone width (390px).

## Preview locally
`python3 -m http.server 8000 -d site`, then open http://localhost:8000.

## Deploy (Netlify)
- Netlify site `superior-solutions-site`; this folder is linked with `netlify link`.
- The CLI is a user-local install. Run `export PATH=~/.local/node/bin:$PATH` before any `netlify` command.
- Workflow:
  1. Work on the `design` branch.
  2. Preview: `netlify deploy --dir=site --alias=<name>`. Preview links require a Netlify login, so only the owner can check them in a browser. `curl` gets a 401.
  3. Go live, only when the owner says to: fast-forward `main` to `design` and push. Netlify auto-deploys `main` to ssconsult.biz.
  4. Verify on the live site: page, CSS, JS and logos return 200; the old URLs return 301.
- Rollback: `netlify api restoreSiteDeploy` with the previous deploy id (`netlify api listSiteDeploys` lists them).

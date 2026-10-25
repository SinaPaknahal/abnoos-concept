# Abnoos Palayesh — React concept

React, Vite and Three.js storefront concept with Persian/English, light/dark themes, interactive water treatment and molecule scenes, a quote basket and a sign-in preview.

## Run locally

```sh
npm install
npm run dev
```

## Production build

```sh
npm run build
```

Serve the contents of `dist/` from the root of a static web host. The fonts, water loading screen and boot script are included in the build.

The catalog and quote basket are local preview features. Sign-in, live stock, checkout and payment are not connected to production services. Account credentials are not persisted by the preview form.

Responsive QA results are documented in `RESPONSIVE_QA.md`. Browser preferences and quote basket contents are stored locally in the browser.

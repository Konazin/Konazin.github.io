# Kona / portfolio V3

The static portfolio published at [konazin.github.io](https://konazin.github.io/). GitHub Actions builds this directory and deploys `dist/` to GitHub Pages whenever `main` changes.

Run `npm ci` and `npm run dev` from this directory to preview it locally. `npm run build` creates the static bundle used for deployment.

## Structure

One ThinkPad T480 (three.js, `src/laptop.ts`) stays in the middle of the page and drives a pinned stretch of five scenes, followed by two normal sections:

| Scene | What it shows |
|---|---|
| 00 Exterior | Closed notebook, headline and an index of the three parts |
| 01 Map | Exploded notebook; each part is linked to a callout and opens its chapter |
| 02 CPU · ZeroCoding, 03 RAM · Fenrir, 04 SSD · Training App | Same chapter template: copy on the left, the highlighted part pulled out of the machine, spec sheet on the right |
| 05 About | Bio, principles, experience, education, skills (content from the résumé) |
| 06 Contact | Links, and a second small renderer where the lid closes as the section scrolls in |

The notebook is framed automatically: the camera is dollied until the visible model fits the free band of each scene (between the copy and the spec column on desktop, between the top controls and the text sheet on mobile). Leader lines are drawn from the 3D parts to their callouts every frame.

All copy lives in `src/copy.ts` (PT/EN) and is bound to `data-i18n` / `data-i18n-aria` attributes in `index.html`.

## Fallbacks

- Reduced-motion devices, browsers without WebGL and `?static=1` get a plain reading flow of the same content, with no pin.
- `@media print` turns the page into a black-on-white résumé (projects, about, experience, education, skills, links spelled out).

## Files served as is (`public/`)

`404.html`, `robots.txt`, `sitemap.xml`, `site.webmanifest`, `og.png` and the icon. To publish a résumé, add `public/cv.pdf`: the "Download CV" buttons stay hidden until that file exists.

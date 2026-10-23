// Usage: npm run dev (another terminal), then: node tools/render-scenes.mjs [port]
// Needs Playwright with Chromium; writes transparent WebPs to public/scenes/.
const { chromium } = await import('playwright').catch(() => import('/opt/node-tools/node_modules/playwright/index.mjs'));
import { writeFileSync, mkdirSync } from 'node:fs';
const port = process.argv[2] || 5173, out = new URL('../public/scenes/', import.meta.url);
mkdirSync(out, { recursive: true });
const browser = await chromium.launch({ args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
const page = await browser.newPage({ viewport: { width: 1800, height: 1200 } });
page.on('console', m => m.type() === 'error' && console.error(m.text()));
await page.goto(`http://localhost:${port}/tools/scenes.html`);
await page.waitForFunction(() => window.ready, null, { timeout: 60000 });
for (const name of ['hero', 'map', 'cpu', 'ram', 'ssd', 'contact']) {
  const url = await page.evaluate(n => window.shot(n), name);
  writeFileSync(new URL(`${name}.webp`, out), Buffer.from(url.split(',')[1], 'base64'));
  console.log('wrote', name);
}
await browser.close();

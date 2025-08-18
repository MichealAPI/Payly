// Copy a source logo to required PWA icon filenames in public/
// so the manifest can resolve them during build/deploy.
const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const srcLogo = path.join(root, 'src', 'assets', 'logo', 'payly-web-no-bg.png');
const pubDir = path.join(root, 'public');

const targets = [
  'pwa-192x192.png',
  'pwa-512x512.png',
  'pwa-maskable-192x192.png',
  'pwa-maskable-512x512.png',
  'apple-touch-icon.png'
];

try {
  if (!fs.existsSync(srcLogo)) {
    console.warn(`[pwa-copy] Source logo missing: ${srcLogo}`);
    process.exit(0);
  }
  if (!fs.existsSync(pubDir)) fs.mkdirSync(pubDir, { recursive: true });
  const buf = fs.readFileSync(srcLogo);
  for (const name of targets) {
    const out = path.join(pubDir, name);
    try {
      if (fs.existsSync(out)) {
        const st = fs.statSync(out);
        if (st.size > 0) {
          continue; // keep user's manually provided icon
        }
      }
    } catch {}
    fs.writeFileSync(out, buf);
  }
  console.log('[pwa-copy] PWA icons copied to public/.');
} catch (e) {
  console.error('[pwa-copy] Failed:', e.message);
  process.exit(0);
}

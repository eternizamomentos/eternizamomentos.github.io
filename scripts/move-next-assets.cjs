// scripts/move-next-assets.cjs
const fs = require('fs');
const path = require('path');

const OUT_DIR = path.join(process.cwd(), 'out');
const SRC = path.join(OUT_DIR, '_next');
const DEST_BASE = path.join(OUT_DIR, 'studioarthub');
const DEST = path.join(DEST_BASE, '_next');

if (!fs.existsSync(SRC)) {
  console.log('Nada para mover: out/_next não existe (talvez o build não rodou?).');
  process.exit(0);
}

if (!fs.existsSync(DEST_BASE)) {
  fs.mkdirSync(DEST_BASE, { recursive: true });
}

console.log('Movendo out/_next → out/studioarthub/_next ...');

fs.rmSync(DEST, { recursive: true, force: true });
fs.renameSync(SRC, DEST);

console.log('OK: assets de _next agora estão sob /studioarthub/_next.');

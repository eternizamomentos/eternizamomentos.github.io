// scripts/move-next-assets.cjs
// Move ./out/_next -> ./out/studioarthub/_next para compatibilizar com basePath em servidores estáticos.

const fs = require('fs');
const path = require('path');

const OUT_DIR = path.join(process.cwd(), 'out');
const SRC = path.join(OUT_DIR, '_next');
const DEST_BASE = path.join(OUT_DIR, 'studioarthub');
const DEST = path.join(DEST_BASE, '_next');

function ensureDir(p) {
  if (!fs.existsSync(p)) fs.mkdirSync(p, { recursive: true });
}

function moveRecursive(src, dest) {
  if (!fs.existsSync(src)) return;
  ensureDir(dest);
  for (const entry of fs.readdirSync(src)) {
    const srcPath = path.join(src, entry);
    const destPath = path.join(dest, entry);
    const stat = fs.statSync(srcPath);
    if (stat.isDirectory()) {
      ensureDir(destPath);
      moveRecursive(srcPath, destPath);
    } else {
      fs.renameSync(srcPath, destPath);
    }
  }
  // remover diretório vazio
  fs.rmdirSync(src, { recursive: true });
}

(function main() {
  if (!fs.existsSync(OUT_DIR)) {
    console.error('❌ Pasta ./out não encontrada. Rode o build primeiro.');
    process.exit(1);
  }
  if (!fs.existsSync(SRC)) {
    console.log('ℹ️ Nada para mover: ./out/_next não encontrado (talvez já movido).');
    process.exit(0);
  }
  ensureDir(DEST_BASE);
  console.log('🚚 Movendo ./out/_next -> ./out/studioarthub/_next ...');
  moveRecursive(SRC, DEST);
  console.log('✅ Assets movidos com sucesso.');
})();
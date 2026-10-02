#!/usr/bin/env bash
set -euo pipefail

EXPECTED_REPO="Konazin.github.io"

if [[ ! -d .git ]]; then
  echo "Execute este script dentro do clone do repositório ${EXPECTED_REPO}." >&2
  exit 1
fi

REMOTE_URL="$(git remote get-url origin 2>/dev/null || true)"
if [[ "$REMOTE_URL" != *"${EXPECTED_REPO}"* ]]; then
  echo "O remote atual não parece ser ${EXPECTED_REPO}: ${REMOTE_URL}" >&2
  exit 1
fi

FILES=(
  index.html styles.css app.js favicon.svg site.webmanifest
  404.html robots.txt sitemap.xml README.md .nojekyll deploy.sh
)

git add "${FILES[@]}"
git add -u -- PORTFOLIO_NOTES.md

if git diff --cached --quiet; then
  echo "Nenhuma alteração para publicar."
  exit 0
fi

git commit -m "refresh bilingual software and AI portfolio"
git push origin HEAD:main

echo "Publicado. O GitHub Pages normalmente atualiza em alguns minutos:"
echo "https://konazin.github.io/"

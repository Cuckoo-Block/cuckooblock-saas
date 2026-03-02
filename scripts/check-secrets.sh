#!/usr/bin/env bash
set -euo pipefail

patterns=(
  'sk_(live|test)_[A-Za-z0-9]+'
  'pk_(live|test)_[A-Za-z0-9]+'
  'whsec_[A-Za-z0-9]+'
  'rk_(live|test)_[A-Za-z0-9]+'
)

exclude_globs=(
  '!**/.git/**'
  '!**/node_modules/**'
  '!**/.next/**'
  '!.env*'
  '!package-lock.json'
)

found=0
for pattern in "${patterns[@]}"; do
  if rg -n --hidden --pcre2 "$pattern" . "${exclude_globs[@]/#/--glob=}" >/tmp/cuckoo_secret_scan.out 2>/dev/null; then
    echo "Potential secret found matching pattern: $pattern"
    cat /tmp/cuckoo_secret_scan.out
    found=1
  fi
done

if [[ "$found" -eq 1 ]]; then
  echo
  echo "Secret scan failed. Remove secrets from tracked files before committing."
  exit 1
fi

echo "Secret scan passed."

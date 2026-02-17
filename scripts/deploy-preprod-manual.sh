#!/usr/bin/env bash
set -euo pipefail

# Option B deployment helper:
# - Manual cloud runner
# - Private key entered at runtime
# - No GitHub secrets required for private key

if [[ "${BASH_VERSION:-}" == "" ]]; then
  echo "This script requires bash."
  exit 1
fi

if [[ -z "${MIDNIGHT_DEPLOY_CMD:-}" ]]; then
  cat <<'MSG'
Error: MIDNIGHT_DEPLOY_CMD is not set.

Set it to your Midnight deploy command first, for example:
  export MIDNIGHT_DEPLOY_CMD="<your deploy command>"

Optional:
  export MIDNIGHT_COMPILE_CMD="<your compile command>"
MSG
  exit 1
fi

MIDNIGHT_NETWORK="${MIDNIGHT_NETWORK:-preprod}"
export MIDNIGHT_NETWORK

echo "== Midnight manual deployment helper =="
echo "Network: ${MIDNIGHT_NETWORK}"
echo "This flow keeps private key out of GitHub secrets."

# disable history in current shell process to reduce accidental leakage
set +o history || true

cleanup() {
  unset MIDNIGHT_PRIVATE_KEY
  set -o history || true
}
trap cleanup EXIT

read -r -s -p "Enter deploy private key (hidden): " MIDNIGHT_PRIVATE_KEY
printf '\n'

if [[ -z "${MIDNIGHT_PRIVATE_KEY}" ]]; then
  echo "No key entered. Aborting."
  exit 1
fi

export MIDNIGHT_PRIVATE_KEY

if [[ -n "${MIDNIGHT_COMPILE_CMD:-}" ]]; then
  echo "\n[1/2] Running compile command..."
  bash -lc "${MIDNIGHT_COMPILE_CMD}"
else
  echo "\n[1/2] Skipping compile (MIDNIGHT_COMPILE_CMD not set)."
fi

echo "\n[2/2] Running deploy command..."
bash -lc "${MIDNIGHT_DEPLOY_CMD}"

echo "\nDeployment command completed. Sensitive env var has been cleared."

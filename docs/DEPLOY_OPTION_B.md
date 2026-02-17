# Midnight Contract Deployment (Option B: Manual Cloud Runner, Key Not Stored in GitHub)

This guide implements **Option B** from our discussion:

- Use a cloud Linux runner (GitHub Codespaces, remote VM, etc.)
- **Manually paste your private key only at deploy time**
- Do **not** store private key in GitHub Secrets

## Why this approach

- Works well from Chromebook (no local Linux toolchain required)
- Keeps key material out of GitHub repository/environment secrets
- Keeps frontend deploys (e.g. Vercel) independent from contract deploys

## Prerequisites

1. Access to a cloud Linux shell (Codespaces or remote VM)
2. Repo cloned in that shell
3. Midnight toolchain installed there (CLI/runtime needed for compile/deploy)
4. Target network decided (`preprod` recommended currently)

## Security model

- Private key exists only in your interactive shell session memory
- Key is never committed to repo
- Key is never saved to GitHub Actions/Secrets
- After deploy, session unsets sensitive env vars

## One-command flow

Use the helper script:

```bash
bash scripts/deploy-preprod-manual.sh
```

The script will:

1. Disable shell history for the session
2. Prompt for private key with hidden input
3. Export temporary env vars for deploy command(s)
4. Run optional compile command if configured
5. Run deploy command if configured
6. Unset sensitive env vars and restore history

## Required environment configuration

Set these in your shell **before** running the script:

- `MIDNIGHT_COMPILE_CMD` (optional): command that compiles your contract
- `MIDNIGHT_DEPLOY_CMD` (required): command that performs deployment

Example placeholders:

```bash
export MIDNIGHT_COMPILE_CMD="<your midnight compile command>"
export MIDNIGHT_DEPLOY_CMD="<your midnight deploy command using MIDNIGHT_PRIVATE_KEY and MIDNIGHT_NETWORK>"
```

Then run:

```bash
bash scripts/deploy-preprod-manual.sh
```

## Recommended session hygiene

- Use a fresh ephemeral shell session for deploys
- Avoid passing private key as direct CLI argument if possible
- Prefer tooling flags that read from environment variables or stdin
- Rotate deploy key immediately if you suspect leakage
- Use a dedicated low-balance deployer key

## Notes

- This repo currently contains a frontend scaffold and mock contract service wiring.
- Option B here is intentionally tool-agnostic so you can plug in the latest Midnight Canary CLI commands as source-of-truth evolves.

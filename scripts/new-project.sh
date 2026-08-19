#!/usr/bin/env bash
# Create a new repository from the TV-SALES-AND-HOME/template and set up the
# develop/staging/main branch trio the CD workflows expect.
#
# Usage: scripts/new-project.sh <new-repo-name> [--public]
#
# Requires: gh CLI, authenticated with repo creation access to the org.

set -euo pipefail

ORG="TV-SALES-AND-HOME"
TEMPLATE="$ORG/template"

if [[ $# -lt 1 ]]; then
  echo "Usage: $0 <new-repo-name> [--public]" >&2
  exit 1
fi

NAME="$1"
VISIBILITY="--private"
if [[ "${2:-}" == "--public" ]]; then
  VISIBILITY="--public"
fi

echo "Creating $ORG/$NAME from template $TEMPLATE..."
gh repo create "$ORG/$NAME" --template "$TEMPLATE" $VISIBILITY --clone

cd "$NAME"

for BRANCH in develop staging; do
  echo "Creating branch: $BRANCH"
  git checkout -b "$BRANCH" main
  git push -u origin "$BRANCH"
done

git checkout main

# GitHub Free (private repos) does not support environment-scoped secrets,
# so environments are simulated via repo-level secrets with per-env suffixes.
# See docs/secrets.md. Placeholder values must be replaced before first deploy.
echo "Seeding placeholder repo secrets (_DEV / _STAGING / _PROD)..."

declare -A PLACEHOLDER_SECRETS=(
  [HOSTINGER_HOST]="REPLACE_ME"
  [HOSTINGER_USERNAME]="REPLACE_ME"
  [HOSTINGER_PORT]="22"
  [HOSTINGER_SSH_KEY]="REPLACE_ME"
  [HOSTINGER_DEPLOY_PATH_DEV]="/home/user/apps/${NAME}-dev"
  [HOSTINGER_DEPLOY_PATH_STAGING]="/home/user/apps/${NAME}-staging"
  [HOSTINGER_DEPLOY_PATH_PROD]="/home/user/apps/${NAME}-prod"
  [APP_URL_DEV]="https://dev.REPLACE_ME"
  [APP_URL_STAGING]="https://staging.REPLACE_ME"
  [APP_URL_PROD]="https://REPLACE_ME"
)

for SECRET_NAME in "${!PLACEHOLDER_SECRETS[@]}"; do
  gh secret set "$SECRET_NAME" --repo "$ORG/$NAME" --body "${PLACEHOLDER_SECRETS[$SECRET_NAME]}"
done

echo ""
echo "Done. $ORG/$NAME is ready with branches: main, staging, develop"
echo "Placeholder secrets created — update them at:"
echo "  https://github.com/$ORG/$NAME/settings/secrets/actions"
echo "Location: $(pwd)"

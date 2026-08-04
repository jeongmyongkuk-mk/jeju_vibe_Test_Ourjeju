#!/usr/bin/env bash
set -euo pipefail

# Usage:
#   ./scripts/github-deploy.sh <remote-url>
# Example:
#   ./scripts/github-deploy.sh git@github.com:jeongmyongkuk-mk/jeju_vibe_Test_Ourjeju.git
#   or
#   ./scripts/github-deploy.sh https://github.com/jeongmyongkuk-mk/jeju_vibe_Test_Ourjeju.git

REMOTE="$1"
if [ -z "$REMOTE" ]; then
  echo "Usage: $0 <remote-url>"
  exit 1
fi

echo "Preparing git repository..."
if [ -d .git ]; then
  echo "Existing .git found — creating a new branch 'maxjeju-deploy' and pushing changes." 
  BRANCH="maxjeju-deploy"
  git checkout -b "$BRANCH"
else
  git init
  git add .
  git commit -m "Add Max Jeju landing page"
  git branch -M main
fi

git remote remove origin 2>/dev/null || true
git remote add origin "$REMOTE"

echo "Pushing to remote: $REMOTE"
git push -u origin --all
echo "Done. If push failed due to auth, please ensure you have SSH key or provide a Personal Access Token for HTTPS." 

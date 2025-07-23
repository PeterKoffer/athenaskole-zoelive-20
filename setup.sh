#!/usr/bin/env bash
set -euo pipefail

# Ensure script runs from repository root
cd "$(dirname "$0")"

echo "🔧 Running setup..."

# Update package lists
apt-get update

# Install base system packages required for building node modules
apt-get install -y git curl build-essential

# Install additional libraries commonly required by Playwright and other tools
apt-get install -y libnss3 libatk-bridge2.0-0 libgtk-3-0 libx11-xcb1 libdrm2 libxcomposite1 libgbm1 libasound2 ca-certificates

# Install Node.js if not present
if ! command -v node >/dev/null 2>&1; then
  echo "🛠 Installing Node.js..."
  curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
  apt-get install -y nodejs
fi

# Install project dependencies
npm install

# Install Playwright browsers if Playwright is available
if npx --yes playwright --version >/dev/null 2>&1; then
  npx --yes playwright install --with-deps
fi

echo "✅ Setup complete."

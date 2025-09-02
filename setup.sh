#!/usr/bin/env bash
set -euo pipefail

# Ensure script runs from repository root
cd "$(dirname "$0")"

echo "🔧 Running setup..."

# Detect operating system
OS_NAME="$(uname -s)"

if [[ "$OS_NAME" == "Darwin" ]]; then
  # macOS setup using Homebrew
  if ! command -v brew >/dev/null 2>&1; then
    echo "Homebrew is required. Install it from https://brew.sh and re-run this script."
    exit 1
  fi

  echo "📦 Using Homebrew to install dependencies"
  brew update
  brew install git curl node || true
else
  # Debian/Ubuntu setup using apt-get
  # Update package lists
  apt-get update

  # Install base system packages required for building node modules
  # Includes Python for projects that rely on node-gyp during npm install
  apt-get install -y git curl build-essential python3 python3-pip

  # Install additional libraries commonly required by Playwright and other tools
  apt-get install -y libnss3 libatk-bridge2.0-0 libgtk-3-0 libx11-xcb1 libdrm2 libxcomposite1 libgbm1 ca-certificates

  # Handle renamed audio library package on newer Ubuntu versions
  apt-get install -y libasound2t64 || apt-get install -y libasound2 || true

  # Install Node.js if not present
  if ! command -v node >/dev/null 2>&1; then
    echo "🛠 Installing Node.js..."
    curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
    apt-get install -y nodejs
  fi
fi

# Install project dependencies
npm install

# Install Playwright browsers if Playwright is available
if npx --yes playwright --version >/dev/null 2>&1; then
  npx --yes playwright install --with-deps
fi

# --- Image Ensure function secrets ---
if command -v supabase >/dev/null 2>&1; then
  if [ -z "$IMAGE_ENSURE_TOKEN" ]; then
    echo "Generating IMAGE_ENSURE_TOKEN..."
    IMAGE_ENSURE_TOKEN="$(openssl rand -hex 32)"
  fi
  echo "Setting Supabase function secrets…"
  supabase secrets set \
    SUPABASE_URL="$SUPABASE_URL" \
    SUPABASE_SERVICE_ROLE_KEY="$SUPABASE_SERVICE_ROLE_KEY" \
    IMAGE_ENSURE_TOKEN="$IMAGE_ENSURE_TOKEN" \
    PLACEHOLDER_MIN_BYTES="${PLACEHOLDER_MIN_BYTES:-1024}"
  echo "IMAGE_ENSURE_TOKEN set. Keep this secret; use it only from server-to-server calls."
else
  echo "Supabase CLI not found; skipping secret setup."
fi

echo "✅ Setup complete."

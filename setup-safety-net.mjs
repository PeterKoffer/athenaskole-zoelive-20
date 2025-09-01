#!/usr/bin/env node
import fs from 'fs';
import path from 'path';

console.log("👉 Finalizing safety net setup...");

// Update package.json with new scripts
const packagePath = 'package.json';
if (!fs.existsSync(packagePath)) {
  console.error('❌ package.json not found');
  process.exit(1);
}

const pkg = JSON.parse(fs.readFileSync(packagePath, 'utf8'));

// Add safety net scripts
pkg.scripts = pkg.scripts || {};
pkg.scripts.verify = pkg.scripts.verify || "node ./tools/verify-env.mjs";
pkg.scripts.typecheck = pkg.scripts.typecheck || "tsc -p tsconfig.json --noEmit";
pkg.scripts.smoke = pkg.scripts.smoke || "node ./tools/smoke.mjs";
pkg.scripts.prepush = pkg.scripts.prepush || "npm run verify && npm run typecheck && npm run test && npm run smoke";

// Ensure test script exists
if (!pkg.scripts.test) {
  pkg.scripts.test = "vitest run";
}

fs.writeFileSync(packagePath, JSON.stringify(pkg, null, 2) + '\n');

console.log("✅ Updated package.json with safety net scripts");
console.log("");
console.log("🎉 Safety net installed! Next steps:");
console.log("  1) Update your .env file with proper values (use .env.example as template)");
console.log("  2) Add GitHub secrets for CI:");
console.log("     - VITE_IMAGE_EDGE_URL");
console.log("     - VITE_CONTENT_EDGE_URL");
console.log("  3) Optional: Run feature flags SQL in Supabase from supabase/seed/feature_flags.sql");
console.log("  4) Test locally: npm run verify && npm run smoke");
console.log("");
console.log("Your CI pipeline now includes environment validation, smoke tests, and safety checks! 🚀");
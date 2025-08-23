#!/usr/bin/env node
/**
 * Quick verification script for the image cleanup system
 * Run with: node scripts/verify-cleanup.js
 */

async function verifyCleanup() {
  console.log('🔍 Verifying image cleanup system...\n');
  
  // Check 1: Verify environment variables
  console.log('1. Environment check:');
  const requiredEnvs = ['SUPABASE_URL', 'SUPABASE_SERVICE_ROLE_KEY'];
  let envOk = true;
  
  for (const env of requiredEnvs) {
    if (process.env[env]) {
      console.log(`   ✅ ${env} is set`);
    } else {
      console.log(`   ❌ ${env} is missing`);
      envOk = false;
    }
  }
  
  if (!envOk) {
    console.log('\n⚠️  Please copy .env.example to .env.local and fill in your values');
    return;
  }
  
  // Check 2: Test dry run
  console.log('\n2. Testing dry-run purge...');
  try {
    const { spawn } = require('child_process');
    
    const child = spawn('npx', ['ts-node', '--transpile-only', 'scripts/purgeTinyImages.ts'], {
      env: { ...process.env, DRY_RUN: 'true' },
      stdio: 'inherit'
    });
    
    await new Promise((resolve, reject) => {
      child.on('close', (code) => {
        if (code === 0) {
          console.log('   ✅ Dry-run completed successfully');
          resolve();
        } else {
          console.log(`   ❌ Dry-run failed with code ${code}`);
          reject(new Error(`Process exited with code ${code}`));
        }
      });
    });
  } catch (error) {
    console.log(`   ❌ Dry-run failed: ${error.message}`);
    console.log('   💡 Try running manually: npx ts-node --transpile-only scripts/purgeTinyImages.ts');
  }
  
  // Check 3: Verification complete
  console.log('\n✅ Verification complete!');
  console.log('\nNext steps:');
  console.log('   1. Run: npx ts-node --transpile-only scripts/purgeTinyImages.ts');
  console.log('   2. Clear browser cache (Shift+Reload)');
  console.log('   3. Test image loading in your app');
  console.log('   4. Check console for "heal-failed" messages');
  
  console.log('\n🎯 Expected behavior after cleanup:');
  console.log('   • No "File too small (4 bytes)" logs');
  console.log('   • No 400 errors in Network tab');
  console.log('   • Images load correctly or show fallback');
  console.log('   • "heal-failed" should be rare with REPLICATE_API_TOKEN set');
}

if (require.main === module) {
  verifyCleanup().catch(console.error);
}

module.exports = { verifyCleanup };
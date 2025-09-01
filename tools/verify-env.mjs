import 'dotenv/config';
const REQUIRED = [
  'VITE_SUPABASE_URL','VITE_SUPABASE_ANON_KEY',
  'VITE_IMAGE_EDGE_URL','VITE_CONTENT_EDGE_URL',
  'SUPABASE_URL','SUPABASE_SERVICE_ROLE','IMAGE_PROVIDER'
];
const missing = REQUIRED.filter(k => !process.env[k] || String(process.env[k]).trim()==='');
if (missing.length) {
  console.error('❌ Missing required env vars:\n  - ' + missing.join('\n  - '));
  process.exit(1);
}
console.log('✅ Environment looks good.');
import 'dotenv/config';

const tests = [
  process.env.VITE_IMAGE_EDGE_URL ? { method:"OPTIONS", url: process.env.VITE_IMAGE_EDGE_URL } : null,
  process.env.VITE_IMAGE_EDGE_URL ? { method:"POST", url: process.env.VITE_IMAGE_EDGE_URL, body:{ title:"Probe", universeId:"test", gradeInt:5 } } : null,
  process.env.VITE_CONTENT_EDGE_URL ? { method:"POST", url: process.env.VITE_CONTENT_EDGE_URL, body:{ subject:"Science", grade:5, curriculum:"DK" } } : null
].filter(Boolean);

if (tests.length === 0) {
  console.log("ℹ️  Ingen smoke-tests kørt (mangler EDGE URL envs).");
  process.exit(0);
}

const headers = { "content-type":"application/json" };

(async () => {
  for (const t of tests) {
    try {
      const res = await fetch(t.url, { method: t.method, headers, body: t.body ? JSON.stringify(t.body) : undefined });
      if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
      console.log(`✅ ${t.method} ${t.url} : ${res.status}`);
    } catch (e) {
      console.error(`❌ ${t.method} ${t.url} : ${e.message}`);
      process.exit(1);
    }
  }
})();
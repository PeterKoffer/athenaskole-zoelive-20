[verification-checklist.md]
# Universe Image System - Verification Checklist ✅

## 🔧 **Infrastructure Setup**

### Edge Function Environment Variables
- [ ] `OPENAI_API_KEY` - Set in Supabase Edge Function Secrets
- [ ] `SUPABASE_URL` - Available in edge runtime  
- [ ] `SUPABASE_SERVICE_ROLE_KEY` - Available in edge runtime

**Verify:** Check Supabase Dashboard → Project Settings → Edge Functions → Secrets

### Storage Configuration
- [ ] `universe-images` bucket exists and is PUBLIC
- [ ] Default fallback images uploaded:
  - `default.png` (main fallback)
  - `science.png`, `math.png`, `arts.png` etc. (subject-specific)
- [ ] Test storage access: `https://PROJECT.supabase.co/storage/v1/object/public/universe-images/default.png`

**Expected:** HTTP 200 + valid PNG image

### Database Policies (RLS)
- [ ] `universe_images` table has service role access
- [ ] `universe_image_jobs` table has service role access  
- [ ] Check no conflicting policies block edge function writes

**Test:** Run observability query #1 to verify data access

## 🧪 **Functional Testing**

### Single Image Generation
```bash
curl -X POST "https://PROJECT.supabase.co/functions/v1/image-ensure" \
  -H "Authorization: Bearer SERVICE_ROLE_KEY" \
  -H "Content-Type: application/json" \
  -d '{"universeId":"test-1","universeTitle":"Test Universe","subject":"science","scene":"cover: main activity","grade":5}'
```
**Expected:** `{"status":"queued","id":"..."}` or `{"status":"exists","imageUrl":"https://..."}`

### Cache Hit Test
Run same request twice - second should return `"from":"cache"` instantly

### Fallback Test
- Temporarily disable OPENAI_API_KEY or use invalid universe
- **Expected:** `{"from":"fallback","error_code":"missing_api_key"}`

### Bulk Generation
```bash
curl -X POST "https://PROJECT.supabase.co/functions/v1/bulk-generate-universe-images?batchSize=5" \
  -H "Authorization: Bearer SERVICE_ROLE_KEY"
```
**Expected:** `{"total":N,"success":N,"failed":0,"skipped":N}`

## 🌐 **CORS & Headers**

### OPTIONS Request
```bash
curl -X OPTIONS "https://PROJECT.supabase.co/functions/v1/image-ensure" \
  -H "Origin: https://example.com" -I
```
**Expected Headers:**
- `Access-Control-Allow-Origin: *`
- `Access-Control-Allow-Methods: POST, OPTIONS`
- `Access-Control-Allow-Headers: ...content-type...`

### Content-Type Handling
Frontend requests MUST include: `"Content-Type": "application/json"`

## 📊 **Observability Check**

### Database Health
```sql
-- Run in Supabase SQL Editor:
SELECT source, count(*) FROM universe_images GROUP BY source;
```
**Expected:** Rows with `ai` and `fallback` sources

### Recent Job Status
```sql
SELECT * FROM universe_image_jobs ORDER BY started_at DESC LIMIT 5;
```
**Expected:** Completed jobs with reasonable success rates

### Performance Metrics
```sql
SELECT 
  avg(extract(epoch from finished_at - started_at)) as avg_duration_sec,
  sum(success) as total_success,
  sum(failed) as total_failed
FROM universe_image_jobs WHERE finished_at IS NOT NULL;
```

## 🚀 **Frontend Integration**

### useUniverseImage Hook
- [ ] Shows instant Storage fallback
- [ ] Upgrades to AI image when ready
- [ ] Handles loading states properly
- [ ] Has proper error fallback chain

### UniverseImage Component  
- [ ] onError cascades through fallback levels
- [ ] Cache-busting on first load (`?v=timestamp`)
- [ ] Proper alt text for accessibility
- [ ] Loading shimmer/skeleton

## 🔒 **Security Verification**

### API Key Exposure
- [ ] No OPENAI_API_KEY in frontend code
- [ ] Service role key only used in edge functions
- [ ] No sensitive data in browser network tab

### RLS Policy Check
```sql
-- Test as regular user (not service role):
SELECT * FROM universe_images LIMIT 1;
```
**Expected:** Should work for reading cached images

## 🎯 **Production Readiness**

### Error Handling
- [ ] AI failures → automatic fallback
- [ ] Network timeouts → retry once + fallback  
- [ ] Missing images → subject-based fallback
- [ ] Invalid requests → proper 400 errors

### Performance
- [ ] Cache hits < 100ms
- [ ] AI generation < 25s
- [ ] Bulk processing respects rate limits
- [ ] No memory leaks in long-running jobs

### Monitoring
- [ ] Error logs are actionable
- [ ] Success/failure rates tracked
- [ ] Performance metrics captured
- [ ] Alert thresholds defined

## ✅ **Go-Live Checklist**

1. [ ] All smoke tests pass
2. [ ] Upload all subject fallback images  
3. [ ] Run initial bulk generation
4. [ ] Verify 90%+ success rate
5. [ ] Frontend shows instant images
6. [ ] No console errors
7. [ ] Performance within targets
8. [ ] Monitoring dashboards active

---

**🎉 When all items checked:** Your universe image system is production-ready!

**⚡ Quick Health Check:** Run observability queries daily to monitor system health.

**🚨 Red Flags:** High failure rates, slow generation times, missing fallback images, RLS policy conflicts.

#!/bin/bash

# Universe Image System Smoke Tests
# Replace YOUR_PROJECT and YOUR_SERVICE_ROLE_KEY with actual values

PROJECT_URL="https://yphkfkpfdpdmllotpqua.supabase.co"
SERVICE_ROLE_KEY="<YOUR_SERVICE_ROLE_KEY>"  # Replace with actual key

echo "🧪 Starting Universe Image System Smoke Tests..."
echo "================================================"

# Test A: Single Generate (Happy Path)
echo ""
echo "Test A: Single Generate (Happy Path)"
echo "------------------------------------"
curl -X POST "${PROJECT_URL}/functions/v1/image-ensure" \
  -H "Authorization: Bearer ${SERVICE_ROLE_KEY}" \
  -H "Content-Type: application/json" \
  -d '{
    "universeId": "test-science-lab",
    "universeTitle": "Test Science Lab",
    "subject": "science",
    "scene": "cover: main activity",
    "grade": 5
  }' \
  --silent --show-error | jq '.'

echo ""
echo "Expected: status 'queued' or 'exists' with imageUrl when ready"

# Test B: Cache Hit (should be instant)
echo ""
echo "Test B: Cache Hit Test (should be instant)"
echo "-----------------------------------------"
curl -X POST "${PROJECT_URL}/functions/v1/image-ensure" \
  -H "Authorization: Bearer ${SERVICE_ROLE_KEY}" \
  -H "Content-Type: application/json" \
  -d '{
    "universeId": "test-science-lab",
    "universeTitle": "Test Science Lab",
    "subject": "science",
    "scene": "cover: main activity",
    "grade": 5
  }' \
  --silent --show-error | jq '.'

echo ""
echo "Expected: status 'exists' with cached true"

# Test C: Fallback Path (simulate missing API key)
echo ""
echo "Test C: Fallback Path Test"
echo "--------------------------"
curl -X POST "${PROJECT_URL}/functions/v1/image-ensure" \
  -H "Authorization: Bearer ${SERVICE_ROLE_KEY}" \
  -H "Content-Type: application/json" \
  -d '{
    "universeId": "test-fallback-universe",
    "universeTitle": "Test Fallback Universe",
    "subject": "mathematics",
    "scene": "cover: main activity",
    "grade": 5
  }' \
  --silent --show-error | jq '.'

echo ""
echo "Expected: status 'error' with fallback message"

# Test D: Bulk Generation (small batch)
echo ""
echo "Test D: Bulk Generation (small batch)"
echo "------------------------------------"
curl -X POST "${PROJECT_URL}/functions/v1/bulk-generate-universe-images?batchSize=5&maxBatches=1" \
  -H "Authorization: Bearer ${SERVICE_ROLE_KEY}" \
  -H "Content-Type: application/json" \
  --silent --show-error | jq '.'

echo ""
echo "Expected: JSON with total, success, failed, skipped counts"

# Test E: Storage Public Access
echo ""
echo "Test E: Storage Public Access Test"
echo "---------------------------------"
TEST_IMAGE_URL="${PROJECT_URL}/storage/v1/object/public/universe-images/default.png"
HTTP_CODE=$(curl -o /dev/null -s -w "%{http_code}" "${TEST_IMAGE_URL}")

if [ "${HTTP_CODE}" = "200" ]; then
    echo "✅ Storage access: OK (HTTP ${HTTP_CODE})"
else
    echo "❌ Storage access: FAILED (HTTP ${HTTP_CODE})"
    echo "   URL tested: ${TEST_IMAGE_URL}"
fi

# Test F: CORS Headers
echo ""
echo "Test F: CORS Headers Test"
echo "------------------------"
curl -X OPTIONS "${PROJECT_URL}/functions/v1/image-ensure" \
  -H "Origin: https://example.com" \
  -H "Access-Control-Request-Method: POST" \
  -H "Access-Control-Request-Headers: Content-Type" \
  --silent --show-error -I

echo ""
echo "Expected: Access-Control-Allow-Origin: *, Access-Control-Allow-Methods: POST, OPTIONS"

echo ""
echo "🎉 Smoke tests completed!"
echo "========================="
echo ""
echo "Next steps:"
echo "1. Verify all tests pass as expected"
echo "2. Check Supabase logs for any errors"
echo "3. Upload default.png to universe-images bucket if not present"
echo "4. Run bulk generation for all universes"
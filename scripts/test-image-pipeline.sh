#!/bin/bash
# Quick green path test for universe image pipeline

PROJECT_ID="yphkfkpfdpdmllotpqua"
BASE_URL="https://${PROJECT_ID}.supabase.co"

echo "🧪 Testing universe image pipeline..."

# Test 1: Check if default.png exists and is accessible
echo "📸 Test 1: Default placeholder image..."
curl -s -I "${BASE_URL}/storage/v1/object/public/universe-images/default.png" | head -1

# Test 2: Test edge function (requires SERVICE_ROLE_KEY to be set)
if [ -n "$SERVICE_ROLE_KEY" ]; then
    echo "🔧 Test 2: Edge function..."
    curl -s -X POST "${BASE_URL}/functions/v1/image-ensure" \
     -H "Authorization: Bearer ${SERVICE_ROLE_KEY}" \
     -H "Content-Type: application/json" \
     -d '{"universeId":"test-pipeline","imagePrompt":"Cinematic science lab, kid-friendly","lang":"en"}' | jq .
else
    echo "⚠️ Test 2 skipped: SERVICE_ROLE_KEY not set"
fi

echo "✅ Test complete"
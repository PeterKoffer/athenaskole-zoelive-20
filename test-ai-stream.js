#!/usr/bin/env node

// Mini integration test for AI streaming
// Usage: node test-ai-stream.js

import assert from "node:assert";

const PROJECT_URL = "https://yphkfkpfdpdmllotpqua.supabase.co";

async function testAIStream() {
  console.log("🧪 Testing AI Stream functionality...");
  
  const testCases = [
    {
      name: "Daily Mathematics Lesson",
      payload: {
        mode: "daily",
        subject: "mathematics",
        gradeLevel: 3,
        curriculum: "DK",
      }
    },
    {
      name: "Training Science Session",
      payload: {
        mode: "training",
        subject: "science",
        gradeLevel: 5,
        curriculum: "DK",
      }
    }
  ];

  for (const testCase of testCases) {
    console.log(`\n📋 Testing: ${testCase.name}`);
    
    try {
      const startTime = Date.now();
      
      const response = await fetch(`${PROJECT_URL}/functions/v1/ai-stream`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": "Bearer YOUR_ANON_KEY_HERE" // Replace with actual key if needed
        },
        body: JSON.stringify(testCase.payload),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const text = await response.text();
      const duration = Date.now() - startTime;
      
      console.log(`⏱️  Duration: ${duration}ms`);
      
      // Check for expected streaming patterns
      const hasEventChunk = text.includes("event: chunk") || text.includes("event:");
      const hasJsonData = text.includes("{") && text.includes("}");
      const hasTitle = text.includes("title") || text.includes("mathematics") || text.includes("science");
      
      assert(hasEventChunk || hasJsonData, "Response should contain event chunks or JSON data");
      
      if (hasJsonData && !hasEventChunk) {
        // Non-streaming response (probably cached)
        console.log("📦 Cached response detected");
        const parsed = JSON.parse(text);
        assert(parsed.title, "Response should have a title");
        assert(Array.isArray(parsed.objectives), "Response should have objectives array");
        assert(Array.isArray(parsed.activities), "Response should have activities array");
      } else {
        // Streaming response
        console.log("🌊 Streaming response detected");
        assert(hasTitle, "Stream should contain lesson content");
      }
      
      console.log("✅ Test passed");
      
      // Preview first 200 chars
      const preview = text.slice(0, 200).replace(/\n/g, "\\n");
      console.log(`📄 Preview: ${preview}...`);
      
    } catch (error) {
      console.error(`❌ Test failed: ${error.message}`);
      console.error(`Stack: ${error.stack}`);
    }
  }
}

// Performance benchmark
async function benchmarkAIStream() {
  console.log("\n🚀 Performance Benchmark");
  
  const rounds = 3;
  const timings = [];
  
  for (let i = 0; i < rounds; i++) {
    console.log(`Round ${i + 1}/${rounds}`);
    
    const startTime = Date.now();
    
    try {
      const response = await fetch(`${PROJECT_URL}/functions/v1/ai-stream`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mode: "training",
          subject: "mathematics",
          gradeLevel: 4,
          curriculum: "DK",
        }),
      });
      
      await response.text(); // Consume the stream
      const duration = Date.now() - startTime;
      timings.push(duration);
      
      console.log(`⏱️  ${duration}ms`);
      
    } catch (error) {
      console.error(`❌ Benchmark round ${i + 1} failed:`, error.message);
    }
    
    // Small delay between requests
    await new Promise(resolve => setTimeout(resolve, 500));
  }
  
  if (timings.length > 0) {
    const avg = timings.reduce((a, b) => a + b) / timings.length;
    const min = Math.min(...timings);
    const max = Math.max(...timings);
    
    console.log(`\n📊 Performance Results:`);
    console.log(`   Average: ${avg.toFixed(0)}ms`);
    console.log(`   Min: ${min}ms`);
    console.log(`   Max: ${max}ms`);
    
    if (avg < 4000) {
      console.log("🎯 Performance target met (<4s average)");
    } else {
      console.log("⚠️  Performance target missed (>4s average)");
    }
  }
}

// Test cache invalidation
async function testCacheInvalidation() {
  console.log("\n🗄️  Testing Cache Behavior");
  
  const payload = {
    mode: "daily",
    subject: "mathematics", 
    gradeLevel: 2,
    curriculum: "DK",
    // Add unique field to bust cache
    _test: Date.now()
  };
  
  // First call (should be slow - cache miss)
  console.log("1️⃣ First call (cache miss expected)");
  const start1 = Date.now();
  const response1 = await fetch(`${PROJECT_URL}/functions/v1/ai-stream`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const duration1 = Date.now() - start1;
  console.log(`⏱️  ${duration1}ms`);
  
  // Second call with same payload (should be fast - cache hit)
  console.log("2️⃣ Second call (cache hit expected)");
  const start2 = Date.now();
  const response2 = await fetch(`${PROJECT_URL}/functions/v1/ai-stream`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const duration2 = Date.now() - start2;
  console.log(`⏱️  ${duration2}ms`);
  
  if (duration2 < duration1 * 0.5) {
    console.log("✅ Cache working correctly (second call much faster)");
  } else {
    console.log("⚠️  Cache may not be working (similar timings)");
  }
}

// Main execution
async function main() {
  console.log("🔥 AI Stream Test Suite");
  console.log("=" + "=".repeat(50));
  
  await testAIStream();
  await benchmarkAIStream();
  await testCacheInvalidation();
  
  console.log("\n✨ Test suite completed!");
}

main().catch(console.error);
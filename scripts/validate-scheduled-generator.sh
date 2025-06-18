#!/bin/bash

# Simple validation script for scheduledLessonGenerator.ts
# This script performs basic checks to ensure the function is properly structured

echo "🔍 Validating Scheduled Lesson Generator..."

FUNCTION_FILE="supabase/functions/scheduledLessonGenerator.ts"

if [ ! -f "$FUNCTION_FILE" ]; then
    echo "❌ Function file not found: $FUNCTION_FILE"
    exit 1
fi

echo "✅ Function file exists"

# Check for required imports
if grep -q "import { serve }" "$FUNCTION_FILE"; then
    echo "✅ Deno serve import found"
else
    echo "❌ Missing Deno serve import"
    exit 1
fi

if grep -q "import { createClient }" "$FUNCTION_FILE"; then
    echo "✅ Supabase client import found"
else
    echo "❌ Missing Supabase client import"
    exit 1
fi

# Check for main function structure
if grep -q "serve(async (req)" "$FUNCTION_FILE"; then
    echo "✅ Main serve function found"
else
    echo "❌ Missing main serve function"
    exit 1
fi

# Check for CORS handling
if grep -q "corsHeaders" "$FUNCTION_FILE"; then
    echo "✅ CORS headers found"
else
    echo "❌ Missing CORS headers"
    exit 1
fi

# Check for core functions
if grep -q "getAllClasses" "$FUNCTION_FILE"; then
    echo "✅ getAllClasses function found"
else
    echo "❌ Missing getAllClasses function"
    exit 1
fi

if grep -q "processClassLessons" "$FUNCTION_FILE"; then
    echo "✅ processClassLessons function found"
else
    echo "❌ Missing processClassLessons function"
    exit 1
fi

if grep -q "generateLessonForClass" "$FUNCTION_FILE"; then
    echo "✅ generateLessonForClass function found"
else
    echo "❌ Missing generateLessonForClass function"
    exit 1
fi

if grep -q "storeLessonData" "$FUNCTION_FILE"; then
    echo "✅ storeLessonData function found"
else
    echo "❌ Missing storeLessonData function"
    exit 1
fi

# Check for error handling
if grep -q "try {" "$FUNCTION_FILE" && grep -q "catch" "$FUNCTION_FILE"; then
    echo "✅ Error handling found"
else
    echo "❌ Missing error handling"
    exit 1
fi

# Check for logging
if grep -q "console.log" "$FUNCTION_FILE"; then
    echo "✅ Logging found"
else
    echo "❌ Missing logging"
    exit 1
fi

echo ""
echo "🎉 All validation checks passed!"
echo "📄 Function file: $FUNCTION_FILE"
echo "📏 File size: $(wc -l < "$FUNCTION_FILE") lines"
echo ""
echo "Next steps:"
echo "1. Deploy the function to Supabase"
echo "2. Test with manual invocation"
echo "3. Set up scheduled execution (cron job)"
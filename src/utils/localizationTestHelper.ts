
// Utility to help with manual testing of the localization flow
import { supabase } from '@/lib/supabaseClient';

export const MOCK_TEST_USER_ID = '12345678-1234-5678-9012-123456789012';

export class LocalizationTestHelper {
  static async verifyTestUserSetup() {
    console.log('🔍 Verifying test user setup...');
    
    // Check if test user exists in profiles (using existing table)
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', MOCK_TEST_USER_ID)
      .maybeSingle();

    if (profileError) {
      console.error('❌ Error checking profile:', profileError);
      return false;
    }

    if (!profile) {
      console.log('⚠️ Test user profile not found, creating...');
      await this.createTestUserProfile();
    } else {
      console.log('✅ Test user profile exists');
    }

    return true;
  }

  static async createTestUserProfile() {
    const { error } = await supabase
      .from('profiles')
      .insert({
        user_id: MOCK_TEST_USER_ID,
        name: 'Test User',
        email: 'test@example.com'
      });

    if (error) {
      console.error('❌ Error creating test user profile:', error);
      return false;
    }

    console.log('✅ Test user profile created');
    return true;
  }

  static async verifyCurriculumStandards() {
    console.log('🔍 Verifying curriculum standards...');
    
    const { data: standards, error } = await supabase
      .from('curriculum_standards')
      .select('*')
      .limit(5);

    if (error) {
      console.error('❌ Error fetching curriculum standards:', error);
      return false;
    }

    console.log(`✅ Found ${standards?.length || 0} curriculum standards`);
    return standards && standards.length > 0;
  }

  static async verifyAdaptiveContent() {
    console.log('🔍 Verifying adaptive content...');
    
    const { data: content, error } = await supabase
      .from('adaptive_content')
      .select('*')
      .limit(5);

    if (error) {
      console.error('❌ Error fetching adaptive content:', error);
      return false;
    }

    console.log(`✅ Found ${content?.length || 0} adaptive content items`);
    return content && content.length > 0;
  }

  static async runFullLocalizationTest() {
    console.log('🚀 Starting full localization test...');
    
    const checks = [
      { name: 'Test User Setup', fn: () => this.verifyTestUserSetup() },
      { name: 'Curriculum Standards', fn: () => this.verifyCurriculumStandards() },
      { name: 'Adaptive Content', fn: () => this.verifyAdaptiveContent() }
    ];

    const results = [];
    
    for (const check of checks) {
      try {
        const result = await check.fn();
        results.push({ name: check.name, passed: result });
        console.log(`${result ? '✅' : '❌'} ${check.name}: ${result ? 'PASSED' : 'FAILED'}`);
      } catch (error) {
        console.error(`💥 ${check.name} threw error:`, error);
        results.push({ name: check.name, passed: false, error });
      }
    }

    console.log('\n📊 Test Results Summary:');
    results.forEach(result => {
      console.log(`  ${result.passed ? '✅' : '❌'} ${result.name}`);
    });

    const allPassed = results.every(r => r.passed);
    console.log(`\n🎯 Overall Status: ${allPassed ? 'READY FOR MANUAL TESTING' : 'NEEDS SETUP'}`);
    
    return { allPassed, results };
  }

  static logManualTestingSteps() {
    console.log(`
📋 MANUAL TESTING STEPS FOR LOCALIZATION FLOW:

1. 🔍 VERIFY DATABASE SETUP:
   - Run LocalizationTestHelper.runFullLocalizationTest() in browser console
   - Ensure all checks pass before proceeding

2. 🌍 TEST ENGLISH (US) FLOW:
   - Navigate to /adaptive-practice-test
   - Check that content loads in English
   - Complete a few questions
   - Check browser console for logging

3. 🇩🇰 TEST DANISH (DK) FLOW:
   - Use language switcher to change to Danish (da)
   - Navigate to /adaptive-practice-test again
   - Verify content switches to Danish
   - Complete a few questions

4. 📊 VERIFY SUPABASE LOGGING:
   - Open Supabase dashboard
   - Check relevant tables for logged data
   - Verify events have correct language/context metadata

5. 🔄 TEST LANGUAGE SWITCHING:
   - Switch between EN/ES/DA multiple times
   - Verify content updates accordingly
   - Check for any console errors

6. 📱 TEST DIFFERENT PATHS:
   - Try /education/math
   - Try /daily-program
   - Verify localization works across all math learning paths
`);
  }
}

// Export for easy browser console access
if (typeof window !== 'undefined') {
  (window as any).LocalizationTestHelper = LocalizationTestHelper;
}

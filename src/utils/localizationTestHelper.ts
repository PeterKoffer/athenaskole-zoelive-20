
// Utility to help with manual testing of the localization flow
import { supabase } from '@/integrations/supabase/client';

export const MOCK_TEST_USER_ID = '12345678-1234-5678-9012-123456789012';

export class LocalizationTestHelper {
  static async verifyTestUserSetup() {
    console.log('🔍 Verifying test user setup...');
    
    // Check if test user exists in learner_profiles
    const { data: profile, error: profileError } = await supabase
      .from('learner_profiles')
      .select('*')
      .eq('user_id', MOCK_TEST_USER_ID)
      .maybeSingle();

    if (profileError) {
      console.error('❌ Error checking learner profile:', profileError);
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
      .from('learner_profiles')
      .insert({
        user_id: MOCK_TEST_USER_ID,
        overall_mastery: 0.0,
        preferences: {
          learningStyle: 'mixed',
          difficultyPreference: 0.5,
          sessionLength: 15
        },
        suggested_next_kcs: [],
        current_learning_focus_kcs: []
      });

    if (error) {
      console.error('❌ Error creating test user profile:', error);
      return false;
    }

    console.log('✅ Test user profile created');
    return true;
  }

  static async verifyKnowledgeComponents() {
    console.log('🔍 Verifying knowledge components...');
    
    const { data: kcs, error } = await supabase
      .from('knowledge_components')
      .select('*')
      .in('id', [
        'kc_math_g4_add_fractions_likedenom',
        'kc_math_g4_subtract_fractions_likedenom'
      ]);

    if (error) {
      console.error('❌ Error fetching KCs:', error);
      return false;
    }

    if (!kcs || kcs.length === 0) {
      console.log('⚠️ No test KCs found');
      return false;
    }

    console.log(`✅ Found ${kcs.length} knowledge components:`, kcs.map(kc => kc.id));
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

  static async verifyContentAtoms() {
    console.log('🔍 Verifying content atoms...');
    
    const { data: atoms, error } = await supabase
      .from('content_atoms')
      .select('*')
      .contains('kc_ids', ['kc_math_g4_add_fractions_likedenom']);

    if (error) {
      console.error('❌ Error fetching content atoms:', error);
      return false;
    }

    console.log(`✅ Found ${atoms?.length || 0} content atoms for test KC`);
    return atoms && atoms.length > 0;
  }

  static async runFullLocalizationTest() {
    console.log('🚀 Starting full localization test...');
    
    const checks = [
      { name: 'Test User Setup', fn: () => this.verifyTestUserSetup() },
      { name: 'Knowledge Components', fn: () => this.verifyKnowledgeComponents() },
      { name: 'Curriculum Standards', fn: () => this.verifyCurriculumStandards() },
      { name: 'Content Atoms', fn: () => this.verifyContentAtoms() }
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
   - Verify KC: "Adding Fractions with Like Denominators"
   - Complete a few questions
   - Check browser console for logging

3. 🇩🇰 TEST DANISH (DK) FLOW:
   - Use language switcher to change to Danish (da)
   - Navigate to /adaptive-practice-test again
   - Verify content switches to Danish
   - Check that KC names are in Danish (if implemented)
   - Complete a few questions

4. 📊 VERIFY SUPABASE LOGGING:
   - Open Supabase dashboard
   - Check interaction_events table
   - Verify events have correct language/context metadata

5. 🔄 TEST LANGUAGE SWITCHING:
   - Switch between EN/ES/DA multiple times
   - Verify content updates accordingly
   - Check for any console errors

6. 📱 TEST DIFFERENT PATHS:
   - Try /education/math
   - Try /daily-program
   - Verify localization works across all math learning paths

❓ Issues to Watch For:
   - Content not loading
   - Language not switching
   - Console errors about missing translations
   - KC mastery not updating
   - Events not logging to Supabase
`);
  }
}

// Export for easy browser console access
if (typeof window !== 'undefined') {
  (window as any).LocalizationTestHelper = LocalizationTestHelper;
}

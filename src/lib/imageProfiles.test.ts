// Quick smoke test for subject alias resolution
import { imageCacheKey } from './imageProfiles';

// Test that different subject name variations produce the same cache key
export function testSubjectAliases() {
  console.log('🧪 Testing subject alias resolution...');
  
  const tests = [
    {
      variants: ['History & Religion', 'history-religion', 'History and Religion'],
      expected: 'same key for history variations'
    },
    {
      variants: ['Music', 'music discovery', 'Music Discovery'],
      expected: 'same key for music variations'
    },
    {
      variants: ['Physical Education', 'PE', 'physical-education'],
      expected: 'same key for PE variations'
    },
    {
      variants: ['Computer and Technology', 'Computer & Technology', 'computer-and-technology'],
      expected: 'same key for tech variations'
    }
  ];

  tests.forEach(({ variants, expected }) => {
    const keys = variants.map(subject => 
      imageCacheKey('test-universe', subject, 'cover scene', 7)
    );
    
    const allSame = keys.every(key => key === keys[0]);
    console.log(`✅ ${expected}:`, allSame ? 'PASS' : 'FAIL');
    console.log(`   Keys: ${keys.join(' | ')}`);
  });
}

// Uncomment to run: testSubjectAliases();
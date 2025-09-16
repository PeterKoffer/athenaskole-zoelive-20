/**
 * Script to pre-generate and cache backstories for all universe packs
 * Similar to image generation but for magical story intros
 */

import { UniversePacks } from "@/content/universe.catalog";
import { BackstoryService } from "@/services/backstory/backstoryService";

const GRADE_LEVELS = ["K-2", "3-5", "6-8", "9-10", "11-12"];
const LANGUAGES = ["da", "en"];

async function generateBackstoriesForPack(packId: string, title: string) {
  console.log(`\n📚 Generating backstories for: ${title} (${packId})`);
  
  const pack = UniversePacks.find(p => p.id === packId);
  if (!pack) {
    console.error(`❌ Pack not found: ${packId}`);
    return;
  }

  let generated = 0;
  let skipped = 0;

  for (const gradeLevel of GRADE_LEVELS) {
    for (const language of LANGUAGES) {
      const gradeInt = gradeLevel === "K-2" ? 1 : 
                       gradeLevel === "3-5" ? 4 : 
                       gradeLevel === "6-8" ? 6 : 
                       gradeLevel === "9-10" ? 9 : 11;

      try {
        // Check if backstory already exists
        const existingUrl = await BackstoryService.getBackstorySignedUrl(packId, gradeInt, { language });
        
        if (existingUrl) {
          // Test if the backstory is valid
          const response = await fetch(existingUrl);
          if (response.ok) {
            const text = await response.text();
            if (text.length >= 50) {
              console.log(`  ⏭️  ${gradeLevel} (${language}): Already exists`);
              skipped++;
              continue;
            }
          }
        }

        // Generate new backstory
        const backstory = BackstoryService.generateMagicalBackstory(pack, gradeLevel, language);
        
        // Upload to storage
        const success = await BackstoryService.uploadBackstory(packId, gradeInt, backstory, language);
        
        if (success) {
          console.log(`  ✅ ${gradeLevel} (${language}): Generated and cached`);
          generated++;
        } else {
          console.log(`  ❌ ${gradeLevel} (${language}): Failed to cache`);
        }

      } catch (error) {
        console.error(`  ❌ ${gradeLevel} (${language}): Error -`, error);
      }

      // Small delay to avoid overwhelming the system
      await new Promise(resolve => setTimeout(resolve, 100));
    }
  }

  console.log(`📊 Pack ${packId}: ${generated} generated, ${skipped} skipped`);
}

async function generateAllBackstories() {
  console.log("🚀 Starting backstory generation for all universe packs...");
  console.log(`📈 Total packs: ${UniversePacks.length}`);
  console.log(`🌍 Languages: ${LANGUAGES.join(", ")}`);
  console.log(`🎓 Grade levels: ${GRADE_LEVELS.join(", ")}`);
  
  let totalGenerated = 0;
  let totalSkipped = 0;
  let packCount = 0;

  // Initialize bucket (this will log if it needs manual creation)
  await BackstoryService.initializeBucket();

  for (const pack of UniversePacks) {
    packCount++;
    console.log(`\n[${packCount}/${UniversePacks.length}] Processing: ${pack.title}`);
    
    try {
      await generateBackstoriesForPack(pack.id, pack.title);
    } catch (error) {
      console.error(`❌ Failed to process pack ${pack.id}:`, error);
    }

    // Longer delay between packs
    await new Promise(resolve => setTimeout(resolve, 500));
  }

  console.log("\n🎉 Backstory generation complete!");
  console.log(`📊 Final stats:`);
  console.log(`  - Packs processed: ${packCount}`);
  console.log(`  - Total backstories that could be generated: ${UniversePacks.length * GRADE_LEVELS.length * LANGUAGES.length}`);
  console.log(`  - Check storage bucket 'universe-backstories' for results`);
}

// Generate for specific pack (useful for testing)
async function generateForPack(packId: string) {
  const pack = UniversePacks.find(p => p.id === packId);
  if (!pack) {
    console.error(`Pack not found: ${packId}`);
    return;
  }
  
  await BackstoryService.initializeBucket();
  await generateBackstoriesForPack(packId, pack.title);
}

// Generate for specific prime 100 packs
async function generateForPrime100() {
  const { Prime100 } = await import("@/content/universe.catalog");
  
  console.log("🚀 Starting backstory generation for Prime 100 packs...");
  console.log(`📈 Prime 100 packs: ${Prime100.length}`);
  
  await BackstoryService.initializeBucket();

  for (let i = 0; i < Prime100.length; i++) {
    const pack = Prime100[i];
    console.log(`\n[${i + 1}/${Prime100.length}] Processing Prime pack: ${pack.title}`);
    
    try {
      await generateBackstoriesForPack(pack.id, pack.title);
    } catch (error) {
      console.error(`❌ Failed to process pack ${pack.id}:`, error);
    }

    await new Promise(resolve => setTimeout(resolve, 300));
  }

  console.log("\n🎉 Prime 100 backstory generation complete!");
}

// Export functions for use
export {
  generateAllBackstories,
  generateForPack,
  generateForPrime100,
  generateBackstoriesForPack
};

// For command line usage
if (typeof window === 'undefined' && import.meta.url.includes(process.argv[1])) {
  const command = process.argv[2];
  const arg = process.argv[3];

  switch (command) {
    case 'all':
      generateAllBackstories().catch(console.error);
      break;
    case 'prime100':
      generateForPrime100().catch(console.error);
      break;
    case 'pack':
      if (!arg) {
        console.error('Please provide pack ID: npm run generate-backstories pack <pack-id>');
        process.exit(1);
      }
      generateForPack(arg).catch(console.error);
      break;
    default:
      console.log('Usage:');
      console.log('  npm run generate-backstories all     - Generate for all packs');
      console.log('  npm run generate-backstories prime100 - Generate for Prime 100 packs');
      console.log('  npm run generate-backstories pack <id> - Generate for specific pack');
      break;
  }
}

import { knowledgeComponentService } from '@/services/knowledgeComponentService';
import mockKcsData from '@/data/mockKnowledgeComponents.json';
import type { KnowledgeComponent } from '@/types/knowledgeComponent';

async function populateKcs() {
  console.log(`Starting KC population. Found ${mockKcsData.length} KCs in mock data.`);

  let successCount = 0;
  let failureCount = 0;
  let skippedCount = 0;

  for (const kcData of mockKcsData) {
    try {
      // Check if KC already exists
      const existingKc = await knowledgeComponentService.getKcById(kcData.id);
      if (existingKc) {
        console.log(`KC with ID ${kcData.id} already exists. Skipping.`);
        skippedCount++;
        continue;
      }

      // Prepare KC data for insertion
      const kcToAdd: Omit<KnowledgeComponent, 'id'> & { id: string } = {
        id: kcData.id,
        name: kcData.name,
        description: kcData.description || undefined,
        subject: kcData.subject,
        gradeLevels: kcData.gradeLevels || [],
        domain: kcData.domain || undefined,
        curriculumStandards: undefined,
        prerequisiteKcs: undefined,
        postrequisiteKcs: undefined,
        tags: kcData.tags || undefined,
        difficultyEstimate: kcData.difficultyEstimate ? Number(kcData.difficultyEstimate) : undefined,
      };

      await knowledgeComponentService.addKc(kcToAdd);
      console.log(`Successfully added KC: ${kcData.name} (ID: ${kcData.id})`);
      successCount++;
    } catch (error: any) {
      console.error(`Failed to add KC ${kcData.name} (ID: ${kcData.id}): ${error.message}`);
      if (error.details) console.error('Error details:', error.details);
      failureCount++;
    }
  }

  console.log('--- KC Population Summary ---');
  console.log(`Successfully added: ${successCount}`);
  console.log(`Skipped (already exist): ${skippedCount}`);
  console.log(`Failed to add: ${failureCount}`);
  console.log('-----------------------------');
}

// To run this script: npx bun run src/scripts/populateKnowledgeComponents.ts
if (typeof process !== 'undefined' && process.argv && process.argv.length > 1 && import.meta.url === `file://${process.argv[1]}`) {
  (async () => {
    await populateKcs();
  })();
}

export { populateKcs };

import { knowledgeComponentService } from '@/services/knowledgeComponentService';
import mockKcsData from '@/data/mockKnowledgeComponents.json';
import type { KnowledgeComponent } from '@/types/knowledgeComponent';

async function populateKcs() {
  console.log(`Starting KC population. Found ${mockKcsData.length} KCs in mock data.`);

  let successCount = 0;
  let failureCount = 0;
  let skippedCount = 0;

  for (const kc of mockKcsData as Omit<KnowledgeComponent, 'id'> & { id: string }[]) {
    try {
      // Check if KC already exists
      const existingKc = await knowledgeComponentService.getKcById(kc.id);
      if (existingKc) {
        console.log(`KC with ID ${kc.id} already exists. Skipping.`);
        skippedCount++;
        continue;
      }

      // Type assertion, as mockKcsData might not perfectly match the full KnowledgeComponent type
      // or the input type of addKc if there are subtle differences (e.g. undefined vs null)
      // The service's mapKcToDbRow should handle this.
      const kcToAdd: Omit<KnowledgeComponent, 'id'> & { id: string } = {
        id: kc.id,
        name: kc.name,
        description: kc.description || undefined,
        subject: kc.subject,
        gradeLevels: kc.gradeLevels || [],
        domain: kc.domain || undefined,
        curriculumStandards: kc.curriculumStandards || undefined,
        prerequisiteKcs: kc.prerequisiteKcs || undefined,
        postrequisiteKcs: kc.postrequisiteKcs || undefined,
        tags: kc.tags || undefined,
        difficultyEstimate: kc.difficultyEstimate === null ? undefined : Number(kc.difficultyEstimate),
      };

      await knowledgeComponentService.addKc(kcToAdd);
      console.log(`Successfully added KC: ${kc.name} (ID: ${kc.id})`);
      successCount++;
    } catch (error: any) {
      console.error(`Failed to add KC ${kc.name} (ID: ${kc.id}): ${error.message}`);
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

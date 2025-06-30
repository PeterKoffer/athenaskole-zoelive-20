
import { supabase } from '@/integrations/supabase/client';

interface KnowledgeComponent {
  id: string;
  name: string;
  description?: string;
  subject: string;
  gradeLevels?: number[];
  domain?: string;
  curriculumStandards?: any;
  prerequisiteKcs?: string[];
  postrequisiteKcs?: string[];
  tags?: string[];
  difficultyEstimate?: number;
}

const sampleKnowledgeComponents: KnowledgeComponent[] = [
  {
    id: 'math_basic_arithmetic',
    name: 'Basic Arithmetic',
    description: 'Fundamental operations: addition, subtraction, multiplication, division',
    subject: 'Mathematics',
    gradeLevels: [1, 2, 3, 4],
    domain: 'Number Operations',
    difficultyEstimate: 0.2,
    tags: ['arithmetic', 'basic', 'operations']
  },
  {
    id: 'math_fractions_intro',
    name: 'Introduction to Fractions',
    description: 'Understanding fractions as parts of a whole',
    subject: 'Mathematics',
    gradeLevels: [3, 4, 5],
    domain: 'Fractions',
    prerequisiteKcs: ['math_basic_arithmetic'],
    difficultyEstimate: 0.4,
    tags: ['fractions', 'parts', 'whole']
  },
  {
    id: 'math_algebra_basics',
    name: 'Basic Algebra',
    description: 'Introduction to variables and simple equations',
    subject: 'Mathematics',
    gradeLevels: [7, 8, 9],
    domain: 'Algebra',
    prerequisiteKcs: ['math_basic_arithmetic', 'math_fractions_intro'],
    difficultyEstimate: 0.6,
    tags: ['algebra', 'variables', 'equations']
  },
  {
    id: 'english_reading_comprehension',
    name: 'Reading Comprehension',
    description: 'Understanding and analyzing written text',
    subject: 'English',
    gradeLevels: [2, 3, 4, 5, 6],
    domain: 'Reading',
    difficultyEstimate: 0.5,
    tags: ['reading', 'comprehension', 'analysis']
  },
  {
    id: 'science_scientific_method',
    name: 'Scientific Method',
    description: 'Understanding the process of scientific inquiry',
    subject: 'Science',
    gradeLevels: [5, 6, 7, 8],
    domain: 'Scientific Inquiry',
    difficultyEstimate: 0.5,
    tags: ['scientific method', 'inquiry', 'hypothesis']
  }
];

export async function populateKnowledgeComponents() {
  try {
    console.log('🚀 Starting to populate knowledge components...');
    
    for (const kc of sampleKnowledgeComponents) {
      console.log(`📝 Inserting KC: ${kc.name}`);
      
      const { error } = await supabase
        .from('knowledge_components')
        .upsert({
          id: kc.id,
          name: kc.name,
          description: kc.description,
          subject: kc.subject,
          grade_levels: kc.gradeLevels,
          domain: kc.domain,
          curriculum_standards: kc.curriculumStandards,
          prerequisite_kcs: kc.prerequisiteKcs,
          postrequisite_kcs: kc.postrequisiteKcs,
          tags: kc.tags,
          difficulty_estimate: kc.difficultyEstimate
        }, {
          onConflict: 'id'
        });

      if (error) {
        console.error(`❌ Error inserting KC ${kc.name}:`, error);
      } else {
        console.log(`✅ Successfully inserted KC: ${kc.name}`);
      }
    }
    
    console.log('🎉 Finished populating knowledge components!');
    
  } catch (error) {
    console.error('💥 Error populating knowledge components:', error);
    throw error;
  }
}

// Auto-run if this script is executed directly
if (typeof window !== 'undefined') {
  console.log('🔧 Knowledge Components population script loaded');
}

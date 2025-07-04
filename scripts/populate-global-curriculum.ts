import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import UNESCOCurriculumService, {
  CountryCurriculum,
  UNESCOStandard,
} from '../src/services/curriculum/UNESCOCurriculumService';
import { studyPugMathCurriculum, studyPugHighSchoolMath, CurriculumTopic as StudyPugTopic, CurriculumSubject as StudyPugSubject, CurriculumLevel as StudyPugLevel } from '../src/services/curriculum/studyPugCurriculum';
import { CurriculumStep, Curriculum } from '../src/types/curriculum';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const CURRICULUM_STEPS_PATH = path.join(__dirname, '../public/data/curriculum-steps.json');
const ALL_STUDYPUG_TOPICS = [...studyPugMathCurriculum, ...studyPugHighSchoolMath];

// Helper to get a 'subject' name from StudyPug topic context
const getStudyPugSubjectName = (topicId: string): string => {
  for (const level of ALL_STUDYPUG_TOPICS) {
    if (level.subjects) {
      for (const subject of level.subjects) {
        if (subject.topics.some(t => t.id === topicId)) {
          return subject.name;
        }
      }
    }
  }
  return 'Mathematics'; // Default
};

const transformStudyPugTopic = (topic: StudyPugTopic, stepId: string, order: number): Curriculum => {
  return {
    id: topic.id,
    stepId,
    title: topic.name,
    description: topic.description,
    subject: getStudyPugSubjectName(topic.id),
    content: `Description: ${topic.description}. Standards: ${topic.standards.join(', ')}.`,
    duration: topic.estimatedTime,
    isCompleted: false,
    order,
  };
};

const transformUnescoTopic = (
  topic: StudyPugTopic, // Re-using StudyPugTopic type for structure, adapt if UNESCO has different structure
  subjectName: string,
  stepId: string,
  order: number
): Curriculum => {
  return {
    id: topic.id, // Ensure UNESCO topics have unique IDs
    stepId,
    title: topic.name,
    description: topic.description,
    subject: subjectName,
    content: `Description: ${topic.description}. Standards: ${topic.standards?.join(', ') || 'N/A'}.`,
    duration: topic.estimatedTime || 30, // Default duration
    isCompleted: false,
    order,
  };
};


const populateCurriculumSteps = () => {
  console.log('Starting curriculum population script...');

  // 1. Read existing curriculum steps
  const curriculumStepsJson = fs.readFileSync(CURRICULUM_STEPS_PATH, 'utf-8');
  const curriculumStepsData = JSON.parse(curriculumStepsJson) as CurriculumStep[];
  console.log(`Loaded ${curriculumStepsData.length} base curriculum steps.`);

  // 2. Initialize UNESCO Service to access its data
  // UNESCOCurriculumService is exported as an instance, so we use it directly.
  const unescoService = UNESCOCurriculumService;
  const countryCurricula = unescoService.getAllCountries().map(code => unescoService.getCountryCurriculum(code)).filter(Boolean) as CountryCurriculum[];
  const unescoStandards = unescoService.getUNESCOStandards();
  console.log(`Initialized UNESCO Curriculum Service. Found data for ${countryCurricula.length} countries and ${unescoStandards.length} UNESCO standards.`);

  // 3. Process each step based on thematic mapping
  curriculumStepsData.forEach((step) => {
    step.curriculums = []; // Clear existing/sample curriculums
    let order = 1;
    const MAX_TOPICS_PER_STEP = 5; // Control how many topics we add per step

    console.log(`\nProcessing Step ${step.stepNumber}: ${step.title}`);

    // Helper to add topics and limit count
    const addTopic = (topic: Curriculum) => {
      if (step.curriculums.length < MAX_TOPICS_PER_STEP) {
        step.curriculums.push(topic);
      }
    };

    const dkCurriculum = countryCurricula.find(c => c.countryCode === 'DK');
    const usCurriculum = countryCurricula.find(c => c.countryCode === 'US');

    // --- Phase 1: Foundational Skills (Steps 1-3) ---
    if (step.stepNumber === 1) { // Foundation Basics (K, DK Math/Danish)
      ALL_STUDYPUG_TOPICS.find(l => l.grade === 0)?.subjects?.forEach(subj =>
        subj.topics.forEach(t => addTopic(transformStudyPugTopic(t, step.id, order++)))
      );
      dkCurriculum?.subjects?.find(s => s.name.includes('Matematik'))?.topics.slice(0,1)
        .forEach(t => addTopic(transformUnescoTopic(t, dkCurriculum.subjects.find(s => s.name.includes('Matematik'))!.name, step.id, order++)));
      dkCurriculum?.subjects?.find(s => s.name.includes('Dansk'))?.topics.slice(0,1)
        .forEach(t => addTopic(transformUnescoTopic(t, dkCurriculum.subjects.find(s => s.name.includes('Dansk'))!.name, step.id, order++)));
    } else if (step.stepNumber === 2) { // Building Blocks (G1, DK English)
      ALL_STUDYPUG_TOPICS.find(l => l.grade === 1)?.subjects?.forEach(subj =>
        subj.topics.forEach(t => addTopic(transformStudyPugTopic(t, step.id, order++)))
      );
      dkCurriculum?.subjects?.find(s => s.name.includes('Engelsk'))?.topics.slice(0,1)
        .forEach(t => addTopic(transformUnescoTopic(t, dkCurriculum.subjects.find(s => s.name.includes('Engelsk'))!.name, step.id, order++)));
    } else if (step.stepNumber === 3) { // Essential Skills (G2, DK Science)
      ALL_STUDYPUG_TOPICS.find(l => l.grade === 2)?.subjects?.forEach(subj =>
        subj.topics.forEach(t => addTopic(transformStudyPugTopic(t, step.id, order++)))
      );
      dkCurriculum?.subjects?.find(s => s.name.includes('Natur/teknik'))?.topics.slice(0,1)
        .forEach(t => addTopic(transformUnescoTopic(t, dkCurriculum.subjects.find(s => s.name.includes('Natur/teknik'))!.name, step.id, order++)));
    }

    // --- Phase 2: Development & Exploration (Steps 4-6) ---
    else if (step.stepNumber === 4) { // Intermediate Concepts (G3-4 Math, US/Other Lower Secondary Math/Literacy)
      ALL_STUDYPUG_TOPICS.filter(l => l.grade === 3 || l.grade === 4).forEach(level =>
        level.subjects?.forEach(subj => subj.topics.forEach(t => addTopic(transformStudyPugTopic(t, step.id, order++))))
      );
      usCurriculum?.subjects?.find(s => s.name.includes('Mathematics'))?.topics.slice(0,1) // Example from US curriculum
        .forEach(t => addTopic(transformUnescoTopic(t, usCurriculum.subjects.find(s => s.name.includes('Mathematics'))!.name, step.id, order++)));
    } else if (step.stepNumber === 5) { // Advanced Foundations (G5-6 Math, Science Intro, Digital Literacy)
      ALL_STUDYPUG_TOPICS.filter(l => l.grade === 5 || l.grade === 6).forEach(level =>
        level.subjects?.forEach(subj => subj.topics.forEach(t => addTopic(transformStudyPugTopic(t, step.id, order++))))
      );
      const scienceStandard = unescoStandards.find(s => s.id === 'unesco-science-inquiry');
      if (scienceStandard) addTopic({
          id: scienceStandard.id, stepId: step.id, title: `Intro: ${scienceStandard.competency}`,
          description: scienceStandard.description, subject: scienceStandard.domain,
          content: `Competency: ${scienceStandard.competency}. Description: ${scienceStandard.description}. Goal: ${scienceStandard.globalGoal}`,
          duration: 45, isCompleted: false, order: order++
      });
    } else if (step.stepNumber === 6) { // Complex Applications (G6-7 Math, Digital Literacy)
       ALL_STUDYPUG_TOPICS.filter(l => l.grade === 6 || l.grade === 7).forEach(level =>
        level.subjects?.forEach(subj => subj.topics.forEach(t => addTopic(transformStudyPugTopic(t, step.id, order++))))
      );
      const digiLitStandard = unescoStandards.find(s => s.id === 'unesco-digital-literacy');
      if (digiLitStandard) addTopic({
          id: digiLitStandard.id, stepId: step.id, title: digiLitStandard.competency,
          description: digiLitStandard.description, subject: digiLitStandard.domain,
          content: `Competency: ${digiLitStandard.competency}. Description: ${digiLitStandard.description}. Goal: ${digiLitStandard.globalGoal}`,
          duration: 50, isCompleted: false, order: order++
      });
    }

    // --- Phase 3: Expansion & Specialization (Steps 7-9) ---
    else if (step.stepNumber === 7) { // Specialized Topics (G8 Math, Intro HS Algebra/Geometry)
      ALL_STUDYPUG_TOPICS.find(l => l.grade === 8)?.subjects?.forEach(subj =>
        subj.topics.forEach(t => addTopic(transformStudyPugTopic(t, step.id, order++)))
      );
      ALL_STUDYPUG_TOPICS.filter(l => l.grade === 'HS' && (l.id.includes('algebra') || l.id.includes('geometry'))).slice(0,1).forEach(level =>
        level.subjects?.slice(0,1).forEach(subj => subj.topics.slice(0,1).forEach(t => addTopic(transformStudyPugTopic(t, step.id, order++)))) // take one subject, one topic
      );
    } else if (step.stepNumber === 8) { // Expert Level Thinking (HS Polynomials, Functions)
      ALL_STUDYPUG_TOPICS.filter(l => l.grade === 'HS').forEach(level => {
        level.subjects?.filter(s => s.id.includes('polynomials') || s.id.includes('building-functions')).forEach(subj =>
          subj.topics.forEach(t => addTopic(transformStudyPugTopic(t, step.id, order++)))
        );
      });
    } else if (step.stepNumber === 9) { // Mastery Phase (HS Congruence, Similarity, SDG intros)
      ALL_STUDYPUG_TOPICS.filter(l => l.grade === 'HS').forEach(level => {
        level.subjects?.filter(s => s.id.includes('congruence') || s.id.includes('similarity')).forEach(subj =>
          subj.topics.forEach(t => addTopic(transformStudyPugTopic(t, step.id, order++)))
        );
      });
      const sdgTechSkill = unescoStandards.find(s => s.id === 'unesco-digital-literacy' && s.globalGoal.includes('Technical')); // Example
      if (sdgTechSkill) addTopic({
          id: sdgTechSkill.id + '-mastery', stepId: step.id, title: `Advanced: ${sdgTechSkill.competency}`,
          description: sdgTechSkill.description, subject: sdgTechSkill.domain,
          content: `Competency: ${sdgTechSkill.competency}. Description: ${sdgTechSkill.description}. Goal: ${sdgTechSkill.globalGoal}`,
          duration: 60, isCompleted: false, order: order++
      });
    }

    // --- Phase 4: Integration & Innovation (Steps 10-12) ---
    else if (step.stepNumber === 10) { // Integration Skills (HS Stats/Prob, Interdisciplinary)
      ALL_STUDYPUG_TOPICS.find(l => l.id === 'cc-hs-statistics-probability')?.subjects?.forEach(subj =>
        subj.topics.forEach(t => addTopic(transformStudyPugTopic(t, step.id, order++)))
      );
      const sdgSustain = unescoStandards.find(s => s.globalGoal.includes('Sustainable Development'));
      if (sdgSustain) addTopic({
          id: sdgSustain.id + '-integration', stepId: step.id, title: `Project: ${sdgSustain.competency} & Sustainability`,
          description: `Integrate knowledge to explore ${sdgSustain.description}`, subject: "Interdisciplinary Project",
          content: `Standard: ${sdgSustain.framework} - ${sdgSustain.competency}. Goal: ${sdgSustain.globalGoal}. Apply multiple skills.`,
          duration: 120, isCompleted: false, order: order++
      });
    } else if (step.stepNumber === 11) { // Professional Application (UNESCO SDG 4.4)
      const sdgVocational = unescoStandards.find(s => s.globalGoal.includes('Technical and Vocational Skills'));
      if (sdgVocational) {
        addTopic({
            id: sdgVocational.id + '-pro', stepId: step.id, title: `Application: ${sdgVocational.competency}`,
            description: `Real-world application of ${sdgVocational.description}`, subject: "Vocational Exploration",
            content: `Standard: ${sdgVocational.framework} - ${sdgVocational.competency}. Goal: ${sdgVocational.globalGoal}. Case studies and practical skills.`,
            duration: 90, isCompleted: false, order: order++
        });
        // Add another related topic if possible
        dkCurriculum?.subjects?.find(s=>s.name.includes("Engelsk"))?.topics.slice(0,1) // e.g. Business English topic
          .forEach(t => addTopic(transformUnescoTopic(t, "Professional English", step.id, order++)));
      }
    } else if (step.stepNumber === 12) { // Excellence & Innovation (Advanced Projects, Global Citizenship)
       const advancedSdg = unescoStandards.find(s => s.globalGoal.includes('Sustainable Development') && s.level.includes('Secondary')); // More advanced
       if (advancedSdg) addTopic({
            id: advancedSdg.id + '-excellence', stepId: step.id, title: `Innovation Challenge: ${advancedSdg.domain}`,
            description: `Design an innovative solution related to ${advancedSdg.competency}`, subject: "Innovation Project",
            content: `Challenge based on ${advancedSdg.framework} - ${advancedSdg.competency}. Goal: ${advancedSdg.globalGoal}. Develop a creative project.`,
            duration: 150, isCompleted: false, order: order++
       });
       // Add an advanced StudyPug Math topic as well
       ALL_STUDYPUG_TOPICS.find(l => l.id === 'cc-hs-functions')?.subjects?.find(s => s.id === 'hs-bf')?.topics.slice(0,1) // Building Functions e.g.
         .forEach(t => addTopic(transformStudyPugTopic(t, step.id, order++)));
    }

    console.log(`Added ${step.curriculums.length} curriculum items to Step ${step.stepNumber}.`);
  });

  // 4. Write updated data back to file
  fs.writeFileSync(CURRICULUM_STEPS_PATH, JSON.stringify(curriculumStepsData, null, 2));
  console.log(`\nSuccessfully updated ${CURRICULUM_STEPS_PATH}`);
};

try {
  populateCurriculumSteps();
} catch (error) {
  console.error("Error during curriculum population process:", error);
  process.exit(1);
}

export {}; // Make this a module

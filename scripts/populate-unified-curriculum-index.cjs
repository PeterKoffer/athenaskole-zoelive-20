const fs = require('fs');
const path = require('path');

function readAndParse(filePath) {
  const fileContent = fs.readFileSync(path.resolve(__dirname, filePath), 'utf-8');
  const match = fileContent.match(/export const \w+:\s*CurriculumNode\[\]\s*=\s*(\[[\s\S]*?\]);/);
  if (match && match[1]) {
    try {
      const arrayString = match[1].replace(/,\s*([\]}])/g, '$1').replace(/NELIESubject\.\w+/g, (match) => `'${match.split('.')[1]}'`);
      return eval(`(${arrayString})`);
    } catch (e) {
      console.error(`Could not parse ${filePath}. Error: ${e.message}`);
      return [];
    }
  }
  return [];
}

const curriculumIndex = {};

const curriculumFiles = [
    '../src/data/curriculum/us/usMathData.ts',
    '../src/data/curriculum/us/usElaData.ts',
    '../src/data/curriculum/us/usScienceData.ts',
    '../src/data/curriculum/us/usHistoryData.ts',
    '../src/data/curriculum/us/usGeographyData.ts',
    '../src/data/curriculum/us/usPEData.ts',
    '../src/data/curriculum/us/usMusicData.ts',
    '../src/data/curriculum/us/usCreativeArtsData.ts',
    '../src/data/curriculum/us/usComputerScienceData.ts',
    '../src/data/curriculum/us/usLifeEssentialsData.ts',
    '../src/data/curriculum/us/usMentalWellnessData.ts',
    '../src/data/curriculum/us/usSpanishData.ts',
    '../src/data/curriculum/dk/dkData.ts',
    '../src/data/curriculum/dk/dkMusicData.ts',
    '../src/data/curriculum/dk/dkLifeEssentialsData.ts',
    '../src/data/curriculum/dk/dkCreativeArtsData.ts',
    '../src/data/curriculum/dk/dkComputerScienceData.ts',
];

curriculumFiles.forEach(filePath => {
    const fullPath = path.resolve(__dirname, filePath);
    if (fs.existsSync(fullPath)) {
        const nodes = readAndParse(filePath);
        nodes.forEach(node => {
            curriculumIndex[node.id] = node;
        });
    } else {
        console.warn(`File not found: ${fullPath}`);
    }
});


const curriculumStepsPath = path.resolve(__dirname, '../public/data/curriculum-steps.json');
const curriculumSteps = JSON.parse(fs.readFileSync(curriculumStepsPath, 'utf-8'));

curriculumSteps.forEach(step => {
  step.curriculums.forEach(curriculum => {
    if (!curriculumIndex[curriculum.id]) {
      curriculumIndex[curriculum.id] = {
        id: curriculum.id,
        parentId: `step-${step.id}`,
        nodeType: 'learning_objective',
        name: curriculum.title,
        description: curriculum.description,
        subjectName: curriculum.subject,
        estimatedDuration: curriculum.duration,
        tags: [step.difficulty],
        sourceIdentifier: curriculum.standards,
      };
    }
  });
});

const commonStandardsPath = path.resolve(__dirname, '../public/data/common-standards.json');
const commonStandards = JSON.parse(fs.readFileSync(commonStandardsPath, 'utf-8'));


Object.keys(commonStandards).forEach(subject => {
  commonStandards[subject].forEach(standard => {
    if (!curriculumIndex[standard.id]) {
      curriculumIndex[standard.id] = {
        id: standard.id,
        parentId: null,
        nodeType: 'learning_objective',
        name: standard.title,
        description: standard.description,
        subjectName: standard.subject,
        educationalLevel: standard.gradeLevel.toString(),
        tags: [standard.domain],
        sourceIdentifier: standard.code,
      };
    }
  });
});


const outputPath = path.resolve(__dirname, '../src/data/unified-curriculum-index.json');
fs.writeFileSync(outputPath, JSON.stringify(curriculumIndex, null, 2));

console.log('Unified curriculum index created successfully!');

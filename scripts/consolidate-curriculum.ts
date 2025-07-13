import fs from 'fs';
import path from 'path';
import { UnifiedCurriculumNode } from '../src/types/curriculum/UnifiedCurriculumNode';
import { CurriculumNode } from '../src/types/curriculum/CurriculumNode';

const curriculumDataPath = path.join(__dirname, '../src/data/curriculum');
const languageLabDataPath = path.join(__dirname, '../public/data/language-lab/curricula');

const allNodes: CurriculumNode[] = [];

// Load all curriculum files from src/data/curriculum
fs.readdirSync(path.join(curriculumDataPath, 'us')).forEach(file => {
  if (file.endsWith('.ts')) {
    const module = require(path.join(curriculumDataPath, 'us', file));
    for (const key in module) {
      if (Array.isArray(module[key])) {
        allNodes.push(...module[key]);
      }
    }
  }
});

fs.readdirSync(path.join(curriculumDataPath, 'dk')).forEach(file => {
  if (file.endsWith('.ts')) {
    const module = require(path.join(curriculumDataPath, 'dk', file));
    for (const key in module) {
      if (Array.isArray(module[key])) {
        allNodes.push(...module[key]);
      }
    }
  }
});

// Load and transform language lab data
fs.readdirSync(languageLabDataPath).forEach(file => {
  if (file.endsWith('.json')) {
    const languageData = JSON.parse(fs.readFileSync(path.join(languageLabDataPath, file), 'utf-8'));
    const languageNode: CurriculumNode = {
      id: `lang-${languageData.languageCode}`,
      parentId: null,
      nodeType: 'subject',
      name: `${languageData.languageName} Language`,
      languageCode: languageData.languageCode,
    };
    allNodes.push(languageNode);

    languageData.levels.forEach(level => {
      const levelNode: CurriculumNode = {
        id: level.levelId,
        parentId: languageNode.id,
        nodeType: 'grade_level',
        name: level.title,
        description: level.description,
      };
      allNodes.push(levelNode);

      level.units.forEach(unit => {
        const unitNode: CurriculumNode = {
          id: unit.unitId,
          parentId: level.levelId,
          nodeType: 'domain',
          name: unit.title,
        };
        allNodes.push(unitNode);

        unit.lessons.forEach(lesson => {
          const lessonNode: CurriculumNode = {
            id: lesson.lessonId,
            parentId: unit.unitId,
            nodeType: 'learning_objective',
            name: lesson.title,
          };
          allNodes.push(lessonNode);
        });
      });
    });
  }
});

const output = {
  nodes: allNodes,
};

const outputPath = path.join(__dirname, '../src/data/unified-curriculum-index.json');
fs.writeFileSync(outputPath, JSON.stringify(output, null, 2));

console.log(`Successfully consolidated curriculum data to ${outputPath}`);

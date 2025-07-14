import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// This script transforms the existing curriculum data into a new, AI-friendly format.
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const transformCurriculum = () => {
  const curriculumStepsPath = path.resolve(
    __dirname,
    "../public/data/curriculum-steps.json"
  );
  const unifiedCurriculumIndexPath = path.resolve(
    __dirname,
    "../src/data/unified-curriculum-index.json"
  );
  const outputPath = path.resolve(
    __dirname,
    "../src/data/ai-curriculum.json"
  );

  const curriculumSteps = JSON.parse(
    fs.readFileSync(curriculumStepsPath, "utf-8")
  );
  const unifiedCurriculumIndex = JSON.parse(
    fs.readFileSync(unifiedCurriculumIndexPath, "utf-8")
  );

  const subjects = {};

  // Process the curriculum steps data.
  for (const step of curriculumSteps) {
    for (const curriculum of step.curriculums) {
      const subjectName = curriculum.subject;
      if (!subjects[subjectName]) {
        subjects[subjectName] = {
          id: subjectName.toLowerCase().replace(/ /g, "-"),
          name: subjectName,
          grades: {},
        };
      }
    }
  }

  // Process the unified curriculum index data.
  for (const node of unifiedCurriculumIndex.nodes) {
    const subjectName = node.subjectName;
    if (!subjects[subjectName]) {
      subjects[subjectName] = {
        id: node.subject,
        name: subjectName,
        grades: {},
      };
    }
  }

  // TODO: Add logic to populate the grades, topics, and learning objectives.

  const aiCurriculum = {
    subjects: Object.values(subjects),
  };

  fs.writeFileSync(outputPath, JSON.stringify(aiCurriculum, null, 2));

  console.log("Curriculum data transformed successfully!");
};

transformCurriculum();

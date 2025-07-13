const fs = require('fs');
const path = require('path');
const ts = require('typescript');
const vm = require('vm');

const curriculumDir = path.resolve(__dirname, '../src/data/curriculum');
const outputDir = path.resolve(__dirname, '../src/data');
const outputFile = path.join(outputDir, 'unified-curriculum-index.json');

const allNodes = [];

const NELIESubject = {
    MATH: 'Mathematics',
    ENGLISH: 'English Language Arts',
    SCIENCE: 'Science',
    SOCIAL_STUDIES: 'Social Studies',
    PHYSICAL_EDUCATION: 'Physical Education',
    ART: 'Art',
    MUSIC: 'Music',
    WORLD_LANGUAGES: 'World Languages',
    COMPUTER_SCIENCE: 'Computer Science',
    HEALTH: 'Health',
    MENTAL_WELLNESS: 'Mental Wellness',
    LIFE_ESSENTIALS: 'Life Essentials'
};

function processFile(filePath) {
  console.log('processing file:', filePath);
  const content = fs.readFileSync(filePath, 'utf-8');
  const jsCode = ts.transpileModule(content, {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2015,
    },
  }).outputText;

  const sandbox = {
    exports: {},
    require: (moduleName) => {
      console.log('requiring:', moduleName)
      if (moduleName.startsWith('@/')) {
        if (moduleName === '@/types/curriculum/NELIESubjects') {
          return { NELIESubject };
        }
        const absolutePath = path.resolve(__dirname, '../src', moduleName.substring(2));
        try {
          return require(absolutePath);
        } catch (e) {
          if (e.code === 'MODULE_NOT_FOUND') {
            const tsPath = `${absolutePath}.ts`;
            if (fs.existsSync(tsPath)) {
              processFile(tsPath);
              return sandbox.exports;
            }
            return {};
          }
          throw e;
        }
      }
      return require(moduleName);
    },
  };

  vm.createContext(sandbox);
  vm.runInContext(jsCode, sandbox);

  for (const key in sandbox.exports) {
    if (Array.isArray(sandbox.exports[key])) {
      allNodes.push(...sandbox.exports[key]);
    }
  }
}

function traverseDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat.isDirectory()) {
      traverseDir(filePath);
    } else if (filePath.endsWith('.ts') && !filePath.endsWith('index.ts')) {
      processFile(filePath);
    }
  }
}

try {
  traverseDir(curriculumDir);

  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  fs.writeFileSync(outputFile, JSON.stringify({ nodes: allNodes }, null, 2));
  console.log(`Successfully created unified curriculum index at ${outputFile}`);
} catch (error) {
  console.error('Error creating unified curriculum index:', error);
}

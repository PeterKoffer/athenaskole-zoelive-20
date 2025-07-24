// scripts/point-nelie.ts
import { Project, SyntaxKind, Identifier } from "ts-morph";
import path from "path";

const TARGET = "@/components/RefactoredFloatingAITutor";
const ALIAS = "NELIE";

const OLD_COMPONENTS = [
  "AITutor",
  "FloatingAITutor",
  "NELIEAvatar",
  "RobotAvatar",
  "NelieAvatarDisplay",
  "NELIEFloating",
  "FloatingAI Tutor", // just in case any spaced names slipped in
];

const project = new Project({
  tsConfigFilePath: path.resolve("tsconfig.json"),
});

project.addSourceFilesAtPaths("src/**/*.{ts,tsx}");

for (const sourceFile of project.getSourceFiles()) {
  let touched = false;

  // ---- Fix imports ----
  sourceFile.getImportDeclarations().forEach((imp) => {
    const mod = imp.getModuleSpecifierValue();
    const matches =
      OLD_COMPONENTS.some((n) => mod.includes(n)) ||
      // sometimes people import from folders named like these
      /ai-tutor|floating-ai-tutor|nelie/i.test(mod);

    if (!matches) return;

    // point to the single source of truth
    imp.setModuleSpecifier(TARGET);

    // enforce default import named NELIE
    if (imp.getDefaultImport()) {
      imp.getDefaultImport()!.replaceWithText(ALIAS);
    } else {
      imp.removeNamedImports();
      imp.setDefaultImport(ALIAS);
    }

    touched = true;
  });

  // ---- Fix JSX tags ----
  const jsxTags = [
    ...sourceFile.getDescendantsOfKind(SyntaxKind.JsxOpeningElement),
    ...sourceFile.getDescendantsOfKind(SyntaxKind.JsxSelfClosingElement),
    ...sourceFile.getDescendantsOfKind(SyntaxKind.JsxClosingElement),
  ];

  jsxTags.forEach((tag) => {
    const nameNode = tag.getTagNameNode();
    if (nameNode.getKind() === SyntaxKind.Identifier) {
      const id = nameNode as Identifier;
      if (OLD_COMPONENTS.includes(id.getText())) {
        id.replaceWithText(ALIAS);
        touched = true;
      }
    }
  });

  if (touched) console.log("✔", sourceFile.getFilePath());
}

project
  .save()
  .then(() => console.log("✅ Done. All tutor/robot refs now point to RefactoredFloatingAITutor as <NELIE />"))
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
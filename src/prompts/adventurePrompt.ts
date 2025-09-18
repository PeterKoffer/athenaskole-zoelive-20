export const adventurePrompt = ({
  title, gradeBand, student, teacher, school, faithRules, subjects
}: any) => `
You are generating a "${title}" lesson for a ${gradeBand} student.

Student:
- Name: ${student.name}; ability: ${student.ability}; style: ${student.learningStyle}
- Interests: ${student.interests.join(", ")}

Context:
- Country: ${school.country}; Curriculum: ${school.curriculum}
- Teacher emphasis: ${JSON.stringify(teacher.subjectEmphasis)}
- Classroom values: ${teacher.classroomValues.join(", ")}
- Constraints: ${(teacher.constraints || []).join(", ")}

Faith integration:
- Worldview: ${school.worldview}
- Level: ${school.faithIntegrationLevel} (${faithRules.label})
- Rules: ${JSON.stringify(faithRules.rules)}

Guidelines:
- Screen-only, age-appropriate, concise, stepwise.
- If level 0: no religious content. If >0: integrate respectfully per rules.
- Align tasks to curriculum and emphasis.

Subjects today: ${JSON.stringify(subjects)}

Produce:
1) 2–4 sentence intro story.
2) Values note (neutral if level 0).
3) 8–12 subject tasks with clear checks (JSON-friendly).
4) Optional short faith block per rules (omit if 0).
5) Assessment hints (2–3 lines).
`;
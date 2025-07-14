// This service is responsible for generating the "universes" for the students.
// It takes into account the subject weights to give preference to subjects with higher weights.
const generateUniverse = (subjects, weights) => {
  const weightedSubjects = [];
  for (const subject of subjects) {
    const weight = weights[subject.id] || 5;
    for (let i = 0; i < weight; i++) {
      weightedSubjects.push(subject);
    }
  }

  // Shuffle the weighted subjects to randomize the selection.
  for (let i = weightedSubjects.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [weightedSubjects[i], weightedSubjects[j]] = [
      weightedSubjects[j],
      weightedSubjects[i],
    ];
  }

  // Select a random set of subjects for the universe.
  const selectedSubjects = [];
  const numSubjects = Math.min(
    weightedSubjects.length,
    Math.floor(Math.random() * 3) + 3
  );
  for (let i = 0; i < numSubjects; i++) {
    selectedSubjects.push(weightedSubjects[i]);
  }

  return {
    title: "A New Universe",
    description: "This is a new universe generated based on your preferences.",
    subjects: selectedSubjects,
  };
};

export default generateUniverse;

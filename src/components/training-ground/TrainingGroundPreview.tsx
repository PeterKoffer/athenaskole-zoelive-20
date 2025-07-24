import { ActivityRenderer } from './activities/ActivityRenderer';

const fakeStudent = {
  name: 'Alex',
  grade: 5,
  learningPreferences: {
    learningStyle: 'kinesthetic',
    interests: ['space', 'dinosaurs', 'building'],
  },
};

const mockedAIResponse = {
  title: 'Dinosaur Habitat Designer',
  objective: 'Design a habitat for a specific dinosaur, considering its needs.',
  explanation: 'This activity helps you understand animal habitats by designing one for a dinosaur. You\'ll think about what dinosaurs needed to survive, like food, water, and shelter, and use your creativity to build a model or draw a picture of the habitat.',
  activity: {
    type: 'Art Challenge',
    instructions: '1. Choose a dinosaur (e.g., T-Rex, Stegosaurus, Triceratops).\n2. Research its diet, size, and where it lived.\n3. Gather materials like a shoebox, construction paper, clay, and small plants.\n4. Build a diorama of the habitat, including food and water sources, and a place for the dinosaur to rest.',
  },
  optionalExtension: 'Write a short story about a day in the life of your dinosaur in its new habitat.',
  studentSkillTargeted: 'Research and creative expression',
  learningStyleAdaptation: 'This is a hands-on activity that allows for creative expression and physical construction, perfect for a kinesthetic learner.',
};

export function TrainingGroundPreview() {
  return (
    <div className="p-8 bg-gray-100">
      <h1 className="text-3xl font-bold mb-4">Training Ground Preview</h1>
      <p className="mb-8">This is a preview of the ActivityRenderer component with mocked data.</p>
      <ActivityRenderer
        activity={mockedAIResponse}
        onComplete={() => console.log('Activity completed!')}
        onRegenerate={() => console.log('Regenerate activity!')}
      />
    </div>
  );
}

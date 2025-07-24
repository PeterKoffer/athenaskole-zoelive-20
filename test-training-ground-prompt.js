// Quick test to verify the Training Ground prompt system
import { createTrainingGroundPrompt, mapAppDataToPromptContext } from './src/services/prompt-system/index.ts';
import { mapAppDataToPromptContext as mapData } from './src/services/prompt-system/dataMapping.ts';

console.log("🧪 Testing Training Ground Prompt System\n");

// Test 1: Basic prompt generation
const basicContext = {
  subject: "Mathematics",
  gradeLevel: 6
};

const basicPrompt = createTrainingGroundPrompt(basicContext);
console.log("✅ Basic prompt generated successfully");
console.log("Length:", basicPrompt.length, "characters");

// Test 2: Full 12-parameter system
const fullDataSources = {
  lessonContext: {
    subject: "Science",
    requested_duration: 45
  },
  studentProfile: {
    grade_level: 8,
    learning_style_preference: "hands-on experimentation",
    interests: ["robotics", "astronomy"],
    performance_data: {
      accuracy: 0.88,
      engagement_level: "high"
    }
  },
  teacherSettings: {
    teaching_approach: "inquiry-based learning",
    curriculum_alignment: "Next Generation Science Standards",
    lesson_duration_minutes: 50,
    subject_priorities: { "Science": "high" }
  },
  calendarData: {
    active_themes: ["Space Week", "Technology Month"],
    current_unit_duration: "2-week astronomy unit"
  }
};

const mappedContext = mapData(fullDataSources);
const fullPrompt = createTrainingGroundPrompt(mappedContext);

console.log("\n✅ Full 12-parameter prompt generated successfully");
console.log("Subject:", mappedContext.subject);
console.log("Grade Level:", mappedContext.gradeLevel);
console.log("Learning Style:", mappedContext.learningStyle);
console.log("Student Interests:", mappedContext.studentInterests);
console.log("Calendar Keywords:", mappedContext.calendarKeywords);
console.log("Subject Weight:", mappedContext.subjectWeight);

console.log("\n📝 Sample prompt preview:");
console.log(fullPrompt.substring(0, 300) + "...");

console.log("\n🎯 Training Ground prompt system is working! Ready for testing.");
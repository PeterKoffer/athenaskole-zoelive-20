# Training Ground: Parameter Data Sources

This document shows exactly where each of the 12 Training Ground parameters gets its data from in the application.

## 📊 Data Flow Overview

```
App Data → mapAppDataToPromptContext() → Training Ground Prompt → AI Content
```

## 🎯 Parameter Mapping

| Parameter | Data Source | Fallback | Request Field Examples |
|-----------|-------------|----------|------------------------|
| **1. Subject** | `requestData.subject` | `'Mathematics'` | `subject`, `lessonContext.subject` |
| **2. Grade Level** | `requestData.gradeLevel` | `6` | `gradeLevel`, `studentProfile.grade_level` |
| **3. Curriculum Standards** | `requestData.curriculumStandards` | `'broadly accepted topics...'` | `curriculumStandards`, `teacherSettings.curriculum_alignment` |
| **4. Teaching Perspective** | `requestData.teachingPerspective` | `'balanced, evidence-based style'` | `teachingPerspective`, `schoolPhilosophy` |
| **5. Lesson Duration** | `requestData.lessonDuration` | `35 minutes` | `lessonDuration`, `teacherSettings.lesson_duration_minutes` |
| **6. Subject Weight** | `requestData.subjectPriorities[subject]` | `'medium'` | `subjectPriorities`, `teacherSettings.subject_priorities` |
| **7. Calendar Keywords** | `requestData.calendarKeywords` | `[]` | `calendarKeywords`, `calendarData.active_themes` |
| **8. Calendar Duration** | `requestData.calendarDuration` | `'standalone session'` | `calendarDuration`, `calendarData.current_unit_duration` |
| **9. Student Abilities** | `requestData.studentAbilities` | Performance-based assessment | `studentAbilities`, `performanceData.accuracy` |
| **10. Learning Style** | `requestData.learningStyle` | `'multimodal approach'` | `learningStyle`, `studentProfile.learning_style_preference` |
| **11. Student Interests** | `requestData.studentInterests` | `[]` | `studentInterests`, `studentProfile.interests` |
| **12. Assessment Elements** | Built-in to prompt | Interactive activities + brief assessment | N/A - handled by AI |

## 🔧 Implementation Details

### Data Structure Mapping

```typescript
// Request Data → App Data Sources
const dataSources: AppDataSources = {
  lessonContext: {
    subject: requestData.subject,                    // → Parameter 1
    requested_duration: requestData.lessonDuration   // → Parameter 5
  },
  studentProfile: {
    grade_level: requestData.gradeLevel,             // → Parameter 2
    learning_style_preference: requestData.learningStyle, // → Parameter 10
    interests: requestData.studentInterests,         // → Parameter 11
    performance_data: { ... },                      // → Parameter 9
    abilities_assessment: requestData.studentAbilities
  },
  teacherSettings: {
    teaching_approach: requestData.teachingPerspective, // → Parameter 4
    curriculum_alignment: requestData.curriculumStandards, // → Parameter 3
    lesson_duration_minutes: requestData.lessonDuration,
    subject_priorities: requestData.subjectPriorities    // → Parameter 6
  },
  calendarData: {
    active_themes: requestData.calendarKeywords,     // → Parameter 7
    current_unit_duration: requestData.calendarDuration, // → Parameter 8
    ...
  }
};
```

### Smart Fallback System

The system uses intelligent fallbacks when data is missing:

```typescript
// Example: Student Abilities (Parameter 9)
studentAbilities = 
  requestData.studentAbilities ||                    // Direct specification
  determineAbilitiesFromPerformance(performanceData) || // Performance analysis
  'mixed ability with both support and challenges';     // Default fallback
```

## 🚀 Usage Examples

### Frontend Component
```typescript
// When calling from a React component:
const trainingGroundRequest = {
  subject: 'Science',
  gradeLevel: 8,
  learningStyle: 'visual',
  studentInterests: ['space', 'experiments'],
  teachingPerspective: 'inquiry-based learning',
  calendarKeywords: ['spring', 'growth'],
  // ... other parameters
};

const response = await supabase.functions.invoke('generate-adaptive-content', {
  body: { 
    type: 'training-ground',
    ...trainingGroundRequest 
  }
});
```

### Edge Function Processing
```typescript
// Inside the edge function:
const context = mapAppDataToPromptContext(dataSources);
const prompt = getPromptForContext('training-ground', context);
// → Generates: "You are a world-class Science teacher creating a lesson for Grade 8..."
```

## ✅ Validation

The system validates data completeness:

- **Required**: Subject (Parameter 1)
- **Warnings**: Missing grade level, learning style, etc.
- **Fallbacks**: Automatic for all parameters

## 🔗 Related Files

- `src/services/prompt-system/dataMapping.ts` - Core mapping logic
- `src/services/prompt-system/index.ts` - Prompt generation
- `supabase/functions/generate-adaptive-content/contentGenerator.ts` - Edge function integration

All 12 parameters are now properly mapped with clear data sources and robust fallbacks!

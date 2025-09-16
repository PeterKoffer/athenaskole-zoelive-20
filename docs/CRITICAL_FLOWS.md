# Critical User Flows - Implementation Guide

## 🌟 PRIMARY FLOW: Universe Generation

### **User Journey**
```
Student login → /daily-program → Select Universe → Generate → Experience → Complete
```

### **Technical Flow**
```typescript
// 1. User lands on Universe page
'/universe' → UniverseLesson.tsx

// 2. Click "Generate New Universe"
const sanitizedContext = {
  subject: selectedSubject,
  grade: userGrade,
  curriculum: userCountry,
  // ... 9 other parameters
};

// 3. Provider-agnostic generation
const result = await contentClient.generateContent(sanitizedContext);

// 4. Display result (JSON now, rich UI later)
setUniverseData(result);
```

### **Performance Requirements**
- **Generation time**: < 2 seconds
- **Fallback ready**: If AI fails, show pre-generated content
- **Cache first**: Check if similar universe exists

## 🎯 SECONDARY FLOW: Scenario Navigation

### **User Journey**
```
Universe view → Select scenario → Experience scenario → Return to Universe
```

### **Technical Implementation**
```typescript
// Route to specific scenario
navigate(`/scenario/${scenarioId}`, { 
  state: { 
    universeContext: currentUniverse,
    studentProfile: userProfile 
  } 
});

// In ScenarioRunner.tsx
const scenario = await contentClient.generateContent({
  ...sanitizedContext,
  scenarioId: params.scenarioId,
  parentUniverse: state.universeContext
});
```

## 🏃‍♂️ TRAINING GROUND FLOW

### **User Journey**
```
Subject selection → Difficulty choice → Activity stream → Progress tracking
```

### **Technical Pattern**
```typescript
// Training Ground specific generation
const trainingContent = await contentClient.generateContent({
  subject: 'Mathematics',
  skillArea: 'algebra',
  difficulty: 'intermediate',
  format: 'training-ground', // Signals different prompt template
  ...sanitizedContext
});
```

## 🔄 NELIE INTEGRATION POINTS

### **Conversation Triggers**
- Student asks for help during Universe/Scenario
- Student struggles with Training Ground exercise  
- Student requests explanation of concept

### **Technical Integration**
```typescript
// NELIE can be called from any learning context
const nelieResponse = await nelieService.askQuestion({
  question: studentQuestion,
  context: currentLearningContext,
  studentProfile: userProfile
});
```

---
**These flows ensure consistent, fast, personalized learning experiences across all modes.**
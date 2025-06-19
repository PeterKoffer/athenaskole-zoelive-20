// IMPORTANT: All content in this file is placeholder and illustrative.
// It MUST be reviewed, replaced, and approved by mental health professionals
// and curriculum experts before use in a real application.

import { EnhancedLessonConfig, ENHANCED_LESSON_PHASES } from './EnhancedLessonGenerator';
import { LessonActivity } from '../types/LessonTypes'; // Correctly import LessonActivity

// Define a type alias for cleaner phase content definition
type PhaseContent = LessonActivity['content'];

export const generateMentalWellnessLesson = (
  gradeLevel: number,
  learningStyle: string = 'mixed',
  sessionId: string = ''
): EnhancedLessonConfig => {
  let introPhaseContent: PhaseContent = {};
  let corePhaseContent: PhaseContent = {};
  let activityPhaseContent: PhaseContent = {};
  let applicationPhaseContent: PhaseContent = {};
  let creativePhaseContent: PhaseContent = {};
  let summaryPhaseContent: PhaseContent = {};

  // --- Grade Level Specific Content Placeholders ---

  // K-2 (Ages 5-7)
  if (gradeLevel >= 0 && gradeLevel <= 2) {
    introPhaseContent = {
      hook: `// TODO: Replace with expert-reviewed mental health content.
             [Placeholder K-2: Short, engaging animated story about "Feeling Friends" who experience different emotions (e.g., happy, sad, worried, excited) and learn it's okay to feel them.
              Visual: Bright, simple animation with cute characters. Auditory: Gentle narration, character voices, and calming background music.
              Learning Style (Mixed): Animation (Visual/Auditory), simple song about feelings (Auditory/Kinesthetic - encourage clapping/actions).
              Tone: Warm, reassuring, simple language.]`,
      thoughtQuestion: `// TODO: Replace with expert-reviewed mental health content.
                       [Placeholder K-2: Interactive question - "Which Feeling Friend are you most like today? Point to the picture!" (Show images of characters expressing emotions).
                        AI Behavior: Gentle, validating tone. "That's a wonderful feeling to share!"]`,
    };
    corePhaseContent = {
      text: `// TODO: Replace with expert-reviewed mental health content.
             [Placeholder K-2: "Understanding Our Feelings" - Simple explanation of 1-2 basic emotions (e.g., happiness, sadness). "When Sparkle the Feeling Friend feels happy, they smile and jump! When Gloom the Feeling Friend feels sad, they might cry a little, and that's okay."
              Visual: Illustrations of Feeling Friends showing emotions. Auditory: Narrator explains using simple terms.
              Tone: Gentle, empathetic.]`,
      segments: [ // Using segments for potential multiple parts
        {
          concept: "Feeling Faces Match-Up",
          explanation: `// TODO: Replace with expert-reviewed mental health content.
                        [Placeholder K-2: "Feeling Faces Match-Up" - Interactive game to match emotion words (spoken by AI) to pictures of faces.
                         Learning Style (Visual/Auditory): Matching images to spoken words. Kinesthetic: Drag and drop interface.
                         Tone: Playful, encouraging.]`,
          // No checkQuestion here as it's more of an activity description
        }
      ],
      gameType: 'matching' // Example of how to denote an activity within core content
    };
    activityPhaseContent = {
      gameType: 'puzzle-quest', // Example, could be custom
      activityInstructions: `// TODO: Replace with expert-reviewed mental health content.
                             [Placeholder K-2: "Mindful Breathing with a Feather" - Guided activity. "Imagine you have a light feather. Breathe in slowly, then breathe out gently to make the feather float." (If no physical feather, imagine one).
                              Visual: Animation of character breathing with a feather. Auditory: Calming voice guide. Kinesthetic: Children perform the breathing.
                              Tone: Calm, soothing.]`,
    };
    applicationPhaseContent = {
      scenario: `// TODO: Replace with expert-reviewed mental health content.
                 [Placeholder K-2: "Sharing is Caring" - Simple scenario: "Your friend is crying because they miss their mom. What can you do to help them feel a little better?"
                  Visual: Illustration of the scenario. Auditory: Narrator presents scenario.
                  Tone: Supportive, gentle prompting.]`,
      task: `// TODO: Replace with expert-reviewed mental health content.
             [Placeholder K-2: "What's a kind thing to do?" Options: a) Give a hug (if okay), b) Ask "Are you okay?", c) Tell them to stop crying (incorrect).
              AI Behavior: Positive reinforcement for kind choices. Explain why other choices might not be helpful.]`,
      // Options could be part of a 'question' field if structured as a quiz item
      question: "[Placeholder K-2: What's a kind thing to do?]",
      options: ["Give a hug (if okay)", "Ask 'Are you okay?'", "Tell them to stop crying"],
      correctAnswer: 1, // Index of "Ask 'Are you okay?'" assuming 0-indexed
      explanation: "// TODO: Replace with expert-reviewed content. Explain why asking is good, and why telling to stop isn't helpful."
    };
    creativePhaseContent = {
      creativePrompt: `// TODO: Replace with expert-reviewed mental health content.
                       [Placeholder K-2: "Draw Your Feeling" - "Use colors and shapes to draw how you're feeling right now, or how one of the Feeling Friends felt in our story."
                        Visual: Digital drawing tool or suggestion to use paper. Auditory: Gentle music. Kinesthetic: Act of drawing.
                        Tone: Encouraging, non-judgmental.]`,
      tools: ["Digital drawing tool (simulated)", "Paper and crayons (suggestion)"],
    };
    summaryPhaseContent = {
      keyTakeaways: [
        `// TODO: Replace with expert-reviewed mental health content. [Placeholder K-2: All your feelings are okay.]`,
        `// TODO: Replace with expert-reviewed mental health content. [Placeholder K-2: It's good to talk about feelings.]`,
      ],
      celebration: `// TODO: Replace with expert-reviewed mental health content.
                    [Placeholder K-2: "Great job exploring feelings today! The Feeling Friends are proud of you!"
                     Visual: Group picture of Feeling Friends waving. Auditory: Upbeat, positive closing message.
                     Tone: Positive, reinforcing.]`,
    };
  }
  // Grades 3-5 (Ages 8-10)
  else if (gradeLevel >= 3 && gradeLevel <= 5) {
    introPhaseContent = {
      storyContext: `// TODO: Replace with expert-reviewed mental health content.
                     [Placeholder 3-5: Engaging video story about a group of friends who encounter a challenge (e.g., preparing for a school play, a disagreement) and experience various emotions like nervousness, frustration, and excitement. They learn to talk about their feelings and support each other.
                      Visual: Relatable animated characters, school setting. Auditory: Voice actors, background music conveying mood.
                      Learning Style (Mixed): Story (Auditory/Visual), discussion prompts (Auditory).
                      Tone: Empathetic, relatable, slightly more complex vocabulary.]`,
      thoughtQuestion: `// TODO: Replace with expert-reviewed mental health content.
                       [Placeholder 3-5: "Think about a time you felt nervous about something new. What helped you feel a bit braver?"
                        AI Behavior: Encouraging sharing, validating experiences. "It's very common to feel that way!"]`,
    };
    corePhaseContent = {
      concept: "Understanding a Wider Range of Emotions",
      explanation: `// TODO: Replace with expert-reviewed mental health content.
                    [Placeholder 3-5: Introduce concepts like stress, anxiety (in simple terms), empathy. "Stress is like a backpack that feels too heavy. Empathy is understanding how someone else feels, like walking in their shoes."
                     Visual: Infographics, metaphors (heavy backpack). Auditory: Clear explanations, short audio clips of scenarios.
                     Tone: Informative, supportive.]`,
      gameType: 'matching', // e.g. Emotion Charades or Pictionary
      activityInstructions: `// TODO: Replace with expert-reviewed mental health content.
                             [Placeholder 3-5: "Emotion Charades or Pictionary" - AI suggests an emotion, student acts it out or draws it for AI to guess (or vice-versa if AI can generate images/animations).
                              Learning Style (Kinesthetic/Visual/Auditory): Active participation.
                              Tone: Fun, interactive, engaging.]`,
    };
    activityPhaseContent = {
      task: "Create Your Calm-Down Toolkit",
      activityInstructions: `// TODO: Replace with expert-reviewed mental health content.
                             [Placeholder 3-5: "My Calm-Down Toolkit" - Interactive exercise where students identify 2-3 simple things that help them calm down when feeling overwhelmed (e.g., deep breaths, thinking of a happy place, listening to music). They can type or record these.
                              Visual: Interface to create a virtual toolkit. Auditory: Option to record ideas. Kinesthetic: Typing/interacting with the toolkit.
                              Tone: Empowering, practical.]`,
      tools: ["Virtual toolkit interface", "Text input", "Audio recording option (simulated)"],
    };
    applicationPhaseContent = {
      scenario: `// TODO: Replace with expert-reviewed mental health content.
                 [Placeholder 3-5: "Problem Solving Together" - Scenario: "Two friends both want to play with the same toy at recess. They start to argue. How can they solve this problem fairly and kindly?"
                  Visual: Comic strip of the scenario. Auditory: Scenario narration.
                  Tone: Collaborative, guiding.]`,
      question: `// TODO: Replace with expert-reviewed mental health content.
                 [Placeholder 3-5: Brainstorm solutions. "What are some ways they could work it out?" (e.g., take turns, play together, find another toy).
                  AI Behavior: Facilitate brainstorming, offer gentle suggestions if stuck. Focus on communication and compromise.]`,
      // This is more of a discussion prompt than a multiple choice.
    };
    creativePhaseContent = {
      creativePrompt: `// TODO: Replace with expert-reviewed mental health content.
                       [Placeholder 3-5: "Write a Short Story/Comic About Kindness" - "Create a short story or a few comic panels about someone showing kindness or helping a friend who is feeling down."
                        Visual: Simple comic creation tool or text editor. Auditory: Suggestion to read story aloud. Kinesthetic: Writing/drawing.
                        Tone: Creative, expressive, positive.]`,
      tools: ["Simple comic creation tool (simulated)", "Text editor"],
    };
    summaryPhaseContent = {
      keyTakeaways: [
        `// TODO: Replace with expert-reviewed mental health content. [Placeholder 3-5: You can understand and manage a wider range of emotions.]`,
        `// TODO: Replace with expert-reviewed mental health content. [Placeholder 3-5: Your 'Calm-Down Toolkit' can help you.]`,
        `// TODO: Replace with expert-reviewed mental health content. [Placeholder 3-5: Kindness and empathy are important for friendships.]`,
      ],
      celebration: `// TODO: Replace with expert-reviewed mental health content.
                    [Placeholder 3-5: "You've learned so much about understanding your feelings and helping others! Remember to use your 'Calm-Down Toolkit' and practice kindness. Keep being an awesome friend to yourself and others!"
                     Visual: Positive imagery, perhaps characters from intro giving a thumbs up. Auditory: Encouraging closing message.
                     Tone: Uplifting, reinforcing learned concepts.]`,
    };
  }
  // Grades 6-8 (Ages 11-13)
  else if (gradeLevel >= 6 && gradeLevel <= 8) {
    introPhaseContent = {
      text: `// TODO: Replace with expert-reviewed mental health content.
             [Placeholder 6-8: Short documentary-style video featuring relatable teens discussing common stressors (e.g., school pressure, social media, friendships) and how they navigate them. Focus on normalizing these feelings.
              Visual: Real teens (or realistic avatars), diverse scenarios. Auditory: Teen voices, thoughtful background music.
              Learning Style (Visual/Auditory): Authentic stories.
              Tone: Mature, respectful, validating, non-preachy.]`,
      question: `// TODO: Replace with expert-reviewed mental health content.
                 [Placeholder 6-8: Poll/anonymous Q&A: "What's one thing that sometimes makes you feel stressed or overwhelmed? (Your answers are anonymous)."
                  AI Behavior: Display anonymous common themes. "Many students feel pressure from exams. It's okay to feel that way."]`
    };
    corePhaseContent = {
      concept: "Understanding Stress and Healthy Coping Mechanisms",
      explanation: `// TODO: Replace with expert-reviewed mental health content.
                    [Placeholder 6-8: Explain the body's stress response (simple terms). Introduce various coping strategies (e.g., exercise, hobbies, talking to trusted adults, mindfulness). Differentiate between healthy and unhealthy coping.
                     Visual: Diagrams of stress response, icons for coping strategies. Auditory: Clear explanations, short audio clips of teens describing how they cope.
                     Tone: Informative, empowering, non-judgmental.]`,
      activityInstructions: `// TODO: Replace with expert-reviewed mental health content.
                             [Placeholder 6-8: "Scenario Analysis: Stress Triggers & Coping" - Present 2-3 short scenarios of teens facing stressors. Students identify triggers and suggest healthy coping strategies for each.
                              Learning Style (Auditory/Visual): Analyzing written/audio scenarios. Kinesthetic: Interactive quiz/drag-and-drop matching triggers to strategies.
                              Tone: Analytical, problem-solving focus.]`,
      gameType: 'problem-solving', // Example
    };
    activityPhaseContent = {
      activityInstructions: `// TODO: Replace with expert-reviewed mental health content.
                             [Placeholder 6-8: "Guided Mindfulness Exercise: Body Scan or Mindful Listening" - 3-5 minute audio-guided mindfulness practice.
                              Visual: Calming abstract visuals or nature scenes. Auditory: Soothing voice guide. Kinesthetic: Focus on bodily sensations or sounds.
                              Tone: Calm, focused, experiential.]`,
      gameType: 'exploration-sim' // Represents a guided practice
    };
    applicationPhaseContent = {
      scenario: `// TODO: Replace with expert-reviewed mental health content.
                 [Placeholder 6-8: "Supporting a Friend" - Scenario: "Your friend seems really down lately and isn't joining in activities. They told you they feel like 'nobody gets them.' How could you offer support?"
                  Visual: Realistic illustration or short animation. Auditory: Scenario narration.
                  Tone: Empathetic, practical advice seeking.]`,
      question: `// TODO: Replace with expert-reviewed mental health content.
                 [Placeholder 6-8: Discuss helpful actions: Listening without judgment, encouraging them to talk to a trusted adult, inviting them to do something low-pressure, reminding them you care. Discuss unhelpful actions: Giving unsolicited advice, minimizing their feelings, gossiping.
                  AI Behavior: Facilitate discussion, provide expert-backed suggestions. Highlight importance of professional help if needed.]`
    };
    creativePhaseContent = {
      creativePrompt: `// TODO: Replace with expert-reviewed mental health content.
                       [Placeholder 6-8: "Design a 'Mental Wellness Tip' Infographic or Social Media Post" - Students use simple design tools (or describe their idea) to create a shareable tip about stress management, mindfulness, or seeking help.
                        Visual: Simple graphic design interface or template. Auditory: Option to add voiceover to their design. Kinesthetic: Designing/writing.
                        Tone: Creative, peer-to-peer sharing focus.]`,
      tools: ["Simple infographic tool (simulated)", "Social media post template (simulated)"],
    };
    summaryPhaseContent = {
      keyTakeaways: [
        `// TODO: Replace with expert-reviewed mental health content. [Placeholder 6-8: Taking care of your mental health is a strength.]`,
        `// TODO: Replace with expert-reviewed mental health content. [Placeholder 6-8: There are healthy ways to cope with stress.]`,
        `// TODO: Replace with expert-reviewed mental health content. [Placeholder 6-8: Support for yourself and friends is available.]`,
      ],
      nextTopicSuggestion: `// TODO: Replace with expert-reviewed mental health content. [Placeholder 6-8: Explore more about mindfulness or building resilience.]`,
      celebration: `// TODO: Replace with expert-reviewed mental health content.
                    [Placeholder 6-8: "Taking care of your mental health is a strength. Remember the coping strategies we discussed, practice mindfulness, and don't hesitate to reach out for support for yourself or a friend. You're not alone."
                     Visual: Links to vetted resources (e.g., helplines, trusted websites - these MUST be expert-approved). Auditory: Calm, empowering closing message.
                     Tone: Supportive, resource-oriented, hopeful.]`
    };
  }
  // Grades 9-12 (Ages 14-18) - Default/Catch-all for higher grades
  else {
    introPhaseContent = {
      text: `// TODO: Replace with expert-reviewed mental health content.
             [Placeholder 9-12: Thought-provoking video montage with diverse young adults sharing brief perspectives on mental wellness, resilience, and breaking stigma. Could include spoken word or artistic expression.
              Visual: Cinematic, diverse representation. Auditory: Authentic voices, impactful music.
              Learning Style (Visual/Auditory): Engaging, mature content.
              Tone: Respectful, inspiring, destigmatizing.]`,
      question: `// TODO: Replace with expert-reviewed mental health content.
                 [Placeholder 9-12: Anonymous poll: "On a scale of 1-5, how comfortable are you discussing mental health topics?" Followed by, "What's one myth about mental health you'd like to see busted?"
                  AI Behavior: Acknowledge results, emphasize importance of open conversation and accurate information.]`
    };
    corePhaseContent = {
      concept: "Deep Dive: Understanding Common Mental Health Challenges & Building Resilience",
      explanation: `// TODO: Replace with expert-reviewed mental health content.
                    [Placeholder 9-12: Factual information from reputable sources (e.g., NIMH, WHO) about common conditions like anxiety and depression - focus on symptoms, not diagnosis. Discuss recognizing signs (in self and others), the importance of professional help, and protective factors for resilience.
                     Visual: Clear infographics, statistics (cited), short video explanations from experts. Auditory: Expert interviews (clips), clear narration of complex topics.
                     Tone: Informative, direct, hopeful, destigmatizing. Emphasize this is not for self-diagnosis.]`,
      activityInstructions: `// TODO: Replace with expert-reviewed mental health content.
                             [Placeholder 9-12: "Interactive Case Study Analysis" - Present a few detailed (but anonymized and fictionalized) case studies of young people experiencing mental health challenges. Students analyze factors involved, potential support strategies, and resources.
                              Learning Style (Auditory/Visual): Reading/listening to complex scenarios. Kinesthetic: Interactive elements to click for more info or answer questions within the case study.
                              Tone: Analytical, empathetic, solution-oriented.]`,
      gameType: 'simulation' // Represents case study analysis
    };
    activityPhaseContent = {
      task: "Building a Self-Care Plan",
      activityInstructions: `// TODO: Replace with expert-reviewed mental health content.
                             [Placeholder 9-12: Interactive tool where students identify personal stressors, warning signs, coping strategies that work for them, support people, and resources. Plan can be saved/exported.
                              Visual: Structured digital planner. Auditory: Option to add voice notes to their plan. Kinesthetic: Typing, selecting options.
                              Tone: Proactive, personalized, empowering.]`,
      text: `// TODO: Replace with expert-reviewed mental health content.
             [Placeholder 9-12: "Optional: Mindful Journaling Prompts" - Offer a few prompts for private reflection related to stress, gratitude, or personal strengths. Emphasize privacy.
              Learning Style (Kinesthetic/Visual): Writing/typing.
              Tone: Reflective, optional, respectful of privacy.]` // Adding journaling as secondary content here
    };
    applicationPhaseContent = {
      scenario: `// TODO: Replace with expert-reviewed mental health content.
                 [Placeholder 9-12: "Navigating Difficult Conversations: Asking for Help or Supporting a Peer" - Role-playing scenarios (AI can be one partner) focusing on how to start a conversation about mental health, what to say/not say, active listening.
                  Visual: Script prompts, character avatars for role-play. Auditory: AI voice for role-play partner.
                  Tone: Practical skill-building, supportive.]`,
      task: `// TODO: Replace with expert-reviewed mental health content.
             [Placeholder 9-12: "Resource Mapping: Find Local/Online Support" - Guided activity to identify trusted local (school counselor, community centers) or online resources (vetted helplines, mental health organizations).
              AI Behavior: Provide links to pre-approved national/international resources. Emphasize verifying local resources. This requires careful curation of links.
              Learning Style (Visual/Kinesthetic): Researching and compiling information.]`
    };
    creativePhaseContent = {
      creativePrompt: `// TODO: Replace with expert-reviewed mental health content.
                       [Placeholder 9-12: "Create a 'Mental Wellness Awareness' Message" - Students can choose a medium (e.g., short video script, podcast segment idea, poem, digital poster concept) to convey a positive message about mental health, seeking help, or resilience.
                        Visual: Tools for chosen medium (e.g., text editor, link to simple design tool). Auditory: Option for audio recording. Kinesthetic: Creating content.
                        Tone: Creative, advocacy-oriented, empowering.]`,
      tools: ["Text editor", "Conceptual design tool link", "Audio recorder (simulated)"],
    };
    summaryPhaseContent = {
      keyTakeaways: [
        `// TODO: Replace with expert-reviewed mental health content. [Placeholder 9-12: Your mental health journey is ongoing and unique.]`,
        `// TODO: Replace with expert-reviewed mental health content. [Placeholder 9-12: Healthy coping skills and resilience can be built.]`,
        `// TODO: Replace with expert-reviewed mental health content. [Placeholder 9-12: Knowing how to seek and offer support is crucial.]`,
        `// TODO: Replace with expert-reviewed mental health content. [Placeholder 9-12: You can be an advocate for mental wellness.]`,
      ],
      celebration: `// TODO: Replace with expert-reviewed mental health content.
                    [Placeholder 9-12: "Your mental health journey is ongoing. Continue to build your self-awareness, practice healthy coping skills, support others with empathy, and know when and how to seek help. Small actions can make a big difference. Be an advocate for mental wellness."
                     Visual: Inspiring imagery, links to continue learning (expert-vetted). Auditory: Hopeful and empowering closing statement.
                     Tone: Mature, empowering, forward-looking, call to action (positive self-advocacy and peer support).]`
    };
  }

  const lesson: EnhancedLessonConfig = {
    subject: "Mental Wellness",
    skillArea: "General Mental Wellness",
    gradeLevel: gradeLevel,
    learningStyle: learningStyle,
    sessionId: sessionId,
    title: `Mental Wellness: Grade ${gradeLevel}`,
    overview: `// TODO: Replace with expert-reviewed mental health content. [Placeholder: This lesson provides an age-appropriate introduction to understanding emotions, developing coping strategies, and supporting mental wellness for students in grade ${gradeLevel}. Learning Style: ${learningStyle}]`,
    phases: [
      {
        id: "introduction", // Added id
        type: "introduction", // Added type
        phase: "introduction",
        title: "Engaging Introduction",
        duration: ENHANCED_LESSON_PHASES.introduction.baseSeconds, // Corrected: use duration
        phaseDescription: "// TODO: Add phase description",
        content: introPhaseContent,
      },
      {
        id: "core-content",
        type: "content-delivery",
        phase: "content-delivery",
        title: "Core Content Delivery",
        duration: ENHANCED_LESSON_PHASES.contentDelivery.baseSeconds,
        phaseDescription: "// TODO: Add phase description",
        content: corePhaseContent,
      },
      {
        id: "interactive-activity",
        type: "interactive-game",
        phase: "interactive-game",
        title: "Interactive Learning Game/Activity",
        duration: ENHANCED_LESSON_PHASES.interactiveGame.baseSeconds,
        phaseDescription: "// TODO: Add phase description",
        content: activityPhaseContent,
      },
      {
        id: "application",
        type: "application",
        phase: "application",
        title: "Application & Problem-Solving",
        duration: ENHANCED_LESSON_PHASES.application.baseSeconds,
        phaseDescription: "// TODO: Add phase description",
        content: applicationPhaseContent,
      },
      {
        id: "creative-exploration",
        type: "creative-exploration",
        phase: "creative-exploration",
        title: "Creative/Exploratory Element",
        duration: ENHANCED_LESSON_PHASES.creativeExploration.baseSeconds,
        phaseDescription: "// TODO: Add phase description",
        content: creativePhaseContent,
      },
      {
        id: "summary",
        type: "summary",
        phase: "summary",
        title: "Summary & Next Steps",
        duration: ENHANCED_LESSON_PHASES.summary.baseSeconds,
        phaseDescription: "// TODO: Add phase description",
        content: summaryPhaseContent,
      },
    ],
    estimatedTotalDuration: Object.values(ENHANCED_LESSON_PHASES).reduce((sum, phase) => sum + phase.baseSeconds, 0),
    learningObjectives: [
        `// TODO: Replace with expert-reviewed mental health content. [Placeholder Objective 1 for Grade ${gradeLevel}]`,
        `// TODO: Replace with expert-reviewed mental health content. [Placeholder Objective 2 for Grade ${gradeLevel}]`
    ],
    materials: ["Device with internet access", "// TODO: Add any other specific materials, if expert-reviewed content requires them"],
    assessmentMethods: ["Interactive questions", "Activity participation", "// TODO: Add other assessment methods"],
    keywords: ["Mental Wellness", "Emotions", "Coping", "Well-being", `Grade ${gradeLevel}`],
  };

  return lesson;
};

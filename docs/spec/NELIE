# NELIE — Floating AI Tutor

## Purpose
- Conversational tutor with text+voice, guiding through Daily Program & Training Ground.
- Uses **AdaptationParams** (see domain/spec/adaptation.ts) for every generation call.

## Tools (capabilities the LLM can “call”)
- GenerateLesson, Explain(outcomeId), SocraticQuestion(difficulty),
- CheckAnswer(userAnswer, rubric?), CreateSimulationStep(nodeId),
- AdaptDifficulty(delta), Translate(toLocale).

## IO
- Speak (TTS), Listen (ASR), Render messages to chat UI, safe content filter (age-appropriate).

## Safety
- Output moderation per grade & locale.
- Teacher oversight: transcript & override.

## State (minimal)
- Current mode (daily-program | training-ground)
- Current subject(s) & curriculum outcomes
- Recent answers & performance signals

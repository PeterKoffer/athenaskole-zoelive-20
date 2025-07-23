# Training Ground Prompt Template

This guide outlines the key parameters for writing prompts that generate personalized lessons using the Training Ground feature. Include these elements whenever possible so the AI can tailor lessons effectively.

## Key Parameters

1. **Subject (Content Area)** – Specify the subject so the AI can adapt the lesson style and activities. *Fallback:* use a general academic focus if not provided.
2. **Student Grade Level** – Indicates the complexity of language and concepts. *Fallback:* assume middle school level if not stated.
3. **Curriculum Alignment** – Mention any standards or objectives for alignment. *Fallback:* use broadly accepted topics for the grade and subject.
4. **School/Teaching Perspective** – Reference pedagogical approach or philosophy. *Fallback:* default to a balanced, evidence‑based style.
5. **Lesson Duration** – State the intended length (e.g. 30 minutes). *Fallback:* use 30–45 minutes if unspecified.
6. **Subject Weight (Content Emphasis)** – Indicate priority or weighting relative to other subjects. *Fallback:* treat all subjects equally.
7. **Calendar Context (Keywords)** – Include seasonal themes or events. *Fallback:* omit time‑specific references.
8. **Calendar Duration** – Describe the broader timeframe or unit length. *Fallback:* treat the lesson as a standalone session.
9. **Student Abilities and Proficiency** – Note prior knowledge or skill level. *Fallback:* assume mixed ability and include both support and challenges.
10. **Learning Style Preferences** – Visual, auditory, kinesthetic, etc. *Fallback:* use a multimodal approach.
11. **Student Interests** – Incorporate hobbies or interests for engagement. *Fallback:* use generally relatable examples.
12. **Interactive & Assessment Elements** – Include at least one interactive activity and a brief quiz or review.

By weaving these elements into a prompt, Training Ground can produce engaging lessons that adapt to the learner’s needs, align with curriculum requirements, and make use of relevant themes or interests.

## Example Prompt

> "You are a world-class **[Subject]** teacher creating a lesson for a **[Grade Level]** student. Develop a lesson aligned with **[Curriculum Standards or Objectives]** and incorporate the school's **[Teaching Perspective]** approach. The lesson should be designed for about **[Lesson Duration]** of learning. Since **[Subject]** is a **[high/medium/low]** priority subject in our curriculum, adjust the depth accordingly. Consider the context of **[Calendar Keywords]** over the next **[Calendar Duration]** in the lesson content. Tailor the material to the student's skill level – **[describe Student Ability Level]**, providing support or extension as needed. Use a **[Learning Style]** approach and connect to the student's interest in **[Student Interests]** to make the lesson engaging. Include interactive activities or a game, and end with a brief quiz or test to assess understanding."

Replace the placeholders with actual information to generate a tailored, high-quality lesson.

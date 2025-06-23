# Supabase Edge Function: `generate-nelie-activity-content`

This Edge Function is responsible for generating dynamic content for various learning activities within the NELIE platform. It takes a request detailing the desired activity parameters and leverages a Large Language Model (LLM), like OpenAI's GPT, to produce engaging and contextually appropriate educational content.

## Purpose

To centralize AI-driven content generation for lesson activities, ensuring consistency with NELIE's persona and educational goals. This function will be called by the frontend or a backend service that needs to populate a `LessonActivity` with dynamic content.

## Input: `DynamicContentRequest`

The function expects a JSON payload in the request body matching the `DynamicContentRequest` interface defined in `index.ts`. Key fields include:

-   `subject`: (string) The subject of the lesson (e.g., "Mathematics", "Science").
-   `focusArea`: (string) The specific topic or skill being taught (e.g., "Fractions", "Photosynthesis").
-   `activityType`: (string) The type of activity for which content is needed (e.g., 'introduction', 'content-delivery', 'interactive-game', 'application', 'creative-exploration', 'summary').
-   `difficulty`: (number) A numerical representation of the content difficulty (e.g., 1-10).
-   `gradeLevel`: (number) The target K-12 grade level for the content.
-   `promptDetails`: (object, optional) Specific instructions to guide the LLM, including:
    -   `persona`: (string) Defines the AI's persona (should typically be "NELIE").
    -   `tone`: (string) Describes the desired tone of the AI.
    -   `style`: (string) Outlines the communication style.
    -   `imagery`: (string) Instructions for using imagery and analogies.
    -   `requestType`: (string) More specific type of request for the LLM.
    -   Other custom fields relevant to the `activityType`.

## Output: `DynamicContentResponse`

The function returns a JSON response matching the `DynamicContentResponse` interface:

-   `title`: (string, optional) An AI-suggested title for the `LessonActivity`.
-   `content`: (object) The structured content object for the activity. The fields within `content` will vary based on the `activityType` requested (e.g., for an 'introduction', it might contain `hook`, `realWorldExample`; for a 'game', it might contain `question`, `options`, `correctAnswerIndex`).

## Core Logic

1.  **Request Handling:** Receives the `DynamicContentRequest`.
2.  **Prompt Engineering:** The `craftLLMPrompt` function constructs a detailed prompt for the LLM based on the request parameters and NELIE's persona guidelines. It also specifies the desired JSON output structure.
3.  **LLM Interaction (Placeholder):** Contains commented-out code for interacting with an LLM service (e.g., OpenAI). This section needs to be configured with an API key and uncommented for live AI generation.
4.  **Mock Response (Current):** Currently, the function returns a structured mock response based on the `activityType` to allow frontend development and testing without live LLM calls. This should be replaced with the actual LLM response.
5.  **Response Formatting:** Returns the generated (or mocked) content as a JSON object.

## Environment Variables

For live LLM integration (e.g., with OpenAI), you will need to set the following environment variable in your Supabase project settings:

-   `OPENAI_API_KEY`: Your API key for the OpenAI service.

(Add any other LLM provider-specific keys as needed).

## Deployment

Deploy this function to your Supabase project using the Supabase CLI:

```bash
supabase functions deploy generate-nelie-activity-content --no-verify-jwt
```
The `--no-verify-jwt` flag can be used if you are handling auth/security within the function or if it's intended to be publicly accessible (ensure appropriate security measures if so). For protected functions, JWT verification is recommended.

## Error Handling

The function includes basic error handling. If the LLM call fails or the request is malformed, it returns a JSON error object with a 500 status code.

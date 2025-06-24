# Supabase Edge Function: `generate-adventure-image`

This Edge Function is responsible for generating images based on text prompts, primarily for use within Learning Adventures in the NELIE platform. It's designed to take a textual description and (conceptually) call an AI image generation service (like DALL-E, Stability AI, etc.) to produce an image. The URL of the generated image (or a mock URL during development) is then returned.

## Purpose

To dynamically create visual assets for Learning Adventures, enhancing engagement and providing context for narratives, choices, chapters, and activities. This allows for unique imagery tailored to the generated content.

## Input: `ImageGenerationRequest`

The function expects a JSON payload in the request body matching the `ImageGenerationRequest` interface defined in `index.ts`.

-   `textPrompt`: (string, **required**) The textual description that will be used to generate the image. This prompt should be descriptive and guide the AI towards the desired visual.
-   **Optional Parameters** (commented out in `index.ts` but can be added):
    -   `style`: (string, optional) e.g., 'photorealistic', 'cartoon', 'impressionistic', 'pixel-art', 'fantasy', 'sci-fi'. To guide the artistic style of the image.
    -   `aspectRatio`: (string, optional) e.g., '16:9', '1:1', '4:3'. To specify the desired dimensions.
    -   `quality`: (string, optional) e.g., 'standard', 'hd'.
    -   `seed`: (number, optional) For some models, a seed can be used for reproducible image outputs.

## Output: `ImageGenerationResponse`

The function returns a JSON response matching the `ImageGenerationResponse` interface:

-   `imageUrl`: (string, optional) The URL of the generated (or mocked) image.
-   `promptUsed`: (string, optional) The text prompt that was actually used for generation (useful for debugging).
-   `error`: (string, optional) A short error message if image generation failed.
-   `errorMessage`: (string, optional) A more detailed error message if available.

## Core Logic

1.  **Request Handling:** Receives the `ImageGenerationRequest`. Handles CORS preflight (`OPTIONS`) requests and ensures the request method is `POST`. Validates that `textPrompt` is provided.
2.  **AI Image Generation (Placeholder):**
    *   The `index.ts` file contains commented-out placeholder code for interacting with an AI image generation service (e.g., OpenAI's DALL-E).
    *   This section would involve:
        *   Retrieving an API key from environment variables.
        *   Making an API call to the image generation service with the `textPrompt` and any optional parameters.
        *   Receiving the generated image data, typically as a URL or base64 encoded JSON.
3.  **Image Storage (Optional but Recommended Placeholder):**
    *   The placeholder code also includes conceptual steps for storing the generated image in Supabase Storage. This is recommended for:
        *   **Persistence:** AI-generated URLs can be temporary.
        *   **Control:** Manage your own image assets.
        *   **Performance:** Serve images from Supabase's CDN.
    *   This involves fetching the image from the AI's URL (if not base64), and then uploading it to a designated Supabase Storage bucket. The public URL from Supabase Storage would then be returned.
4.  **Mock Response (Current Implementation):**
    *   Currently, for development and testing without live AI calls, the function uses `generateMockImageUrl`. This helper function generates a placeholder image URL (e.g., from `via.placeholder.com`) based on the input prompt to provide a visual stand-in.
5.  **Response Formatting:** Returns the `imageUrl` and `promptUsed` (or an error object) as a JSON response.

## Environment Variables

For live AI image generation and Supabase Storage integration, you will need to set the following environment variables in your Supabase project settings (Settings > Functions):

-   `IMAGE_GENERATION_API_KEY`: Your API key for the chosen image generation service (e.g., `OPENAI_API_KEY` for DALL-E).
-   `SUPABASE_URL`: Your Supabase project URL (already available to functions).
-   `SUPABASE_SERVICE_ROLE_KEY`: Your Supabase service role key (for admin-level access to storage if needed for creating/writing files).

You'll also need to create a Supabase Storage bucket (e.g., `adventure-images-bucket`) and set appropriate access policies.

## Deployment

Deploy this function to your Supabase project using the Supabase CLI:

```bash
supabase functions deploy generate-adventure-image --no-verify-jwt
```

Consider JWT verification for production environments if the function is not intended to be publicly callable without authentication.

## Example Invocation (Conceptual)

Using `curl`:

```bash
curl -X POST 'YOUR_SUPABASE_FUNCTION_URL/generate-adventure-image' \
-H 'Authorization: Bearer YOUR_SUPABASE_ANON_KEY' \
-H 'Content-Type: application/json' \
-d '{
      "textPrompt": "A mystical forest with glowing mushrooms and a hidden pathway, digital art style"
    }'
```

Replace `YOUR_SUPABASE_FUNCTION_URL` and `YOUR_SUPABASE_ANON_KEY` with your actual Supabase project details.
The function will return a JSON response containing the `imageUrl` of the generated (or mocked) image.

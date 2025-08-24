# Welcome to your Lovable project

## Project info

**URL**: https://lovable.dev/projects/c96faea0-3ec3-4a92-bab3-340fee0110a7

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/c96faea0-3ec3-4a92-bab3-340fee0110a7) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating). You can also use the provided `setup.sh` script to install system packages and project dependencies automatically.

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies and system packages.
./setup.sh

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/c96faea0-3ec3-4a92-bab3-340fee0110a7) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/tips-tricks/custom-domain#step-by-step-guide)

## Documentation

Additional guides and references can be found in the `docs` folder. A new prompt template for generating Training Ground lessons is available here:

- [Training Ground Prompt Template](docs/TRAINING_GROUND_PROMPT_TEMPLATE.md)
- [Curriculum Coverage](docs/CURRICULUM_COVERAGE.md)
- 
## Images (auto-heal) & security

Universe covers are **auto-healed** by a Supabase Edge Function (`image-ensure`) that:

- Generates a cover on demand via an online AI image service.
- **Treats very small files as placeholders** (by default, anything under `PLACEHOLDER_MIN_BYTES`, 1 KB), and will regenerate.
- Falls back to a 1×1 PNG if image generation fails, so the UI always renders *something*.

### Security
To prevent abuse, the function requires a **server-to-server** bearer token:

1. Create a strong random string and set it as a secret (see “Setup” below) under `IMAGE_ENSURE_TOKEN`.
2. Call the function from **your server only** with:

```ts
await fetch(`${process.env.SUPABASE_URL}/functions/v1/image-ensure`, {
  method: 'POST',
  headers: {
    'content-type': 'application/json',
    'authorization': `Bearer ${process.env.IMAGE_ENSURE_TOKEN}`,
  },
  body: JSON.stringify({ bucket: 'public', objectKey: 'covers/my-universe.png', prompt: 'Learning universe cover' }),
});
```

> Never expose `IMAGE_ENSURE_TOKEN` or your **service role** key to the browser.

### Configuration

- `IMAGE_ENSURE_TOKEN` – required. Pre-shared bearer token for the edge function.
- `PLACEHOLDER_MIN_BYTES` – optional (default **1024**). Any file smaller than this is re-generated.

## Setup

We ship a `setup.sh` that wires required secrets and checks Storage:

```bash
chmod +x ./setup.sh
./setup.sh
```

What it does (idempotent):
- Ensures `public` Storage bucket exists (or uses your configured one).
- Sets function secrets: `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `IMAGE_ENSURE_TOKEN`, and optionally `PLACEHOLDER_MIN_BYTES`.
- Provides the cURL you can use for a quick manual test.

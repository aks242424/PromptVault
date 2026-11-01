# PromptVault

**PromptVault** is a web-based library for discovering, organizing, saving, and managing AI prompts for image and video generation. It is designed to make useful prompts easier to find, reuse, and maintain through a searchable public collection and an authenticated administration area.

> **Development and AI-assistance disclosure:** PromptVault was developed as a human-directed, AI-assisted project. The project concept, goals, feature decisions, testing, and final review were guided by the project owner. OpenAI ChatGPT was used as a development assistant for planning, generating and revising code, debugging, reviewing implementation choices, and preparing documentation. The project was **not created solely by AI**; the owner directed the work, made decisions, applied changes, configured services, and tested the application.

## Purpose

The purpose of PromptVault is to provide one central place to:

- Discover curated prompts for AI image and video generation.
- Browse prompts by category and tags.
- View prompt details and reuse prompt content.
- Save favourite prompts and shortcuts.
- Keep a history of recently viewed or used items.
- Discover a random published prompt or shortcut.
- Manage prompt content through a protected admin dashboard.
- Import multiple prompts from a CSV file instead of adding them one at a time.

PromptVault is a prompt-library and management application. It does not itself generate images or videos, and no direct image-generation API integration is part of the documented implementation.

## Features

### Public library

- **Home page:** Entry point to the PromptVault collection.
- **Explore:** Browse published prompts and shortcuts from the database.
- **Prompts:** Browse published prompts, including their descriptions, content, categories, tags, prompt type, and associated AI-tool metadata where available.
- **Shortcuts:** Browse reusable shortcuts and copy their content.
- **Prompt types:** Supports image and video prompt records.
- **Categories and tags:** Organize and discover related content.
- **Prompt thumbnails:** Display images stored in Supabase Storage.

### Personal productivity features

The following features are stored in the visitor's browser using `localStorage`; they are not synchronized between devices or accounts:

- **Favourites:** Save or remove prompts and shortcuts.
- **Recently viewed/used:** Keep a history of recent prompt and shortcut activity, limited to the latest 20 items.
- **Random discovery:** Open a randomly selected published prompt or shortcut.
- **Settings:** Save supported interface preferences, including reduced-motion and utility-panel behavior.

### Administration

The protected admin area focuses on prompt management and supports:

- Email/password sign-in through Supabase Auth.
- Admin membership verification using the `admin_users` table.
- Creating, editing, publishing, unpublishing, and deleting prompts.
- Managing prompt drafts and published content.
- Prompt thumbnail uploads and deletion through Supabase Storage.
- CSV bulk import with validation and duplicate checks.
- Prompt category, tag, and AI-tool metadata association.
- Paginated prompt management, multi-selection, and bulk publish, unpublish, and delete actions.
- Dashboard counts and prompt-management controls.

The documented admin workflow covers prompts. The public shortcuts page reads published shortcut records from Supabase; shortcut CRUD is not listed as an admin feature in this project documentation.

Imported prompts are initially saved as drafts. The CSV importer expects `title`, `content`, and `prompt_type`; `description`, `categories`, `tags`, and `ai_tools` are optional fields. Category and tag names must match entries already present in the database.

## Technology stack

| Area | Technology | Role |
|---|---|---|
| Application framework | [Astro](https://astro.build/) | Page rendering, routing, and server-side functionality |
| Styling | [Tailwind CSS](https://tailwindcss.com/) | Utility-first styling |
| Build integration | [Vite](https://vite.dev/) | Development and build tooling through Astro |
| Backend and database | [Supabase](https://supabase.com/) | PostgreSQL database, authentication, and storage |
| Authentication helpers | `@supabase/ssr` | Supabase authentication in server-rendered routes |
| Database client | `@supabase/supabase-js` | Access to Supabase services |
| Hosting adapter | [Astro Vercel adapter](https://docs.astro.build/en/guides/integrations-guide/vercel/) | Deployment to Vercel |
| Version control | [Git](https://git-scm.com/) and [GitHub](https://github.com/) | Source control and repository hosting |

The interface uses Space Grotesk for headings, DM Sans for body text, and JetBrains Mono for technical labels, with a dark visual theme and glass-style interface elements.

## AI tools and AI-assisted development

### AI tools supported by the library

Prompts can store an `ai_tools` metadata array. This allows a prompt to be associated with the AI tools it is intended for. The library supports this metadata for both browsing and administration. The actual tool names shown in the live collection depend on the records entered by the administrator; this README does not claim that PromptVault is connected to, or generates content through, those external tools.

### AI used to help build PromptVault

OpenAI ChatGPT was used during development as an assistant for:

- Breaking the project into features and implementation tasks.
- Planning the Astro, Supabase, and Vercel architecture.
- Drafting and revising Astro, JavaScript, TypeScript, SQL, and CSS code.
- Troubleshooting build errors and application behavior.
- Reviewing Supabase database access and Row Level Security policies.
- Working through authentication, admin protection, CSV import, and browser-side features.
- Preparing deployment guidance and project documentation.

The project owner remained responsible for directing the work, choosing features and design decisions, configuring the services, applying changes, and carrying out testing. AI assistance should be understood as part of the development process, not as sole authorship.

## Project structure

```text
PromptVault/
├── public/                  # Public static assets and favicons
├── src/
│   ├── components/          # Shared interface components
│   ├── data/                # Legacy/local data files; public collections use Supabase
│   ├── layouts/             # Shared page layout
│   ├── lib/                 # Supabase client configuration
│   ├── pages/               # Home, explore, prompts, shortcuts, and admin pages
│   ├── styles/              # Global styles
│   └── middleware.ts        # Server-side protection for admin routes
├── astro.config.mjs         # Astro and Vercel configuration
├── package.json             # Dependencies and project scripts
└── README.md
```

## Database and security

PromptVault uses Supabase tables for prompts, shortcuts, categories, tags, their relationships, and admin membership. Public-facing collection pages retrieve published records from Supabase.

Row Level Security (RLS) is enabled on the public application tables. Public users can read published content and the relevant category/tag data. Administrative write operations are restricted to users registered in `admin_users`. The admin routes also perform server-side authentication and admin-membership checks.

Prompt thumbnails are stored in the `prompt-thumbnails` Supabase Storage bucket. The bucket allows public image reads; upload, update, and delete operations are restricted to administrators by Storage policies.

**Security notes:**

- Never commit `.env` files, passwords, access tokens, or Supabase service-role keys.
- The browser-facing Supabase URL and publishable key are configured as environment variables. A publishable key is intended for client use only when database and Storage access are protected by correctly configured RLS and policies.
- Do not expose a Supabase service-role key in browser code or public repository files.
- Keep admin access controlled through Supabase Auth and the `admin_users` table.

## Local development

### Requirements

- Node.js compatible with the project's `engines` setting (`>=22.23.4`). Node.js 24 is a suitable runtime for the Vercel deployment target.
- npm.
- A Supabase project with the PromptVault database schema, RLS policies, and Storage bucket configured.

### Setup

1. Clone the repository:

   ```bash
   git clone https://github.com/<your-github-username>/PromptVault.git
   cd PromptVault
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Create a local `.env` file in the project root and add the Supabase project values:

   ```env
   PUBLIC_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
   PUBLIC_SUPABASE_PUBLISHABLE_KEY=YOUR_SUPABASE_PUBLISHABLE_KEY
   ```

   Replace the example values with the URL and publishable key from your Supabase project. Do not add a service-role key here.

4. Start the development server:

   ```bash
   npm run dev
   ```

5. Open [http://localhost:4321](http://localhost:4321).

### Available commands

| Command | Description |
|---|---|
| `npm install` | Install project dependencies |
| `npm run dev` | Start the local development server |
| `npm run build` | Create a production build |
| `npm run preview` | Preview the production build locally |
| `npm run astro -- --help` | Display Astro CLI help |

## Deployment

The project is configured for deployment to [Vercel](https://vercel.com/) using the Astro Vercel adapter.

1. Push the project to a GitHub repository.
2. Import that repository into Vercel.
3. Set the following environment variables in the Vercel project settings for the environments being deployed:
   - `PUBLIC_SUPABASE_URL`
   - `PUBLIC_SUPABASE_PUBLISHABLE_KEY`
4. Deploy the project and check the build output and runtime logs.
5. Test the public pages, Supabase data access, authentication, admin routes, and thumbnail behavior on the deployed site.

Do not commit local environment files. Vercel environment variables should be configured in the Vercel dashboard.

## Skills and learning demonstrated

The following skills and concepts were practiced during this AI-assisted project. This list describes areas of hands-on exposure and contribution; it does not imply that every part was implemented independently or that each topic has been mastered:

- **Frontend development:** Astro components and pages, HTML, CSS, responsive layouts, Tailwind CSS, and client-side JavaScript.
- **JavaScript and TypeScript:** Browser interactions, application logic, event handling, and server middleware.
- **Backend integration:** Connecting a frontend application to Supabase services.
- **SQL and relational databases:** Tables, relationships, primary and foreign keys, unique constraints, and generated columns.
- **Authentication and authorization:** Supabase Auth, admin membership checks, server-side route protection, and session handling.
- **Database security:** Row Level Security policies and role-based access patterns.
- **File storage:** Supabase Storage, public image URLs, and administrator-only file operations.
- **Data processing:** CSV parsing, input validation, duplicate detection, and bulk database operations.
- **Browser storage:** Using `localStorage` for favourites, recent history, and preferences.
- **Version control:** Git, GitHub repository setup, staging, commits, and pushing changes.
- **Deployment concepts:** Production builds, environment variables, Astro's Vercel adapter, and deployment configuration.
- **Testing and debugging:** Checking authorization behavior, diagnosing build errors, and validating application features.
- **AI-assisted development:** Using ChatGPT to support planning, coding, debugging, review, and documentation while retaining human direction and responsibility.

## Project status

The application and its main features have been developed and tested locally. GitHub authentication has been established. Public GitHub repository creation and the Vercel production deployment are separate release steps and should only be marked complete once they have actually been performed and verified.

## Acknowledgement

PromptVault is a personally directed project developed with substantial assistance from AI tools, especially OpenAI ChatGPT. The owner contributed the project goals, feature requirements, design direction, service configuration, implementation decisions, and testing. This README intentionally describes the work as **AI-assisted**, not as work authored entirely by the owner or generated entirely by AI.

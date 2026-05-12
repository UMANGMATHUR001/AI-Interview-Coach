# AI Interview Practice Chat

A full-stack AI-powered interview practice platform where users conduct realistic mock interviews with Gemini AI, receive streaming responses, and get detailed performance analytics.

## Run & Operate

- `pnpm --filter @workspace/api-server run dev` — run the API server (port 5000)
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from the OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- Required env: `DATABASE_URL` — Postgres connection string

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- Frontend: React + Vite + TailwindCSS v4 + shadcn/ui + Framer Motion + Recharts
- API: Express 5
- DB: PostgreSQL + Drizzle ORM
- AI: Gemini 2.5 Flash via Replit AI Integrations (streaming SSE)
- Auth: Replit Auth (OIDC)
- Validation: Zod (`zod/v4`), `drizzle-zod`
- API codegen: Orval (from OpenAPI spec)
- Build: esbuild (CJS bundle)

## Where things live

- `lib/api-spec/openapi.yaml` — OpenAPI spec (source of truth for all routes)
- `lib/api-zod/src/generated/api.ts` — Zod schemas for route validation
- `lib/api-client-react/src/generated/api.ts` — React Query hooks for the frontend
- `lib/db/src/schema/` — Drizzle ORM table definitions
  - `auth.ts` — sessions + users (required for Replit Auth)
  - `conversations.ts` + `messages.ts` — Gemini conversation storage
  - `interviews.ts` — interview sessions
  - `interview-messages.ts` — per-interview chat history
- `artifacts/api-server/src/routes/` — Express route handlers
  - `auth.ts` — login/logout/user endpoints
  - `gemini/` — raw Gemini conversation endpoints
  - `interviews/` — interview CRUD + SSE message streaming + end
  - `analytics.ts` — user analytics + dashboard
- `artifacts/interview-app/src/pages/` — React pages
  - `landing.tsx` — unauthenticated landing page
  - `dashboard.tsx` — post-login overview with charts
  - `interviews.tsx` — sessions list
  - `interview-setup.tsx` — configure new interview
  - `interview-room.tsx` — live chat with streaming AI
  - `analytics.tsx` — performance breakdown

## Architecture decisions

- SSE streaming for AI responses: `POST /api/interviews/:id/message` sends `text/event-stream` chunks; the frontend reads with `fetch` + `ReadableStream` (not a generated hook).
- Each interview session creates a Gemini conversation in the `conversations` table. The system prompt is injected as the first message. Interview-specific messages are stored in `interview_messages` while the Gemini conversation history is mirrored in `messages`.
- On `POST /api/interviews/:id/end`, Gemini analyses the full transcript and returns JSON scores (confidence, technical, communication), weak topics, and improvement suggestions.
- Auth is handled entirely by Replit Auth (OIDC). The `useAuth()` hook from `@workspace/replit-auth-web` is the single source of truth for auth state in the frontend. Never use `useGetCurrentAuthUser` for auth state.
- Dark mode is forced globally by adding `.dark` to `document.documentElement` in `main.tsx`.

## Product

- Users sign in via Replit Auth
- Configure interview: choose role (Frontend, Backend, Full Stack, Data Scientist, DevOps, PM, HR), difficulty (Easy/Medium/Hard), and type (Technical Coding, System Design, Behavioral, JS, React, Python, DSA, Cloud)
- AI conducts a realistic interview with follow-up questions
- On end, Gemini analyses performance and gives scores + suggestions
- Dashboard and analytics pages show aggregate performance over time

## User preferences

- Dark, modern SaaS UI — always dark mode
- No emojis in UI
- Dense, information-rich layout

## Gotchas

- `@google/genai` must be a direct dependency of `api-server` (it's externalized by esbuild, so it needs to be in node_modules at runtime).
- Run `pnpm --filter @workspace/db run push` after any schema change.
- Run codegen after any `openapi.yaml` change.
- Never `pnpm run dev` at the workspace root.

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details

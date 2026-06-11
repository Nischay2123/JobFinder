# Job Finder

Job Finder is a TypeScript monorepo for building a full-stack job search application. It uses npm workspaces and Turborepo to coordinate a React client, an Express API, and shared internal packages.

## Features

- Monorepo managed with npm workspaces and Turbo task orchestration.
- React 19 client powered by Vite.
- Tailwind CSS 4 setup through the Vite Tailwind plugin.
- Redux Toolkit store with RTK Query prepared for API endpoints.
- React Router browser routing.
- Reusable UI foundation with a shared button component and utility helpers.
- Express 5 API server with JSON parsing, CORS, health check, environment loading, and centralized error handling.
- Shared TypeScript interfaces for `User` and `Job`.
- Shared Zod schemas for user and job validation.
- Shared Pino logger package for structured development and production logging.
- Shared ESLint and TypeScript configuration packages for consistent standards across apps and packages.

## Folder Structure

```text
.
├── apps
│   ├── api
│   │   ├── src
│   │   │   ├── app.ts
│   │   │   ├── server.ts
│   │   │   └── shared
│   │   │       ├── middleware
│   │   │       │   └── errorHandler.tš
│   │   │       └── utils
│   │   │           └── AppError.ts
│   │   ├── package.json
│   │   └── tsconfig.json
│   └── client
│       ├── src
│       │   ├── app
│       │   │   ├── providers
│       │   │   ├── router
│       │   │   └── store
│       │   ├── shared
│       │   │   ├── api
│       │   │   ├── components
│       │   │   └── lib
│       │   ├── index.css
│       │   └── main.tsx
│       ├── package.json
│       └── vite.config.ts
├── packages
│   ├── eslint-config
│   │   └── index.js
│   ├── logger
│   │   ├── src
│   │   │   └── index.ts
│   │   └── README.md
│   ├── shared-schemas
│   │   └── src
│   │       └── index.ts
│   ├── shared-types
│   │   └── src
│   │       ├── index.ts
│   │       ├── job.ts
│   │       └── user.ts
│   └── typescript-config
│       ├── base.json
│       ├── node-library.json
│       └── react-library.json
├── package.json
├── package-lock.json
├── turbo.json
└── README.md
```

## Workspace Overview

### `apps/client`

The frontend application.

- Framework: React, Vite, TypeScript.
- Routing: `react-router-dom`.
- State and data fetching: Redux Toolkit and RTK Query.
- Styling: Tailwind CSS.
- Path aliases:
  - `@app` -> `apps/client/src/app`
  - `@shared` -> `apps/client/src/shared`
  - `@features` -> `apps/client/src/features`
  - `@assets` -> `apps/client/src/assets`

Current entry points:

- `apps/client/src/main.tsx` mounts the React application.
- `apps/client/src/app/providers/index.tsx` registers app-wide providers.
- `apps/client/src/app/router/index.tsx` defines routes.
- `apps/client/src/app/store/index.ts` configures the Redux store.
- `apps/client/src/shared/api/baseApi.ts` contains the base RTK Query API setup.

### `apps/api`

The backend API application.

- Framework: Express 5.
- Runtime dev command: `tsx watch`.
- Environment loading: `dotenv`.
- Default port: `3001`.
- Health check endpoint: `GET /health`.
- Central error handling lives in `apps/api/src/shared/middleware/errorHandler.ts`.
- Custom application errors live in `apps/api/src/shared/utils/AppError.ts`.

### `packages/shared-types`

Internal package for shared TypeScript types.

Exports:

- `User`
- `Job`

Use it from any workspace package:

```ts
import type { Job, User } from '@job-finder/shared-types';
```

### `packages/shared-schemas`

Internal package for shared Zod validation schemas.

Exports:

- `userSchema`
- `jobSchema`

Use it from any workspace package:

```ts
import { jobSchema, userSchema } from '@job-finder/shared-schemas';
```

### `packages/logger`

Internal package for application logging.

- Uses Pino.
- Pretty development logs with `pino-pretty`.
- Structured JSON logs in production.
- Supports service-specific logger names.

See `packages/logger/README.md` for detailed usage.

### `packages/eslint-config`

Shared ESLint configuration used by workspaces.

It includes:

- ESLint recommended rules.
- TypeScript ESLint recommended rules.
- React and React Hooks rules.
- Prettier compatibility.

### `packages/typescript-config`

Shared TypeScript configuration presets.

- `base.json` for common strict TypeScript settings.
- `react-library.json` for browser and React projects.
- `node-library.json` for Node.js projects and packages.

## Prerequisites

- Node.js compatible with the dependencies in this repo.
- npm 10.5.0 or later. The root `package.json` declares `npm@10.5.0` as the package manager.

Check your versions:

```bash
node --version
npm --version
```

## Installation

Install all workspace dependencies from the repository root:

```bash
npm install
```

Do not install dependencies separately inside each app or package unless you have a specific reason. npm workspaces will link the internal packages automatically.

## Running the Monorepo

Run all development servers through Turbo:

```bash
npm run dev
```

This starts every workspace that has a `dev` script.

For the interactive Turbo terminal UI:

```bash
npm run dev:tui
```

By default:

- The API runs at `http://localhost:3001`.
- The client runs on Vite's default development URL, usually `http://localhost:5173`.

You can verify the API with:

```bash
curl http://localhost:3001/health
```

Expected response:

```json
{
  "status": "ok"
}
```

## Running Individual Apps

Run only the client:

```bash
npm run dev --workspace=client
```

Run only the API:

```bash
npm run dev --workspace=api
```

Build only the client:

```bash
npm run build --workspace=client
```

Build only the API:

```bash
npm run build --workspace=api
```

## Available Root Scripts

Run these from the repository root.

| Command | Description |
| --- | --- |
| `npm run dev` | Start all workspace development processes through Turbo. |
| `npm run dev:tui` | Start Turbo dev mode with the terminal UI. |
| `npm run build` | Build all workspaces that define a build script. |
| `npm run lint` | Run linting across workspaces that define a lint script. |
| `npm run typecheck` | Run TypeScript checks across workspaces that define a typecheck script. |

## Environment Variables

The API loads environment variables with `dotenv`.

Create an optional local API environment file:

```bash
touch apps/api/.env
```

Supported API variables:

```env
PORT=3001
NODE_ENV=development
LOG_LEVEL=debug
```

Notes:

- `PORT` controls the API server port.
- `NODE_ENV=production` makes the logger emit JSON logs.
- `LOG_LEVEL` overrides the logger default level.

## Development Workflow

1. Install dependencies with `npm install`.
2. Start the monorepo with `npm run dev`.
3. Open the client in the browser at the Vite dev URL.
4. Confirm the API is alive at `GET /health`.
5. Add frontend features under `apps/client/src`.
6. Add API routes and services under `apps/api/src`.
7. Put shared runtime validation in `packages/shared-schemas`.
8. Put shared TypeScript-only models in `packages/shared-types`.
9. Run `npm run lint`, `npm run typecheck`, and `npm run build` before opening a pull request.

## Adding Dependencies

Add an app-specific dependency:

```bash
npm install <package-name> --workspace=client
```

```bash
npm install <package-name> --workspace=api
```

Add a dependency to an internal package:

```bash
npm install <package-name> --workspace=@job-finder/shared-schemas
```

Add a root development dependency:

```bash
npm install <package-name> --save-dev
```

## Using Internal Packages

Internal packages are referenced with workspace versions such as:

```json
{
  "dependencies": {
    "@job-finder/shared-types": "*",
    "@job-finder/shared-schemas": "*"
  }
}
```

After adding an internal package dependency to an app or another package, run:

```bash
npm install
```

Then import it normally:

```ts
import type { Job } from '@job-finder/shared-types';
import { jobSchema } from '@job-finder/shared-schemas';
```

## Build and Quality Checks

Run all checks:

```bash
npm run lint
npm run typecheck
npm run build
```

Turbo will run each task only in workspaces that define that script.

## Production Preview

Build all workspaces:

```bash
npm run build
```

Preview the client build locally:

```bash
npm run preview --workspace=client
```

Run the built API after building:

```bash
node apps/api/dist/server.js
```

## Current API Surface

| Method | Path | Description |
| --- | --- | --- |
| `GET` | `/health` | Returns API health status. |

## Notes for Future Development

- Keep shared contracts in `packages/shared-types` and `packages/shared-schemas` so client and API stay aligned.
- Keep app-specific code inside the relevant app workspace.
- Prefer extending `baseApi` with injected RTK Query endpoints for frontend API calls.
- Add API route modules under `apps/api/src` and register them in `apps/api/src/app.ts`.
- Keep reusable frontend components under `apps/client/src/shared/components`.
- Use the shared logger package when API or background services need structured logs.

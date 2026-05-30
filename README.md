# Aura Monorepo

A full-stack monorepo boilerplate for building web applications. Provides a ready-to-use foundation with a REST API, Next.js web app, shared UI components, type-safe database access, and auto-generated API clients.

## Tech stack

- **Next.js** — web application (App Router)
- **Express.js** — REST API backend
- **Supabase** — database & authentication
- **Drizzle ORM** — type-safe database interactions
- **Zod** — shared schema validation (`@repo/contract`)
- **Orval + OpenAPI** — auto-generated React Query API client
- **i18next** — internationalization (`@repo/i18n`)
- **Turborepo + pnpm** — monorepo build orchestration

## Project structure

```
aura-monorepo/
├── apps/
│   ├── api/                        # REST API (Express.js)
│   │   └── src/
│   │       ├── modules/            # Feature modules
│   │       │   ├── auth/           # Auth module
│   │       │   │   ├── controllers/
│   │       │   │   ├── openapi/
│   │       │   │   ├── repository/
│   │       │   │   ├── routes/
│   │       │   │   ├── services/
│   │       │   │   └── utils/
│   │       │   └── users/          # Users module (same structure)
│   │       ├── middleware/         # Auth, validation, error handling
│   │       ├── openapi/            # OpenAPI spec generation
│   │       ├── repositories/       # Shared repository utilities
│   │       ├── routes/             # Top-level route registration
│   │       ├── services/           # Shared service utilities
│   │       ├── logger/             # Logger setup (pino)
│   │       ├── types/              # Shared API types
│   │       └── utils/              # Shared utilities
│   ├── web/                        # Next.js web app
│   │   └── app/                    # App Router pages
│   └── docs/                       # Next.js docs app
│       └── app/                    # App Router pages
│
└── packages/
    ├── contract/                   # Zod schemas + TS types (source of truth for DTOs)
    │   └── src/
    │       ├── auth/               # Auth schemas & types
    │       ├── users/              # Users schemas & types
    │       └── shared/             # Shared schemas & types
    ├── db-schema/                  # Drizzle table definitions
    │   └── src/
    │       └── schemas/            # Table schema files
    ├── db/                         # DB client + migrations (Drizzle ORM)
    ├── api-client/                 # Auto-generated React Query hooks (never edit manually)
    │   └── src/
    │       └── generated/          # Orval output — do not edit
    ├── ui/                         # Shared React component library
    ├── i18n/                       # Internationalization (i18next)
    ├── eslint-config/              # Shared ESLint configurations
    ├── typescript-config/          # Shared tsconfig.json presets
    └── scripts/                    # DB seed / cleanup scripts
```

## How to run

### Install dependencies:

```bash
pnpm install
```

### Start the development servers:

> In first terminal, start the API server:

```bash
pnpm --filter api dev
```

> In second terminal, start the web app:

```bash
pnpm --filter web dev
```

Or run everything at once:

```bash
pnpm dev
```

Happy coding! 🚀

## Cool scripts

### Database scripts

- `pnpm db:generate` - Generate Drizzle ORM types from the database schema
- `pnpm db:push` - Push schema changes to the database
- `pnpm db:migrate` - Run database migrations
- `pnpm db:studio` - Open Drizzle Studio to inspect the database

- `pnpm db:clean:users` - Clean up the users table
- `pnpm db:seed:users` - Seed the users table

### API client generation

- `pnpm api-client:generate` - Generate the API client using Orval based on the OpenAPI spec

> Make sure the API server is running before generating the client, and that all API routes are properly documented with OpenAPI annotations.

### Other

- `pnpm build` - Build all apps and packages
- `pnpm lint` - Lint all apps and packages
- `pnpm check-types` - Type-check all apps and packages
- `pnpm format` - Format all files with Prettier

## Dev Guide

The app is designed with a modular architecture, where each feature is organized into its own module. This allows for better separation of concerns and easier maintenance.

Development flow:

1. **Define DB Table**: Start by defining the database table for your feature in the `db-schema` package. This will include the table structure and any relationships.

2. **Define Contracts**: Next, define the API contracts (schemas & TS types) for your feature in the `contract` package using `drizzle-zod` helpers based on the DB schema. This will ensure type safety across the stack.

3. **Implement API Logic**: Then, implement the API logic for your feature using `contracts` as "`inputs`" and "`outputs`" for the feature, in the `api` package. This will include creating the necessary `routes`, `services`, and `repositories` to handle the business logic and data access.

4. **Generate API Client**: Based on the `api` implementation and `openapi` specification, generate `api-client` hooks (TanStack Query hooks) by running the `generate:api` script. This will create type-safe API client hooks for use in the frontend.

5. **Use in Frontend**: Develop the frontend using the generated API client hooks. General UI components go in the `ui` package; page-level composition lives in the respective `web` or `docs` app.

### TLDR

1. Define DB table in `db-schema`
2. Define API contracts in `contract` using `drizzle-zod`
3. Implement API logic in `api` using the contracts
4. Generate API client with `generate:api`
5. Use generated API client hooks in the frontend (`web` + `ui`)

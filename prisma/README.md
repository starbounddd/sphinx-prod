# Prisma Database Setup Guide

## What is Prisma?

Prisma is a modern database toolkit that provides:

- **Type-safe database access** with auto-generated TypeScript types
- **Schema management** through declarative schema files
- **Database migrations** to evolve your database schema safely
- **Introspection** to generate schemas from existing databases
- **Prisma Studio** - a GUI for viewing and editing data

In this survey application, Prisma manages all database operations for users, surveys, questions, answers, and responses using PostgreSQL.

## Project Structure

- `schema.prisma` - Database schema definition with models and relationships
- `migrations/` - Database migration files for schema changes
- `seed.ts` - Script to populate the database with initial/test data

## Prerequisites

- Node.js and npm installed
- PostgreSQL database server running
- `.env` file with `DATABASE_URL` configured
- **Node.js binaries in PATH** (run `npx --version` to verify)

## Database Schema

The schema defines the following models:

- **User** - Application users with authentication
- **Survey** - Survey definitions created by users
- **Question** - Questions within surveys
- **Answer** - Possible answers for questions
- **Response** - User responses to surveys
- **AnswerResponse** - Individual answer selections in responses
- **SafetyEvent** - Security and safety monitoring events

## Commands

### Generate Prisma Client

After any schema changes, generate the type-safe client:

```bash
npx prisma generate
```

### Create and Apply Migrations

When you modify `schema.prisma`, create a migration:

```bash
npx prisma migrate dev --name your_migration_name
```

This will:

- Create a new migration file in `migrations/`
- Apply it to your database
- Regenerate the Prisma client

### View Database in GUI

Open Prisma Studio to browse and edit data:

```bash
npx prisma studio
```

This opens a web interface at `http://localhost:5555`

### Seed the Database

Populate with test data:

```bash
npx prisma db seed
```

**Note:** If you get a "Unique constraint failed" error, the seed data already exists. To reseed:

```bash
npx prisma migrate reset  # This will reset the database
npx prisma db seed
```

Or run the seed script directly:

```bash
./node_modules/.bin/tsx prisma/seed.ts
```

### Database Introspection

If you have an existing database, generate schema from it:

```bash
npx prisma db pull
```

### Reset Database

Drop all data and reapply migrations:

```bash
npx prisma migrate reset
```

## Environment Configuration

Create a `.env` file in the project root:

```env
DATABASE_URL="postgresql://username:password@localhost:5432/database_name"
```

## Usage in Code

Import and use the Prisma client:

```typescript
import { prisma } from '@/lib/db/prisma';

const users = await prisma.user.findMany();
const survey = await prisma.survey.create({
  data: {
    title: 'My Survey',
    authorId: userId,
  },
});
```

## Best Practices

- Always run migrations in development before pushing changes
- Use descriptive migration names
- Test migrations on a copy of production data
- Keep seed data realistic for testing
- Use Prisma Studio for debugging data issues

## Troubleshooting

- **"npx: command not found"** - Ensure Node.js is installed and in your PATH. Try restarting your terminal or run: `$env:PATH += ";C:\Program Files\nodejs"` (PowerShell)
- **"tsx must be loaded with --import"** - Update Node.js or use the direct command: `./node_modules/.bin/tsx prisma/seed.ts`
- **"Unique constraint failed"** - Seed data already exists. Reset database with `npx prisma migrate reset` then seed again
- **"Environment variable not found"** - Ensure `.env` exists and `DATABASE_URL` is set
- **"Table does not exist"** - Run `npx prisma migrate dev`
- **Connection errors** - Check PostgreSQL is running and credentials are correct
- **Type errors** - Run `npx prisma generate` after schema changes

For more information, visit the [Prisma documentation](https://www.prisma.io/docs).

# Fanclub Backend

Backend API for the Møller Fanclub website built with TypeScript, Express, and Node.js.

## Setup

1. Install dependencies:
```bash
cd backend
npm install
```

2. Create a `.env` file in the backend directory:
```
PORT=3001
DATABASE_URL=postgresql://user:password@localhost:5432/fanclub_db
```

3. Generate Prisma Client:
```bash
npm run db:generate
```

This runs `prisma generate` to generate the TypeScript types based on the `prisma/schema.prisma` file.

4. Development mode (with hot reload):
```bash
npm run dev
```

5. Build for production:
```bash
npm run build
npm start
```

The server will run on `http://localhost:3001`

## API Endpoints

- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get a single product by ID
- `GET /api/health` - Health check endpoint

## Database Management with Prisma

The backend uses [Prisma](https://www.prisma.io/) as an ORM to manage the PostgreSQL database for orders, payments, and user data.

### Prisma Commands

**Generate Prisma Client:**
```bash
npm run db:generate
```
This generates the Prisma Client and TypeScript types based on the schema defined in `prisma/schema.prisma`. Run this command after modifying the schema or after a fresh installation.

**Run Database Migrations:**
```bash
npm run db:migrate
```
This deploys pending migrations to the database. Use this in production to update the database structure.

**Open Prisma Studio:**
```bash
npm run db:studio
```
This opens Prisma Studio at [http://localhost:5555](http://localhost:5555), a visual database browser where you can view and edit data.

**Direct Prisma CLI Access:**

You can also use Prisma CLI commands directly with `npx`:
```bash
npx prisma generate          # Generate Prisma Client
npx prisma migrate dev       # Create and apply migrations in development
npx prisma migrate deploy    # Apply migrations in production
npx prisma studio            # Open Prisma Studio
npx prisma db push           # Push schema changes to database (dev only)
npx prisma db pull           # Pull database schema to Prisma schema
```

For more information, see the [Prisma documentation](https://www.prisma.io/docs).

## Tech Stack

- **TypeScript** - Type-safe JavaScript
- **Express** - Web framework
- **Prisma** - Database ORM
- **PostgreSQL** - Database
- **CORS** - Cross-origin resource sharing
- **dotenv** - Environment variable management
- **tsx** - TypeScript execution for development

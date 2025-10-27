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
```

3. Development mode (with hot reload):
```bash
npm run dev
```

4. Build for production:
```bash
npm run build
npm start
```

The server will run on `http://localhost:3001`

## API Endpoints

- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get a single product by ID
- `GET /api/health` - Health check endpoint

## Tech Stack

- **TypeScript** - Type-safe JavaScript
- **Express** - Web framework
- **CORS** - Cross-origin resource sharing
- **dotenv** - Environment variable management
- **tsx** - TypeScript execution for development

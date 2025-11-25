# BlueOx Notes Backend

Express + PostgreSQL backend for BlueOx Notes with authentication and cloud sync.

## Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Set up PostgreSQL

Install PostgreSQL if you haven't:
```bash
# macOS
brew install postgresql

# Ubuntu/Debian
sudo apt-get install postgresql postgresql-contrib
```

Create database:
```bash
createdb blueox
```

### 3. Configure Environment

Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

Edit `.env` with your settings:
```env
DATABASE_URL=postgresql://your_user:your_password@localhost:5432/blueox
JWT_SECRET=your-very-secret-key-change-this
PORT=3001
CORS_ORIGIN=http://localhost:5173
```

### 4. Initialize Database

Run the schema:
```bash
npm run db:init
```

Or manually:
```bash
psql blueox < src/schema.sql
```

### 5. Start Development Server

```bash
npm run dev
```

Server will run on `http://localhost:3001`

## API Endpoints

### Authentication

**POST `/api/auth/register`**
```json
{
  "email": "user@example.com",
  "password": "password123",
  "username": "optional"
}
```

**POST `/api/auth/login`**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

### Notes (Requires Auth Token)

**GET `/api/notes`** - Get all notes

**GET `/api/notes/:id`** - Get single note

**POST `/api/notes`** - Create note
```json
{
  "title": "My Note",
  "content": "# Markdown content",
  "folder": "root",
  "tags": ["tag1", "tag2"]
}
```

**PUT `/api/notes/:id`** - Update note

**DELETE `/api/notes/:id`** - Delete note (soft delete)

**GET `/api/notes/sync/since/:timestamp`** - Get notes updated since timestamp

### Config (Requires Auth Token)

**GET `/api/config`** - Get user config

**PUT `/api/config`** - Update user config

## Authentication

Include JWT token in Authorization header:
```
Authorization: Bearer YOUR_TOKEN_HERE
```

## Deployment on Scaleway

### Option 1: Scaleway Container

1. Build Docker image:
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3001
CMD ["npm", "start"]
```

2. Deploy to Scaleway Container Registry

### Option 2: Scaleway Database + Elastic Metal

1. Create Managed PostgreSQL database on Scaleway
2. Deploy app to Elastic Metal or Instances
3. Set environment variables
4. Run migrations

## Environment Variables

- `DATABASE_URL` - PostgreSQL connection string
- `JWT_SECRET` - Secret for JWT signing
- `JWT_EXPIRES_IN` - Token expiration (default: 7d)
- `PORT` - Server port (default: 3001)
- `NODE_ENV` - Environment (development/production)
- `CORS_ORIGIN` - Allowed CORS origin

## Security Notes

- Change `JWT_SECRET` in production
- Use HTTPS in production
- Enable rate limiting
- Add input validation
- Use environment variables for sensitive data
- Never commit `.env` to git

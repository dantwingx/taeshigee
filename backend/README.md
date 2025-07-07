# Taeshigee Backend

This is the backend API for the Taeshigee task management application, built with Next.js, Supabase (PostgreSQL), and JWT authentication.

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Database**: Supabase (PostgreSQL)
- **Authentication**: JWT (JSON Web Tokens)
- **Testing**: Jest + Supertest
- **Language**: TypeScript

## Getting Started

### Prerequisites

1. Node.js 18+ installed
2. Supabase project created
3. Environment variables configured

### Environment Variables

Create a `.env.local` file in the backend directory with the following variables:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://ztlmeqrmnvabiakztlry.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp0bG1lcXJtbnZhYmlha3p0bHJ5Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MTE3ODI5NywiZXhwIjoyMDY2NzU0Mjk3fQ.FwFEH50EQxROyCmpSdJFonNgOPCL4VyA28oT0SDWcJI

# JWT Configuration
JWT_SECRET=Dk4iPoBDGZmIu2PrFx019e5obk7S8IcE5ft+V2m4Br5jogfIkEvTA5M/3EQvDgLiPBkw/U5qHcBENifbb2kLnA==
```

### Installation

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Run tests
npm test

# Run tests with coverage
npm run test:coverage
```

The API will be available at `http://localhost:3000/api/`

## API Endpoints

### Authentication

#### POST `/api/auth/register`
Register a new user.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "token": "jwt_token_here",
  "user": {
    "id": "user",
    "userNumber": 1,
    "email": "user@example.com",
    "name": "RandomName123",
    "language": "en",
    "darkMode": false,
    "createdAt": "2024-01-01T00:00:00Z",
    "lastUpdated": "2024-01-01T00:00:00Z"
  }
}
```

**ID Generation Rules:**
- Default: Email prefix (e.g., `user@example.com` → `user`)
- Duplicate: Base ID + random number (e.g., `user_1234`)
- Max attempts exceeded: Base ID + timestamp

#### POST `/api/auth/login`
Login with existing credentials.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "token": "jwt_token_here",
  "user": {
    "id": "user",
    "userNumber": 1,
    "email": "user@example.com",
    "name": "RandomName123",
    "language": "en",
    "darkMode": false,
    "createdAt": "2024-01-01T00:00:00Z",
    "lastUpdated": "2024-01-01T00:00:00Z"
  }
}
```

#### GET `/api/auth/me`
Get current user information.

**Headers:**
```
Authorization: Bearer jwt_token_here
```

**Response:**
```json
{
  "success": true,
  "user": {
    "id": "user",
    "userNumber": 1,
    "email": "user@example.com",
    "name": "RandomName123",
    "createdAt": "2024-01-01T00:00:00Z",
    "lastUpdated": "2024-01-01T00:00:00Z"
  }
}
```

### User Settings

#### GET `/api/user/settings`
Get user settings.

**Headers:**
```
Authorization: Bearer jwt_token_here
```

**Response:**
```json
{
  "success": true,
  "settings": {
    "language": "en",
    "darkMode": false
  }
}
```

#### PUT `/api/user/settings`
Update user settings.

**Headers:**
```
Authorization: Bearer jwt_token_here
```

**Request Body:**
```json
{
  "language": "ko",
  "darkMode": true
}
```

### Tasks

#### GET `/api/tasks`
Get user's tasks with optional search and filter.

**Headers:**
```
Authorization: Bearer jwt_token_here
```

**Query Parameters:**
- `search`: Search in title and description
- `filter`: `all`, `important`, `urgent`

**Response:**
```json
{
  "success": true,
  "tasks": [
    {
      "id": "task_id",
      "title": "Task Title",
      "description": "Task description",
      "dueDate": "2024-01-01",
      "dueTime": "14:30",
      "importance": "high",
      "priority": "medium",
      "category": "work",
      "isCompleted": false,
      "isPublic": false,
      "likesCount": 0,
      "tags": ["tag1", "tag2"],
      "author": "User Name",
      "userNumber": 1,
      "createdAt": "2024-01-01T00:00:00Z",
      "updatedAt": "2024-01-01T00:00:00Z"
    }
  ]
}
```

#### POST `/api/tasks`
Create a new task.

**Headers:**
```
Authorization: Bearer jwt_token_here
```

**Request Body:**
```json
{
  "title": "New Task",
  "description": "Task description",
  "dueDate": "2024-01-01",
  "dueTime": "14:30",
  "importance": "high",
  "priority": "medium",
  "category": "work",
  "isPublic": false,
  "tags": ["tag1", "tag2"]
}
```

#### GET `/api/tasks/[id]`
Get a specific task.

#### PUT `/api/tasks/[id]`
Update a task.

#### DELETE `/api/tasks/[id]`
Delete a task.

#### POST `/api/tasks/[id]/like`
Toggle task like/unlike.

#### POST `/api/tasks/[id]/duplicate`
Duplicate a task.

### Public Tasks

#### GET `/api/public-tasks`
Get all public tasks from all users.

**Query Parameters:**
- `search`: Search in title and description
- `filter`: `all`, `important`, `urgent`

### Tags

#### GET `/api/tags`
Get all unique tags with usage counts.

**Response:**
```json
{
  "success": true,
  "tags": [
    {
      "name": "tag1",
      "count": 5
    },
    {
      "name": "tag2",
      "count": 3
    }
  ]
}
```

### Statistics

#### GET `/api/stats`
Get user and system statistics.

**Headers:**
```
Authorization: Bearer jwt_token_here
```

**Response:**
```json
{
  "success": true,
  "userStats": {
    "totalTasks": 10,
    "importantTasks": 3,
    "urgentTasks": 2,
    "publicTasks": 5,
    "privateTasks": 5,
    "totalLikes": 8
  },
  "systemStats": {
    "totalTasks": 100,
    "publicTasks": 25,
    "totalLikes": 150
  }
}
```

## Database Schema

### Tables

#### users
- `id` (VARCHAR(100), Primary Key) - Email-based ID
- `user_number` (SERIAL, Unique) - Auto-incrementing user number
- `email` (VARCHAR(255), Unique)
- `name` (VARCHAR(100))
- `language` (VARCHAR(10), Default: 'en')
- `dark_mode` (BOOLEAN, Default: false)
- `created_at` (TIMESTAMP)
- `updated_at` (TIMESTAMP)

#### tasks
- `id` (UUID, Primary Key)
- `user_id` (VARCHAR(100), Foreign Key to users.id)
- `user_number` (INTEGER, Foreign Key to users.user_number)
- `title` (VARCHAR(255))
- `description` (TEXT, Nullable)
- `due_date` (DATE, Nullable)
- `due_time` (TIME, Nullable)
- `importance` (ENUM: 'low', 'medium', 'high')
- `priority` (ENUM: 'low', 'medium', 'high')
- `category` (VARCHAR(100), Nullable)
- `is_completed` (BOOLEAN, Default: false)
- `is_public` (BOOLEAN, Default: false)
- `likes_count` (INTEGER, Default: 0)
- `created_at` (TIMESTAMP)
- `updated_at` (TIMESTAMP)

#### task_tags
- `id` (UUID, Primary Key)
- `task_id` (UUID, Foreign Key to tasks.id)
- `tag_name` (VARCHAR(100))
- `created_at` (TIMESTAMP)

#### task_likes
- `id` (UUID, Primary Key)
- `task_id` (UUID, Foreign Key to tasks.id)
- `user_id` (VARCHAR(100), Foreign Key to users.id)
- `user_number` (INTEGER, Foreign Key to users.user_number)
- `created_at` (TIMESTAMP)

## Email-Based ID System

The application uses an email-based ID system where:

1. **Default ID**: Email prefix (before @)
   - `user@example.com` → `user`
   - `john.doe@company.com` → `john.doe`

2. **Duplicate Handling**: 
   - If ID exists: `user_1234` (base + random 4-digit number)
   - Max attempts exceeded: `user_1703123456789` (base + timestamp)

3. **Benefits**:
   - User-friendly and memorable IDs
   - Consistent with email addresses
   - Automatic duplicate resolution

4. **Considerations**:
   - IDs may contain sensitive information
   - Email changes require ID updates
   - Special characters in emails handled appropriately

## Testing

The project includes comprehensive tests using Jest and Supertest.

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage report
npm run test:coverage
```

## Development

### Project Structure

```
src/
├── app/
│   ├── api/                    # API routes
│   │   ├── auth/              # Authentication endpoints
│   │   ├── user/              # User settings endpoints
│   │   ├── tasks/             # Task CRUD endpoints
│   │   ├── public-tasks/      # Public tasks endpoint
│   │   ├── tags/              # Tags endpoint
│   │   └── stats/             # Statistics endpoint
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── lib/                       # Utility libraries
│   ├── auth.ts               # Authentication utilities
│   ├── jwt.ts                # JWT utilities
│   └── supabase.ts           # Supabase client
└── types/                    # TypeScript type definitions
```

### Adding New Endpoints

1. Create a new route file in `src/app/api/`
2. Export HTTP method handlers (GET, POST, PUT, DELETE)
3. Use authentication middleware for protected routes
4. Add proper error handling and validation
5. Write tests for the new endpoint

### Error Handling

All API endpoints return consistent error responses:

```json
{
  "success": false,
  "error": "Error message"
}
```

HTTP status codes:
- `200`: Success
- `400`: Bad Request (validation errors)
- `401`: Unauthorized (authentication required)
- `404`: Not Found
- `500`: Internal Server Error

## Deployment

### Vercel (Recommended)

1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Other Platforms

The backend can be deployed to any platform that supports Next.js:
- Netlify
- Railway
- DigitalOcean App Platform
- AWS Amplify

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Ensure all tests pass
6. Submit a pull request

## License

This project is licensed under the MIT License.

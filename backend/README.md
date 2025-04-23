
# Co-Brew Backend API

This is the MongoDB-based backend for the Co-Brew application.

## Setup Instructions

1. Clone the repository
2. Copy `.env.example` to `.env` and fill in your MongoDB connection string and JWT secret
3. Install dependencies:
   ```
   npm install
   ```
4. Start the server:
   ```
   npm run dev
   ```

## Environment Variables

- `MONGODB_URI`: Your MongoDB connection string
- `JWT_SECRET`: Secret key for JWT token generation
- `PORT`: Port for the server to run on (defaults to 5000)
- `CLIENT_URL`: URL of the frontend client for CORS

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user
- `POST /api/auth/logout` - Logout user

### Projects
- `GET /api/projects` - Get all projects
- `POST /api/projects` - Create a new project
- `GET /api/projects/:id` - Get a project by ID
- `PUT /api/projects/:id` - Update a project
- `DELETE /api/projects/:id` - Delete a project

### Applications
- `POST /api/applications` - Submit a project application
- `GET /api/applications` - Get all applications for user
- `GET /api/applications/:id` - Get application by ID
- `PUT /api/applications/:id/status` - Update application status

### Profiles
- `GET /api/profiles/me` - Get current user's profile
- `GET /api/profiles/:userId` - Get user profile by ID
- `PUT /api/profiles` - Update user profile

### Messages
- `GET /api/messages/:projectId` - Get messages for a project
- `POST /api/messages/:projectId` - Send a message in a project

## Database Schema

### User
- `_id`: ObjectId
- `email`: String
- `password`: String (hashed)
- `provider`: String
- `avatarUrl`: String
- `createdAt`: Date
- `updatedAt`: Date

### Profile
- `_id`: ObjectId
- `userId`: ObjectId (ref: User)
- `firstName`: String
- `lastName`: String
- `title`: String
- `bio`: String
- `location`: String
- `education`: String
- `experience`: String
- `skills`: [String]
- `industry`: String
- `githubUrl`: String
- `linkedinUrl`: String
- `createdAt`: Date
- `updatedAt`: Date

### Project
- `_id`: ObjectId
- `title`: String
- `description`: String
- `stage`: String
- `category`: String
- `rolesNeeded`: [String]
- `tags`: [String]
- `creatorId`: ObjectId (ref: User)
- `premiumFeatures`: Boolean
- `createdAt`: Date
- `updatedAt`: Date

### ProjectApplication
- `_id`: ObjectId
- `projectId`: ObjectId (ref: Project)
- `applicantId`: ObjectId (ref: User)
- `introduction`: String
- `experience`: String
- `motivation`: String
- `status`: String
- `createdAt`: Date
- `updatedAt`: Date

### Message
- `_id`: ObjectId
- `projectId`: ObjectId (ref: Project)
- `senderId`: ObjectId (ref: User)
- `content`: String
- `createdAt`: Date


# Co-Brew Project Hub

A platform for student entrepreneurs to collaborate on startup projects.

## Overview

Co-Brew is a web application that helps student entrepreneurs find collaborators for their startup projects. The platform allows users to:

- Create and showcase startup projects
- Browse projects by category, stage, and skills needed
- Apply to join projects they're interested in
- Manage applications and team building
- Message potential collaborators

## Tech Stack

### Frontend
- React with TypeScript
- React Router for navigation
- TanStack Query for data fetching
- Tailwind CSS for styling
- Shadcn UI for component library

### Backend
- Node.js with Express
- MongoDB for database
- JWT for authentication

## Setup Instructions

### Prerequisites
- Node.js (v14 or later)
- MongoDB database (MongoDB Atlas recommended)

### Frontend Setup
1. Clone this repository
2. Navigate to the project directory
3. Copy `.env.example` to `.env` and update the API URL
4. Install dependencies:
   ```
   npm install
   ```
5. Start the development server:
   ```
   npm run dev
   ```

### Backend Setup
1. Navigate to the `backend` directory
2. Copy `.env.example` to `.env` and fill in:
   - `MONGODB_URI`: Your MongoDB connection string
   - `JWT_SECRET`: A secret string for JWT token generation
   - `CLIENT_URL`: The URL of your frontend app
3. Install dependencies:
   ```
   npm install
   ```
4. Start the backend server:
   ```
   npm run dev
   ```

## Deployment

### Frontend Deployment
1. Build the frontend:
   ```
   npm run build
   ```
2. Deploy the content of the `dist` folder to your hosting provider

### Backend Deployment
1. Ensure environment variables are set in your hosting environment
2. Deploy the backend code to your hosting provider
3. Set up MongoDB connection

## Important Notes for Backend Developers

When connecting the application to MongoDB:

1. Ensure you've set up the proper MongoDB connection string in the `.env` file
2. The backend is structured using the MVC pattern:
   - `models/` - MongoDB schemas and models
   - `routes/` - API route handlers
   - `middleware/` - Authentication and other middleware
3. Authentication uses JWT tokens stored in localStorage
4. The MongoDB schemas are designed to match the existing application structure

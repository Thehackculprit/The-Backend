# Hack Culprit Backend

A Node.js/Express backend API for user authentication and management.

## Features

- User registration and login with JWT authentication
- Password hashing with bcryptjs
- Input validation with express-validator
- MongoDB database integration
- CORS enabled for frontend integration

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (local installation or MongoDB Atlas)
- MongoDB Compass (for database management)

## Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Create environment variables:**
   Create a `.env` file in the root directory with:
   ```
   PORT=3000
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
   MONGODB_URI=mongodb://localhost:27017/HackCulprit_website
   NODE_ENV=development
   ```

3. **Start MongoDB:**
   Make sure MongoDB is running on your local machine or use MongoDB Atlas.

4. **Run the server:**
   ```bash
   # Development mode (with auto-restart)
   npm run dev
   
   # Production mode
   npm start
   ```

## API Endpoints

### Health Check
- `GET /api/health` - Check if server is running

### Authentication
- `POST /api/register` - Register a new user
- `POST /api/login` - Login user
- `GET /api/profile` - Get user profile (requires JWT token)

## Database Connection

The application connects to MongoDB at `mongodb://localhost:27017/HackCulprit_website`.

To connect with MongoDB Compass, use the connection string:
```
mongodb://localhost:27017/HackCulprit_website
```

## User Schema

```javascript
{
  name: String (required),
  email: String (required, unique),
  password: String (required, min 6 chars),
  phone: String (optional),
  college: String (optional),
  role: String (optional),
  createdAt: Date (auto-generated)
}
```

## Security Features

- Password hashing with bcryptjs (12 salt rounds)
- JWT token authentication
- Input validation and sanitization
- CORS protection
- Environment variable configuration

## Error Handling

The API returns consistent error responses:
```json
{
  "success": false,
  "message": "Error description",
  "errors": [] // for validation errors
}
```

## Development

- Use `npm run dev` for development with auto-restart
- Check `/api/health` endpoint to verify server status
- Monitor console logs for connection status and errors 
# MathonGo Backend Task

A RESTful API backend built using **Node.js**, **Express**, **MongoDB**, and **Redis** for caching and rate limiting.

## Features

-  **Filterable & paginated chapter retrieval**
-  **Admin-only chapter upload** with proper input validation
-  **Redis caching** for efficient chapter retrieval
-  **Rate limiting**: 30 requests per minute per IP using Redis

## API Endpoints

- `GET /api/v1/chapters`  
  Retrieve a list of chapters with support for filtering and pagination.

- `GET /api/v1/chapters/:id`  
  Get a specific chapter by its ID.
  Note: On the frontend, you can apply filters using the /api/v1/chapters endpoint to get a list of relevant chapters. Each item in the response includes its unique MongoDB _id, which you can use to fetch full details of a specific chapter using the /api/v1/chapters/:id endpoint.

- `POST /api/v1/chapters` *(Admin only)*  
  - Upload a new chapter with validation.
  - please make sure to add in req.headers
    - admin = true 
    - Content-Type = application/json

## 🛠️ Setup Instructions

1. **Install dependencies**  
   
   npm install

2. **Want to run in Local System** 
   .env should inlcude
     MONGODB_URL
     REDISCLOUD_URL

3. **start command**
    npm run dev 

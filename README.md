# Travel Buddy Matching Application Backend

## Overview

The Travel Buddy Matching Backend is the server-side component of a web application that facilitates the organization of trips and helps users find potential travel buddies for their trips. This backend provides RESTful API endpoints for user registration, authentication, trip management, travel buddy requests, and user profile management.

## Live URL

You can access the live version of the backend application at [here](#)..

## Features

- User registration and authentication using JWT.
- Creation and management of trips, including destination, dates, budget, and planned activities.
- Sending and receiving travel buddy requests.
- Viewing potential travel buddies for a specific trip.
- Updating user profiles.

## Technology Stack

The backend of the Travel Buddy Matching Application is built using the following technologies:

- Programming Language: TypeScript
- Web Framework: Express.js
- Object Relational Mapping (ORM): Prisma with PostgreSQL
- Authentication: JWT (JSON Web Tokens)

## Setup Instructions

1. Clone the repository to your local machine : `git clone https://github.com/Apollo-Level2-Web-Dev/L2-B2-Assignment-8-Full-stack.git`
2. Go to the project directory: `cd L2-B2-Assignment-8-Full-stack.`
3. Install dependencies using `npm install`.
4. Add a .env file in the root directory

```TS
DATABASE_URL=
PORT=6000
NODE_ENV=development
BCRYPT_SALT_ROUNDS=
JWT_ACCESS_SECRET=
JWT_REFRESH_SECRET=
JWT_ACCESS_TOKEN_EXPIRES_IN=
JWT_REFRESH_TOKEN_EXPIRES_IN=
```

5. Set up a PostgreSQL database and configure the connection in the Prisma schema.
6. Run database migrations using `npx prisma migrate dev`.
7. Start the server using `npm run dev`.
8. Access the application in your browser at `http://localhost:6000`.

## API Endpoints

### User Registration

Register a new user with the provided name, email, and password. Returns the registered user details without the password.

- Endpoint: POST /api/register
- Request Body:

```TS
{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password",
    "profile": {
        "bio": "Passionate about helping people find their lost items.",
        "age": 30
		}
}
```

### User Login

Authenticate a user with the provided email and password. Returns a JWT token for further authentication.

- Endpoint: POST /api/login
- Request Body:

```TS
{
    "email": "john@example.com",
    "password": "password"
}
```

### Create a Trip

Create a new trip with the provided destination, start date, end date, budget, and activities.

- Endpoint: POST /api/trips
- Request Headers:
  - Authorization: <JWT_TOKEN>
- Request Body:

```TS
{
    "destination": "Paris, France",
    "startDate": "2024-06-01",
    "endDate": "2024-06-07",
    "budget": 1500,
    "activities": ["Eiffel Tower visit", "Louvre Museum tour"],
}
```

### Get Paginated and Filtered Trips

Retrieve paginated and filtered trips based on query parameters such as destination, start date, end date, maxBudget, minBudget etc.

- Endpoint: GET /api/trips

### Send Travel Buddy Request

Send a travel buddy request for a specific trip with the ID `:tripId`.

- Endpoint: POST /api/trip/:tripId/request
- Request Headers:
  - Authorization: <JWT_TOKEN>
- Request Body:

```TS
{
    "userId": "b9964127-2924-42bb-9970-60f93c016xyz"
}
```

### Get Potential Travel Buddies For a Specific Trip

Retrieve potential travel buddies for a specific trip with the ID `:tripId`.

- Endpoint: GET /api/travel-buddies/:tripId
- Request Headers:
  - Authorization: <JWT_TOKEN>

### Respond to Travel Buddy Request

Respond to a travel buddy request with the ID `:buddyId`, updating the status of the request.

- Endpoint: PUT /api/travel-buddies/:buddyId/respond
- Request Headers:
  - Authorization: <JWT_TOKEN>
- Request Body:

```TS
{
    "tripId": "b9964127-2924-42bb-9970-60f93c016ghi",
    "status": "APPROVED"
}
```

### Get User Profile

Retrieve the user's profile information.

- Endpoint: GET /api/profile
- Request Headers:
  - Authorization: <JWT_TOKEN>

### Update User Profile

Update the user's profile information with the provided name and email.

- Endpoint: PUT /api/profile
- Request Headers:
  - Authorization: <JWT_TOKEN>
- Request Body:

```TS
{
    "name": "John Cena",
    "email": "john.doe@example.com"
}
```

## Error Handling

The application implements proper error handling throughout the API endpoints, providing appropriate error responses with status codes and error messages.

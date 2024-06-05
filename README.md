# Travel Buddy Matching Application Backend

## Overview

The Travel Buddy Matching Backend is the server-side component of a web application that facilitates the organization of trips and helps users find potential travel buddies for their trips. This backend provides RESTful API endpoints for user registration, authentication, trip management, travel buddy requests, and user profile management.

## Live URL

You can access the live version of the backend application at [here]()..

## Features

- User registration and authentication using JWT.
- Creation and management of trips, including destination, dates, budget, and planned activities.
- Sending and receiving travel buddy requests.
- Viewing potential travel buddies for a specific trip.
- Updating user profiles.

## Technology Stack

The backend of the Travel Buddy Matching Application is built using the following technologies:

- **Programming Language:** `TypeScript`
- **Web Framework:** `Express.js`
- **Object Relational Mapping (ORM):** `Prisma with PostgreSQL`
- **Authentication:** `JWT (JSON Web Tokens)`

## Setup Instructions

1. Clone the repository to your local machine : `https://github.com/Sakhawat0pu/trip_buddy_server.git`
2. Go to the project directory: `cd trip_buddy_server`
3. Install dependencies using `npm install`.
4. Add a .env file in the root directory with following environment variables

```TS
DATABASE_URL=
PORT=4000
NODE_ENV=development
BCRYPT_SALT_ROUNDS=
JWT_ACCESS_SECRET=
JWT_REFRESH_SECRET=
JWT_ACCESS_TOKEN_EXPIRES_IN=
JWT_REFRESH_TOKEN_EXPIRES_IN=
RESET_PASSWORD_TOKEN_EXPIRES_IN=10m
FRONTEND_BASE_URI=
EMAIL_ADDRESS=
APP_PASS=
SUPER_ADMIN_PASSWORD=
SUPER_ADMIN_EMAIL_ADDRESS==
SUPER_ADMIN_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
```

5. Set up a PostgreSQL database and configure the connection in the Prisma schema.
6. Run database migrations using `npx prisma migrate dev`.
7. Start the server using `npm run dev`.
8. Access the application in your browser at `http://localhost:4000`.

## API Endpoints

### User Registration

Register a new user with the provided name, email, and password. Returns the registered user details without the password.

- **Endpoint:** `POST /api/register`
- **Request Body:**

```json
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

- **Endpoint:** `POST /api/auth/login`
- **Request Body:**

```json
{
	"email": "john@example.com",
	"password": "password"
}
```

### Create a Trip

Create a new trip with the provided destination, start date, end date, budget, activities, and photos.

- **Endpoint**: `POST /api/trips`
- **Request Headers**:
  - `Authorization`: `<JWT_TOKEN>`
  - `Content-Type`: `multipart/form-data`
- **Request Body**:

  - The request body should be sent as `multipart/form-data`.
  - There will be two fields in the form data:

    - `files`: An array of photos.
    - `data`: JSON string containing the trip details.

```json
{
	"destination": "Paris, France",
	"startDate": "2024-06-01",
	"endDate": "2024-06-07",
	"budget": 1500,
	"activities": ["Eiffel Tower visit", "Louvre Museum tour"]
}
```

### Get Paginated and Filtered Trips

Retrieve paginated and filtered trips based on query parameters such as destination, start date, end date, maxBudget, minBudget etc.

- **Endpoint:** `GET /api/trips`

### Get A Trip By ID

Retrieve a trip with the ID: `tripId`.

- **Endpoint:** `GET /api/trips/:tripId`

### Get All The Join Requests

Get all the join requests for all the posts made by a user (logged in).

- **Endpoint:** `GET /api/trips/join-requests`
- **Request Headers:**
  - `Authorization`: `<JWT_TOKEN>`

### Delete A Trip By ID

Delete a trip with the ID: `tripId`. A super-admin, admin or the user who created the trip can delete the trip.

- **Endpoint:** `GET /api/trips/:tripId`
- **Request Headers:**
  - `Authorization`: `<JWT_TOKEN>`

### Get All The Requested Trips For a Logged In User

Retrieve all trips that are requested to join by a user .

- **Endpoint:** `GET /api/trips/my-requested-trips`
- **Request Headers:**
  - `Authorization`: `<JWT_TOKEN>`

### Get All The Trips Created By A User

Retrieve all trips that are posted/created by a user .

- **Endpoint:** `GET /api/trips/my-posted-trips`
- **Request Headers:**
  - `Authorization`: `<JWT_TOKEN>`

### Send Travel Buddy Request

Send a travel buddy request for a specific trip with the ID `tripId`.

- **Endpoint:** POST /api/trip/:tripId/request
- **Request Headers:**
  - `Authorization`: `<JWT_TOKEN>`
- **Request Body:**

```json
{
	"userId": "b9964127-2924-42bb-9970-60f93c016xyz"
}
```

### Get Potential Travel Buddies For a Specific Trip

Retrieve potential travel buddies for a specific trip with the ID `:tripId`.

- **Endpoint:** `GET /api/travel-buddies/:tripId`
- **Request Headers:**
  - `Authorization`: `<JWT_TOKEN>`

### Respond to Travel Buddy Request

Respond to a travel buddy request with the ID `buddyId`, updating the status of the request.

- **Endpoint:** `PUT /api/travel-buddies/:buddyId/respond`
- **Request Headers:**
  - `Authorization`: `<JWT_TOKEN>`
- **Request Body:**

```json
{
	"tripId": "b9964127-2924-42bb-9970-60f93c016ghi",
	"status": "APPROVED"
}
```

### Get Logged In User's Profile

Retrieve the logged in user's profile information.

- **Endpoint:** `GET /api/users/me`
- **Request Headers:**
  - `Authorization`: `<JWT_TOKEN>`

### Get All the User's Profile Information

Retrieve all the user's profile information. Only Admin and Super Admin can retrieve all the user's profile information.

- **Endpoint:** `GET /api/users`
- **Request Headers:**
  - `Authorization`: `<JWT_TOKEN>`

### Get A User's Profile Information By ID

Retrieve a user's profile information by the ID. Only Admin and Super Admin can retrieve a specific user's profile information by his/her ID.

- **Endpoint:** `GET /api/users/:userId`
- **Request Headers:**
  - `Authorization`: `<JWT_TOKEN>`

### Update User Profile (Logged in user)

Update the logged in user's profile information.

- **Endpoint:** `PUT /api/users/update-me`
- **Request Headers:**
  - `Authorization`: `<JWT_TOKEN>`
- **Request Body:**

```json
{
	"name": "John Cena",
	"email": "john.doe@example.com",
	"profile": {
		"bio": "xyz",
		"age": 30
	}
}
```

### Update A User Role By ID

Update a user's role. Only Admin or Super Admin can change user role.

- **Endpoint:** `PUT /api/users/role/:userId/edit`
- **Request Headers:**
  - `Authorization`: `<JWT_TOKEN>`
- **Request Body:**

```json
{
	"role": "ADMIN"
}
```

### Update A User Status By ID

Update a user's status. Only Admin or Super Admin can change user role.

- **Endpoint:** `PUT /api/users/status/:userId"`
- **Request Headers:**
  - `Authorization`: `<JWT_TOKEN>`
- **Request Body:**

```json
{
	"status": "BLOCKED"
}
```

## Error Handling

The application implements proper error handling throughout the API endpoints, providing appropriate error responses with status codes and error messages.

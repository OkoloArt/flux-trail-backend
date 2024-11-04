# Flux Trail Backend

The Flux Trail backend is structured as a monorepo, divided into two main parts: **user** and **admin**. The backend provides endpoints for user ticket management and admin route management.

## User Side Endpoints

### Ticket Management

- **POST** `/ticket`: Create a new ticket.
- **POST** `/ticket/use`: Use a ticket.
- **DELETE** `/ticket/burn`: Burn a ticket.
- **GET** `/ticket/:id`: Retrieve a ticket by asset ID.
- **GET** `/tickets`: Retrieve all tickets for an address.
- **GET** `/routes`: Retrieve all available routes.

## Admin Side Endpoints

### Route and Ticket Management

- **POST** `/auth/login`: Admin login.
- **POST** `/route`: Create a new route.
- **GET** `/route/:id`: Retrieve a route by ID.
- **GET** `/routes`: Retrieve all routes.
- **PATCH** `/route/:id`: Update an existing route.
- **DELETE** `/route/:id`: Delete an existing route.
- **GET** `/ticket/:id`: Retrieve a ticket by ID.
- **GET** `/tickets`: Retrieve all tickets.
- **GET** `/tickets/statistics`: Retrieve statistics for all tickets.

## Setup

1. Clone the repository.
2. Navigate to the backend directory.
3. Install dependencies with `yarn install`.
4. Configure environment variables for database connection and API keys in a `.env` file.
5. Run the server using `yarn start:dev admin` for Admin and `yarn start:dev main` for Main .

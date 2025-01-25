# Backend - Vehicles API

This is the backend service for the Vehicles platform, built with **Node.js** and **NestJS**. It provides APIs to retrieve vehicle data, manage filters, and simulate database operations using a mock data repository.

---

## Features

- **RESTful API:** Provides endpoints for vehicles and filters.
- **Mock Database:** Simulates data retrieval for testing and development.
- **Global Exception Handling:** Centralized error management with standardized responses.
- **Scalable Architecture:** Modular structure adhering to SOLID principles.

---

## Prerequisites

Ensure you have the following installed:

- **Node.js** (>= 18.x)
- **pnpm** (>= 8.x)

---

## Installation and Setup

1. Clone the repository:

   ```bash
   git clone https://github.com/ykchir/gbh-fullstack
   cd gbh-fullstack/backend
   ```

2. Install dependencies:

   ```bash
   pnpm install
   ```

3. Build the project:

   ```bash
   pnpm build
   ```

4. Start the server in development mode:

   ```bash
   pnpm start:dev
   ```

   The API will be accessible at `http://localhost:3000/api`.

5. Start the server in production mode:

   ```bash
   pnpm start:prod
   ```

---

## Endpoints

### Vehicles

- **GET /api/vehicles**: Retrieve a list of vehicles with optional filters (e.g., manufacturer, type, year).
- **GET /api/vehicles/****:id**: Retrieve details of a specific vehicle.

### Filters

- **GET /api/vehicles/filters**: Retrieve available manufacturers, types, and years for filtering.

---

## Project Structure

```plaintext
src/
├── application
│   ├── dtos                # Data Transfer Objects
│   ├── use-cases           # Business logic
│   └── utils               # Helper functions (pagination, sorting, etc.)
├── core
│   ├── entities            # Core entities (Vehicle, etc.)
│   └── interfaces          # Interfaces for repositories
├── fixtures                # Mock data for development
├── infrastructure
│   ├── database            # Database or mock repository implementation
│   └── http                # NestJS module setup
├── interface-adapters
│   ├── controllers         # API controllers
│   └── presenters          # Response formatting
└── main.ts                 # Application entry point
```

---

## Running Tests

1. Run unit tests:

   ```bash
   pnpm test
   ```

2. Run e2e tests:

   ```bash
   pnpm test:e2e
   ```

---

## Linting and Formatting

To ensure code consistency, run the following commands:

1. **Lint the code:**

   ```bash
   pnpm lint
   ```

2. **Format the code:**

   ```bash
   pnpm format
   ```

---

## Contributing

1. Create a new feature branch:
   ```bash
   git checkout -b feature/your-feature-name
   ```
2. Commit your changes:
   ```bash
   git commit -m "feat(your-feature-name): Add your message here"
   ```
3. Push the branch and create a pull request.

---

## License

This project is licensed under the [MIT License](LICENSE).


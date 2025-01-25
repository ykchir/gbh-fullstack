# GBH Fullstack Application

This is a monorepo for the GBH Fullstack Application, built with **Next.js** for the frontend, **NestJS** for the backend, and shared utilities/types across projects.

## Projects
- **Frontend**: Next.js application for user interactions.
- **Backend**: NestJS application handling the API and business logic.
- **Shared**: Shared types and utilities used across the frontend and backend.

## Prerequisites
- Node.js (v18 or higher)
- PNPM package manager

## Installation
1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd gbh-fullstack
   ```

2. Install dependencies:
   ```bash
   pnpm install
   ```

3. Run the development servers:
   - **Frontend**: Navigate to the `frontend` directory and start the server:
     ```bash
     start:frontend
     ```
   - **Backend**: Navigate to the `backend` directory and start the server:
     ```bash
     start:backend
     ```

## Folder Structure
```
.
├── backend/       # NestJS API
├── frontend/      # Next.js application
├── shared/        # Shared utilities and types
└── README.md      # Main README
```

## Deployment
The application uses **GitHub Actions** for CI/CD. Each project has its own workflow to build and deploy independently.

For more details, refer to the individual README files in `backend/` and `frontend/`.

## License
This project is licensed under the MIT License.

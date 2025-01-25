# Frontend - Vehicles Platform

This is the frontend application for the Vehicles platform, built with **Next.js**. It provides a user interface to browse and filter vehicles using data from the backend service.

---

## Features

- **Dynamic Filtering:** Easily filter vehicles by manufacturer, type, year, and more.
- **Pagination:** Navigate through large datasets with seamless pagination.
- **Error Handling:** User-friendly error messages for API failures.
- **Responsive Design:** Optimized for desktop and mobile devices.
- **Modern Stack:** Built with Next.js, Tailwind CSS, and TypeScript.

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
   cd gbh-fullstack/frontend
   ```

2. Install dependencies:

   ```bash
   pnpm install
   ```

3. Start the development server:

   ```bash
   pnpm dev
   ```

   The application will be accessible at `http://localhost:3000`.

4. Build for production:

   ```bash
   pnpm build
   ```

5. Start the production server:

   ```bash
   pnpm start
   ```

---

## Project Structure

```plaintext
src/
├── app                  # Next.js app directory
├── components           # Reusable UI components
├── services             # API service integrations
├── types                # TypeScript types and interfaces
├── utils                # Utility functions (e.g., error handling)
└── styles               # Global styles and Tailwind CSS configuration
```

---

## Scripts

1. **Development:**
   ```bash
   pnpm dev
   ```

2. **Production Build:**
   ```bash
   pnpm build
   ```

3. **Start Production Server:**
   ```bash
   pnpm start
   ```

4. **Lint the code:**
   ```bash
   pnpm lint
   ```

5. **Format the code:**
   ```bash
   pnpm format
   ```

---

## Error Handling

The application uses a centralized error handler for consistent error messaging. Errors from the backend are displayed as user-friendly messages in the UI.

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


# brainly-FE

A React-based frontend application for managing and sharing content.

## Environment Variables

This project uses environment variables for configuration. Create a `.env` file in the root directory with the following variables:

```env
VITE_API_URL=https://brainly-backend-green.vercel.app
VITE_GOOGLE_CLIENT_ID=52074276999-hivborjh21pho32erp3jg6l7es1f3qc5.apps.googleusercontent.com
```

### Available Environment Variables

- `VITE_API_URL`: The base URL for the backend API
- `VITE_GOOGLE_CLIENT_ID`: Google OAuth client ID for authentication

### Usage

Environment variables are accessed directly in the code using `import.meta.env.VITE_*`:

```typescript
// Example usage
const apiUrl = import.meta.env.VITE_API_URL;
const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
```

## Getting Started

1. Clone the repository
2. Install dependencies: `npm install`
3. Create a `.env` file with the required environment variables
4. Start the development server: `npm run dev`

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run lint` - Run ESLint
- `npm run preview` - Preview production build

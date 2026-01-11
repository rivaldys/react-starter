# Getting Started

This guide will help you set up and run the React Starter project on your local machine.

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** >= 24.x ([Download](https://nodejs.org/))
- **pnpm** >= 10.x ([Installation](https://pnpm.io/installation))
- **Git** ([Download](https://git-scm.com/))

### Verify Installation

```bash
node --version    # Should output v24.x.x or higher
pnpm --version    # Should output 10.x.x or higher
```

## Installation

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/react-starter.git
cd react-starter
```

### 2. Install Dependencies

```bash
pnpm install
```

### 3. Environment Setup

Copy the example environment file:

```bash
cp .env.example .env
```

Edit `.env` to configure your environment:

```env
# Server port
VITE_APP_PORT=3000

# Application name (exposed to client)
VITE_PUBLIC_APP_NAME=React Starter

# Base path for routing (use "/" for root)
VITE_PUBLIC_APP_BASE_PATH=/

# API base URL
VITE_PUBLIC_API_BASE_URL=http://localhost:8080

# Enable SSR (true/false)
VITE_USE_SSR=false
```

## Running the Application

### Development Mode

#### Client-Side Rendering (CSR)

```bash
pnpm dev
```

Opens at [http://localhost:3000](http://localhost:3000) with hot module replacement.

#### Server-Side Rendering (SSR)

```bash
pnpm dev:ssr
```

Opens at [http://localhost:3000](http://localhost:3000) with SSR and HMR.

### Production Mode

#### Build CSR

```bash
pnpm build
pnpm preview
```

#### Build SSR

```bash
pnpm build:ssr
pnpm preview:ssr
```

## Development Tools

### Component Playground

In development mode, access the Component Playground at `/playground` to test UI components:

- **Error Boundary** - Test error handling
- **Skeleton** - Preview loading animations
- **Loading Fallback** - Test loading states

### Testing

```bash
# Watch mode
pnpm test

# Single run
pnpm test:run

# With coverage
pnpm test:coverage

# With UI
pnpm test:ui
```

### Linting

```bash
pnpm lint
```

## IDE Setup

### VS Code (Recommended)

Install these extensions:
- ESLint
- Tailwind CSS IntelliSense
- TypeScript Vue Plugin (Volar)
- Prettier

### Recommended Settings

Create `.vscode/settings.json`:

```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "typescript.preferences.importModuleSpecifier": "non-relative",
  "tailwindCSS.experimental.classRegex": [
    ["cn\\(([^)]*)\\)", "(?:'|\"|`)([^']*)(?:'|\"|`)"]
  ]
}
```

## Troubleshooting

### Common Issues

#### Port Already in Use

```bash
# Find and kill the process using the port
lsof -i :3000
kill -9 <PID>
```

#### Node Version Mismatch

Use a Node version manager:

```bash
# Using nvm
nvm install 24
nvm use 24

# Using fnm
fnm install 24
fnm use 24
```

#### pnpm Lock File Issues

```bash
rm -rf node_modules pnpm-lock.yaml
pnpm install
```

## Next Steps

- [Project Structure](project-structure.md) - Understand the codebase organization
- [Component Guide](components.md) - Learn Atomic Design patterns
- [Routing](routing.md) - Configure application routes
- [Testing](testing.md) - Write and run tests

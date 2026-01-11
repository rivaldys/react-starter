# React Starter 🚀

A modern, production-ready React boilerplate with **Atomic Design methodology**, **Server-Side Rendering (SSR)**, and comprehensive tooling for building scalable web applications.

![React](https://img.shields.io/badge/React-19.x-61DAFB?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?logo=typescript)
![Vite](https://img.shields.io/badge/Vite-7.x-646CFF?logo=vite)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.x-06B6D4?logo=tailwindcss)

## 💡 Main Idea

The main idea of this boilerplate is to bundle everything you need when starting a frontend project — without manually configuring routing, state management, fetching, directory structure, and more.

### Why Atomic Design?

**Atomic Design** is a methodology that categorizes components from smallest to largest (hence "atomic", borrowed from physics). In frontend development, prioritizing **reusable components** leads to better maintainability, consistency, and developer experience. This boilerplate implements Atomic Design in its directory structure:

```
components/
├── atoms/       # Basic building blocks (Button, Input, Icon)
├── molecules/   # Simple combinations (SearchBar, FormField)
├── organisms/   # Complex components (Header, Sidebar)
└── templates/   # Page layouts (Layout, AuthLayout)
```

## ✨ Features

- ⚛️ **React 19** - Latest React with concurrent features
- 🔷 **TypeScript** - Type-safe development
- ⚡ **Vite** - Lightning-fast HMR and build
- 🎨 **Tailwind CSS 4** - Utility-first CSS framework
- 🏗️ **Atomic Design** - Scalable component architecture
- 🌐 **SSR Support** - Server-side rendering with Koa
- 🔄 **Redux Toolkit** - Predictable state management with SSR hydration
- 🧭 **React Router 7** - Declarative routing
- 🧪 **Vitest** - Fast unit testing with coverage
- 🐳 **Docker** - Containerized deployment (CSR & SSR)
- 🔒 **Security** - Helmet, CORS, and best practices

## �️ Preview

<p align="center">
  <img src="https://github.com/rivaldys/react-starter/assets/76983038/8394df42-d1ee-4782-b2b6-3bc73595bd83" alt="React Starter - Home" width="700">
</p>

<p align="center">
  <img src="https://github.com/rivaldys/react-starter/assets/76983038/c27f9d63-76b3-401a-a816-e4aabb01c735" alt="React Starter - About" width="700">
</p>

## 📚 Documentation

| Guide | Description |
|-------|-------------|
| [Getting Started](docs/getting-started.md) | Installation and basic setup |
| [Project Structure](docs/project-structure.md) | Folder organization and architecture |
| [Component Guide](docs/components.md) | Atomic Design and component patterns |
| [State Management](docs/state-management.md) | Redux Toolkit and SSR hydration |
| [Routing](docs/routing.md) | React Router configuration |
| [Testing](docs/testing.md) | Unit testing with Vitest |
| [Deployment](docs/deployment.md) | Docker, SSR, and production setup |

## 🗺️ Site Map

```
/                         → Home page
/about                    → About page
/docs                     → Documentation hub
  /docs/getting-started   → Installation guide
  /docs/project-structure → Folder organization
  /docs/components        → Component patterns
  /docs/state-management  → Redux & SSR hydration
  /docs/routing           → React Router config
  /docs/testing           → Testing with Vitest
  /docs/deployment        → Docker & production
/playground               → Component Playground (dev only)
*                         → 404 Not Found
```

## 🚀 Quick Start

### Prerequisites

- Node.js >= 24.x
- pnpm >= 10.x

### Installation

```bash
# Clone the repository
git clone https://github.com/your-username/react-starter.git
cd react-starter

# Install dependencies
pnpm install

# Copy environment file
cp .env.example .env
```

### Development

```bash
# Start development server (CSR)
pnpm dev

# Start development server (SSR)
pnpm dev:ssr
```

### Build & Preview

```bash
# Build for production (CSR)
pnpm build
pnpm preview

# Build for production (SSR)
pnpm build:ssr
pnpm preview:ssr
```

### Testing

```bash
# Run tests in watch mode
pnpm test

# Run tests once
pnpm test:run

# Run tests with coverage
pnpm test:coverage

# Run tests with UI
pnpm test:ui
```

### Docker

```bash
# Build Docker image (CSR - default)
pnpm build:image

# Build Docker image (SSR)
pnpm build:image -- --mode ssr

# Run container
pnpm run:container
```

## 📁 Project Structure

```
react-starter/
├── deploy/                 # Deployment configurations
│   ├── Dockerfile          # Multi-stage Docker build
│   └── nginx.conf          # Nginx config for CSR
├── docs/                   # Documentation files
├── public/                 # Static assets
├── scripts/                # Build and utility scripts
├── src/
│   ├── __tests__/          # Test files
│   ├── assets/             # Images, icons, fonts
│   ├── components/         # Atomic Design components
│   │   ├── atoms/          # Basic building blocks
│   │   ├── molecules/      # Component combinations
│   │   ├── organisms/      # Complex components
│   │   └── templates/      # Page layouts
│   ├── pages/              # Route pages
│   ├── router/             # Routing configuration
│   ├── services/           # API and state management
│   │   ├── api/            # API client
│   │   ├── slices/         # Redux slices
│   │   └── store/          # Redux store
│   └── shared/             # Shared utilities
│       ├── constants/      # App constants
│       ├── hooks/          # Custom React hooks
│       ├── lib/            # Third-party integrations
│       ├── types/          # TypeScript types
│       └── utils/          # Utility functions
├── server.ts               # Koa SSR server
└── vite.config.ts          # Vite configuration
```

## 🛠️ Tech Stack

| Category | Technology |
|----------|------------|
| **Framework** | React 19 |
| **Language** | TypeScript 5.9 |
| **Build Tool** | Vite 7 |
| **Styling** | Tailwind CSS 4 |
| **State** | Redux Toolkit 2 |
| **Routing** | React Router 7 |
| **SSR Server** | Koa 3 |
| **Testing** | Vitest + Testing Library |
| **Linting** | ESLint 9 |
| **Container** | Docker + Nginx |

## 📜 Available Scripts

| Script | Description |
|--------|-------------|
| `pnpm dev` | Start Vite dev server (CSR) |
| `pnpm dev:ssr` | Start Koa dev server (SSR) |
| `pnpm build` | Build for production (CSR) |
| `pnpm build:ssr` | Build for production (SSR) |
| `pnpm preview` | Preview production build (CSR) |
| `pnpm preview:ssr` | Preview production build (SSR) |
| `pnpm test` | Run tests in watch mode |
| `pnpm test:run` | Run tests once |
| `pnpm test:coverage` | Run tests with coverage |
| `pnpm lint` | Lint code with ESLint |
| `pnpm build:image` | Build Docker image |
| `pnpm run:container` | Run Docker container |

## 🔧 Environment Variables

Create a `.env` file based on `.env.example`:

```env
# Application
VITE_APP_PORT=3000
VITE_PUBLIC_APP_NAME=React Starter
VITE_PUBLIC_APP_BASE_PATH=/

# API
VITE_PUBLIC_API_BASE_URL=http://localhost:8080

# Features
VITE_USE_SSR=false
```

> **Note**: Variables prefixed with `VITE_PUBLIC_` are exposed to the client.

## 🤝 Contributing

Contributions are welcome! Please read our contributing guidelines before submitting a PR.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👤 Author

**Ahmad Rivaldy S** - [rivaldy.net](https://rivaldy.net)

- GitHub: [@rivaldys](https://github.com/rivaldys)

---

<p align="center">
  Made with ❤️ for the React community
</p>

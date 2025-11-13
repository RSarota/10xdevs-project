# 10x-cards

A modern web application for creating and managing educational flashcards with AI-powered generation capabilities. Learn efficiently using spaced repetition algorithms while saving time with automated flashcard creation.

## Table of Contents

- [Project Description](#project-description)
- [Tech Stack](#tech-stack)
- [Getting Started Locally](#getting-started-locally)
- [Available Scripts](#available-scripts)
- [Testing](#testing)
- [Project Scope](#project-scope)
- [Project Status](#project-status)
- [License](#license)

## Project Description

10x-cards is an educational web application that revolutionizes the way users create and study flashcards. The application addresses the time-consuming nature of manual flashcard creation by offering two primary modes:

### Key Features

- **AI-Powered Generation**: Paste text (1,000-10,000 characters) and let our LLM automatically generate flashcard suggestions
- **Manual Creation**: Traditional flashcard creation with intuitive forms
- **Spaced Repetition**: Built-in algorithm for optimal learning efficiency
- **User Management**: Secure authentication with account management
- **Learning Sessions**: Interactive study sessions with performance tracking
- **Session History**: Track your learning progress over time
- **Privacy-First**: Your flashcards remain private and secure

### Target Metrics

- 75% of flashcards created through AI generation
- 75% acceptance rate of AI-generated flashcard suggestions

## Tech Stack

### Frontend

- **Astro 5** - Fast, modern web framework with minimal JavaScript
- **React 19** - Interactive components where needed
- **TypeScript 5** - Static typing and enhanced IDE support
- **Tailwind 4** - Utility-first CSS framework
- **Shadcn/ui** - Accessible React component library

### Backend

- **Supabase** - Complete backend-as-a-service solution
  - PostgreSQL database
  - Built-in user authentication
  - Real-time capabilities
  - Open-source with self-hosting options

### AI Integration

- **Azure OpenAI Service** - Generative model inference and embeddings
- **Azure API Management** - Public API exposure with validation, rate limiting, and analytics

### Infrastructure

- **GitHub Actions** - CI/CD pipelines
- **DigitalOcean** - Application hosting via Docker containers
- **Docker** - Containerized deployment

## Getting Started Locally

### Prerequisites

- Node.js 22.14.0 (use `.nvmrc` for version management)
- npm or yarn package manager
- Git

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/RSarota/10xdevs-project.git
   cd 10xdevs-project
   ```

2. **Set up Node.js version**

   ```bash
   nvm use
   # or if you don't have nvm:
   # Ensure you're using Node.js 22.14.0
   ```

3. **Install dependencies**

   ```bash
   npm install
   ```

4. **Set up environment variables**

   Create a `.env` file in the root directory with the following variables:

   ```bash
   # Create .env file
   touch .env
   # Edit .env with your configuration
   ```

5. **Start the development server**

   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to `http://localhost:3000` to see the application running.

### Environment Configuration

You'll need to configure the following environment variables in your `.env` file:

- `SUPABASE_URL` - Your Supabase project URL
- `SUPABASE_KEY` - Your Supabase anonymous key
- `OPENAI_URL` - OpenAI API endpoint (e.g., `https://api.openai.com/v1`)
- `OPENAI_API_KEY` - OpenAI API key

**Note**: The `.env` file is in `.gitignore` and should not be committed to the repository. For production deployment configuration, see [docs/AZURE_ENVIRONMENT_VARIABLES.md](docs/AZURE_ENVIRONMENT_VARIABLES.md).

## Available Scripts

### Development

| Script            | Description                              |
| ----------------- | ---------------------------------------- |
| `npm run dev`     | Start development server with hot reload |
| `npm run build`   | Build the application for production     |
| `npm run preview` | Preview the production build locally     |
| `npm run astro`   | Run Astro CLI commands                   |

### Code Quality

| Script             | Description                      |
| ------------------ | -------------------------------- |
| `npm run lint`     | Run ESLint to check code quality |
| `npm run lint:fix` | Automatically fix ESLint issues  |
| `npm run format`   | Format code with Prettier        |

### Testing

| Script                     | Description                                 |
| -------------------------- | ------------------------------------------- |
| `npm run test`             | Run unit and integration tests (Vitest)     |
| `npm run test:watch`       | Run tests in watch mode                     |
| `npm run test:ui`          | Run tests with interactive UI               |
| `npm run test:coverage`    | Run tests with coverage report              |
| `npm run test:e2e`         | Run end-to-end tests (Playwright)           |
| `npm run test:e2e:ui`      | Run E2E tests with interactive UI           |
| `npm run test:e2e:debug`   | Run E2E tests in debug mode                 |
| `npm run test:e2e:codegen` | Generate E2E tests using Playwright Codegen |
| `npm run dev:e2e`          | Start development server in test mode       |

### Development Workflow

The project includes pre-commit hooks via Husky and lint-staged for code quality:

- TypeScript/React files are automatically linted and fixed
- JSON, CSS, and Markdown files are formatted with Prettier

## Testing

The project includes comprehensive testing infrastructure:

### Unit & Integration Tests

- **Framework**: Vitest with React Testing Library
- **Location**: Tests are co-located with source files (`.test.ts`, `.test.tsx`)
- **Run**: `npm run test` or `npm run test:watch` for development

### End-to-End Tests

- **Framework**: Playwright
- **Location**: `tests/e2e/`
- **Run**: `npm run test:e2e`
- **Setup**: Requires `.env.test` file with test credentials (see [tests/e2e/README.md](tests/e2e/README.md))

### Test Coverage

Generate coverage reports with `npm run test:coverage` to identify untested code paths.

## Project Scope

### Included in MVP

✅ **Core Functionality** - All MVP features are implemented and functional

- ✅ User registration and authentication with email verification
- ✅ Password recovery (forgot/reset password)
- ✅ Account management (profile updates, account deletion)
- ✅ AI-powered flashcard generation from text input (1,000-10,000 characters)
- ✅ Manual flashcard creation with forms
- ✅ Flashcard management (view, edit, delete, bulk operations)
- ✅ Flashcard filtering and sorting (by type, generation, date)
- ✅ Spaced repetition learning sessions with FSRS algorithm
- ✅ Session history and progress tracking
- ✅ Statistics and analytics dashboard
- ✅ Secure, private flashcard storage with Row-Level Security (RLS)
- ✅ Admin panel (error logs, user management)

## Project Status

✅ **MVP Complete** - Production Ready

The MVP is fully implemented with all core features functional:

- ✅ **User Authentication**: Complete registration, login, password recovery, and account management
- ✅ **AI Integration**: Azure OpenAI integration for automated flashcard generation
- ✅ **Flashcard Management**: Full CRUD operations with filtering, sorting, and bulk operations
- ✅ **Learning Sessions**: Interactive study sessions with spaced repetition (FSRS algorithm)
- ✅ **Progress Tracking**: Session history, statistics, and analytics dashboard
- ✅ **Security**: Row-Level Security (RLS) policies, secure authentication, and private data storage

The application is ready for production deployment. Future enhancements may include:

- Advanced analytics and insights
- Social features (sharing, collaboration)
- Mobile applications
- Additional AI features and integrations

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

**Contributing**: This project is part of the 10xDevs learning program. For questions or contributions, please open an issue or contact the maintainers.

**Support**: For technical support or questions about the application, please refer to the documentation or open an issue in the GitHub repository.

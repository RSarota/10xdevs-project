# 10x-cards

A modern web application for creating and managing educational flashcards with AI-powered generation capabilities. Learn efficiently using spaced repetition algorithms while saving time with automated flashcard creation.

## Table of Contents

- [Project Description](#project-description)
- [Tech Stack](#tech-stack)
- [Getting Started Locally](#getting-started-locally)
- [Available Scripts](#available-scripts)
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
   ```bash
   # Copy the example environment file
   cp .env.example .env.local
   # Edit .env.local with your configuration
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to `http://localhost:4321` to see the application running.

### Environment Configuration

You'll need to configure the following environment variables:

- `SUPABASE_URL` - Your Supabase project URL
- `SUPABASE_KEY` - Your Supabase anonymous key
- `AZURE_OPENAI_ENDPOINT` - Azure OpenAI service endpoint
- `AZURE_OPENAI_API_KEY` - Azure OpenAI API key

## Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server with hot reload |
| `npm run build` | Build the application for production |
| `npm run preview` | Preview the production build locally |
| `npm run astro` | Run Astro CLI commands |
| `npm run lint` | Run ESLint to check code quality |
| `npm run lint:fix` | Automatically fix ESLint issues |
| `npm run format` | Format code with Prettier |

### Development Workflow

The project includes pre-commit hooks via Husky and lint-staged for code quality:
- TypeScript/React files are automatically linted and fixed
- JSON, CSS, and Markdown files are formatted with Prettier

## Project Scope

### Included in MVP

✅ **Core Functionality**
- User registration and authentication with email verification
- AI-powered flashcard generation from text input
- Manual flashcard creation with forms
- Flashcard management (edit, delete, organize)
- Spaced repetition learning sessions
- Session history and progress tracking
- Secure, private flashcard storage

## Project Status

🚧 **In Development** - MVP Phase

The project is currently in active development, focusing on implementing the core MVP features outlined in the product requirements. The foundation with Astro, React, and Supabase integration is established, with ongoing work on:

- User authentication system
- AI integration with Azure OpenAI
- Flashcard management interface
- Learning session implementation
- Spaced repetition algorithm

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

**Contributing**: This project is part of the 10xDevs learning program. For questions or contributions, please open an issue or contact the maintainers.

**Support**: For technical support or questions about the application, please refer to the documentation or open an issue in the GitHub repository.

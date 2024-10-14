# Quolance UI

Quolance UI is a Next.js-based user interface project. This README provides instructions for setting up, running, and contributing to the project.

## Table of Contents

- [Getting Started](#getting-started)
- [Running the Project](#running-the-project)
- [Scripts](#scripts)
- [Linting](#linting)
- [Commit Structure](#commit-structure)
- [Contributing](#contributing)


## Getting Started

To get started with Quolance UI, follow these steps:

1. Clone the repository:
   ```sh
   git clone https://github.com/your-username/quolance-ui.git
   ```

2. Navigate to the project directory:
   ```sh
   cd quolance-ui
   ```

3. Install dependencies:
   ```sh
   npm install
   ```

## Running the Project

To run the development server:

```sh
npm run dev
```

This will start the Next.js development server. Open [http://localhost:3000](http://localhost:3000) in your browser to view the application.

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Starts the development server |
| `npm run build` | Builds the application for production |
| `npm run start` | Starts the production server |
| `npm run lint` | Runs the linter to check for code issues |
| `npm run lint:fix` | Automatically fixes linting issues where possible |
| `npm run typecheck` | Runs TypeScript type checking |
| `npm test` | Runs the test suite |
| `npm run format` | Formats the code using Prettier |

## Linting

To check for linting issues:

```sh
npm run lint
```

To automatically fix linting issues:

```sh
npm run lint:fix
```

## Commit Structure

We use conventional commit messages to automate versioning and changelog generation. Each commit message should be structured as follows:

```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

### Types

- `feat`: A new feature
- `fix`: A bug fix
- `docs`: Documentation only changes
- `style`: Changes that do not affect the meaning of the code
- `refactor`: A code change that neither fixes a bug nor adds a feature
- `perf`: A code change that improves performance
- `test`: Adding missing tests or correcting existing tests
- `chore`: Changes to the build process or auxiliary tools and libraries
- `ci`: Changes to our CI configuration files and scripts
- `vercel`: Changes related to Vercel deployment

### Example

```
feat: add new button component

This new button component includes hover and focus states.

Closes #123
```

## Contributing

1. Create a new branch for your feature or bug fix
2. Make your changes
3. Run tests and ensure linting passes
4. Commit your changes using the conventional commit format
5. Push your branch and create a pull request



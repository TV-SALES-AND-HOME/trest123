# Contributing to TV SALES & HOME

## Getting Started

```bash
git clone https://github.com/TV-SALES-AND-HOME/template.git
cd template
npm install
cp .env.example .env.local
npm run dev
```

## Branching Strategy

```
feature/*  ->  develop  ->  staging  ->  main
```

| Branch | Purpose | Direct push? |
|---|---|---|
| `main` | Production | No - PR only |
| `staging` | Pre-production | No - PR only |
| `develop` | Integration | No - PR only |
| `feature/*` | New features | Yes |
| `bugfix/*` | Bug fixes | Yes |
| `hotfix/*` | Urgent production fixes | Yes |

```bash
# Create a feature branch
git checkout develop
git pull origin develop
git checkout -b feature/your-feature-name
```

## Commit Conventions

We use Conventional Commits: `type(scope): description`

| Type | When to use |
|---|---|
| `feat` | New feature |
| `fix` | Bug fix |
| `docs` | Documentation |
| `refactor` | Code restructuring |
| `test` | Tests |
| `ci` | CI/CD changes |
| `security` | Security fix |

## Pull Request Process

1. Branch from `develop`
2. Make changes and write tests
3. Run checks locally: `npm run lint && npm run typecheck && npm test && npm run build`
4. Push and open PR against `develop`
5. Fill in the PR template
6. CI must pass before merge

## Code Style

- TypeScript strict mode - no `any` types
- ESLint `next/core-web-vitals` rules must pass
- Use `@/` import alias for project imports

## Testing Requirements

| Type | Requirement |
|---|---|
| Unit tests | Required for all business logic in `src/lib/` |
| E2E tests | Required for all new user-facing pages |
| Build | Must pass before any merge |

```bash
npm test                # Unit tests
npm run test:e2e        # E2E tests
npm run test:coverage   # With coverage
```

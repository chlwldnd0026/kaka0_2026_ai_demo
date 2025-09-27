# Repository Guidelines

This repo is spec‑driven. All development must follow `PRD.md` and `design_reference.md` as the single source of truth. As code is introduced, follow these guidelines to keep the project consistent and verifiable.

## Spec‑Driven Development (Required)
- Implement only features scoped in `PRD.md`; UI/UX must match `design_reference.md`.
- PRs must reference relevant sections (e.g., “PRD §2.1; Design §Auth‑Flow”).
- If specs are unclear or outdated, open an issue and propose a doc update; do not guess. Ship code and spec changes together when behavior changes.

## Project Structure & Module Organization
- `src/` – application/library code (group by domain or feature).
- `tests/` – unit/integration tests mirroring `src/` paths.
- `scripts/` – developer utilities (setup, lint, release).
- `assets/` – images, design specs, sample data.
- `docs/` – user and architecture docs (consider moving `PRD.md` and `design_reference.md` here when code lands).

## Build, Test, and Development Commands
- No build tool is defined yet. When adding one, expose common tasks via a single entry point (e.g., `make`, `npm scripts`, or `tasks.py`). Suggested baseline:
  - `make setup` – install deps, set up env.
  - `make test` – run the test suite.
  - `make lint` – run formatters/linters.
  - `make run` – run the app locally.

## Coding Style & Naming Conventions
- Indentation: 2 spaces for config/markdown; follow language defaults for code.
- Naming: `snake_case` for files in Python, `kebab-case` for CLI names, `PascalCase` for classes.
- Formatting/Linting (pick per stack and enforce in CI):
  - Python: `black`, `ruff`, `mypy` (strict where practical).
  - JS/TS: `prettier`, `eslint` (`@typescript-eslint` if TS).
- Keep modules small; one responsibility per file.

## Testing Guidelines
- Place tests in `tests/` with structure mirroring `src/`.
- Naming: Python `test_*.py`; JS/TS `*.spec.ts` or `*.test.ts`.
- Target ≥80% line coverage for changed code.
- Prefer fast unit tests; isolate I/O behind interfaces; use fixtures/mocks.

## Commit & Pull Request Guidelines
- Use Conventional Commits (e.g., `feat: add login redirect`, `fix(auth): handle token refresh`).
- PRs: clear description, scope/impact, linked issues, before/after screenshots for UX, and test notes.
- Keep PRs small and focused; add migration/rollback steps when relevant.

## Security & Configuration
- Never commit secrets. Use `.env` (gitignored) and provide `.env.example`.
- Document required environment variables and defaults.
- Review `PRD.md` for non-functional requirements and constraints.

## Agent-Specific Instructions
- Follow this AGENTS.md for any file you touch. Do not add licenses or unrelated tooling. Keep changes minimal, well-scoped, and consistent with the structure above.

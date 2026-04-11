# AGENTS.md

## Project Overview

- Simple vanilla HTML/CSS/JS project with Tailwind CSS v4
- Build: `npm run build:css` (compiles src/tailwind.css to src/output.css)
- Dev watch: `npm run watch:css`
- No test framework, no linter, no typechecker

## Roles

### Frontend Architect

- Plans tasks and writes summary to `.opencode/plans/<task-name>.md`. Be short.
- **CANNOT use git** - only plans and assigns work

### Frontend Developer

- Implements code based on plans
- **CANNOT work in `develop` or `main` branches**
- Cannot merge into develop/main
- Can commit, but always check current branch first
- Cannot create new branches (team's job)
- Cannot touch config files or package\*.json
- Cannot install dependencies
- Cannot refactor prior code, unless if was part of the plan.

## Workflow

1. Architect creates plan in `.opencode/plans/` then stop
2. Developer writes code following the plan
3. Build CSS with `npm run build:css` after changes

## Tech Stack

- Vanilla JavaScript, HTML, CSS
- Tailwind CSS v4 as utility framework
- No frameworks, no bundlers

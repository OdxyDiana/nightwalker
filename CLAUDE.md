# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project overview

Nightwalker is a static HTML/CSS/JS **theme for a ForoActivo/Forumotion/Forumactif forum** (a K-pop idol roleplay community) — a phpBB-style forum platform sold under different brand names per locale (ForoActivo in Spanish, Forumotion in English, Forumactif in French; same underlying system). There is no backend, router, or JS framework — each page under `src/` is a standalone HTML document styled with Tailwind CSS and enhanced with vanilla JS.

Two layers worth keeping distinct when reading this repo:
- **Final code** — the actual theme (`src/*.css`, `src/*.js`, and the structural/layout HTML). This is what ultimately ships into the forum's template/CSS editor and governs how everything renders.
- **Templates** (e.g. `src/tema.html`) — pages that *simulate* the platform's own template system, where forum admins/members are only allowed to modify content within the bounds the final code permits. Content generated *inside* a template — sample post bodies, the nested "Título Principal"/"Título Apartado" Lorem-Ipsum sections, example profile field values — is not final code, it's stand-in user-submitted content standing in for what a real admin/member would paste in. The real deliverable is the surrounding structural/styling code, not that placeholder content.

Reference for the platform's own template variables/tags: https://github.com/Etana/template

`src/pack-html.html` is a **copy of `tema.html`'s rendering**, used specifically to develop/iterate on the HTML that goes inside `.post-content` (the customizable post-body area within the thread/topic template) — it isn't a separate page concept of its own.

Currently in progress: the thread/topic template (`tema.html`) and its `.post-content` formatting (via the `pack-html.html` working copy), where administrators and users can upload their own formatted post code. Forum-wide responsiveness still needs review.

Forum-specific vocabulary appears throughout the markup (Personaje, Grupo, Fans, Empresa, Medallas, Pareja, Inventario, Wons, Reputación) — these are custom profile/post fields for the roleplay forum, not arbitrary content.

## Commands

Package manager is **pnpm** (`pnpm-lock.yaml` / `pnpm-workspace.yaml` are canonical; `package-lock.json` is stale and gitignored).

- `pnpm run build:css` — compile and minify `src/input.css` → `src/output.css` via Tailwind CLI.
- `pnpm run watch:css` — same, watching for changes.
- `pnpm run dev` — serves `src/*.html` via Vite (`vite.config.mjs`, `root: 'src'`, `appType: 'mpa'`) with live reload. Run alongside `watch:css` in a separate terminal — Vite doesn't run the Tailwind build itself. Navigate directly to a page path, e.g. `http://localhost:5173/tema.html`.

There is no test suite (`npm test` is the unconfigured npm stub) and no lint/format tooling configured. HTML pages can also still be viewed directly via the VS Code Live Preview extension (`.vscode/settings.json` defaults to previewing `src/perfil.html`).

## Architecture

**CSS build chain**: `src/input.css` (Tailwind v4 source — defines theme tokens via `@theme` and custom utilities like `background-1/2/3`, `border-color-1/2/3`, `surface-1/2/3` via `@utility`, plus light/dark variable overrides keyed on `[data-theme="dark"]` / `[data-theme="light"]`) → compiled by the Tailwind CLI → `src/output.css` (generated build artifact, committed to git — regenerate it with `build:css` after editing any Tailwind class usage, don't hand-edit it) → imported by `src/style.css` (the stylesheet actually linked from every HTML page, which also pulls in Phosphor Icons and Google Fonts and holds hand-written CSS not expressible as Tailwind utilities, e.g. `[data-title]` tooltips). `tailwind.config.js` still exists alongside the v4 CSS config for legacy `darkMode`/`content` settings.

**Theming**: Dark/light mode is driven by a `data-theme` attribute on `<html>`, toggled and persisted to `localStorage` by `src/script.js`.

**JS**: No bundler — plain `<script>` tags per page.
- `src/script.js` — loaded on every page; owns theme switching and generic field-manipulation helpers shared across post/profile displays.
- `src/forum-section.js`, `src/profile-section.js`, `src/topic-section.js` — page-specific behavior, included only by the page that needs it — check a page's `<script>` tags to see which components it uses before assuming shared behavior.

**Pages** (`src/*.html`), each a standalone forum page type: `indice.html` (forum index), `listado-temas.html` (topic list), `tema.html` (topic/thread template), `pack-html.html` (working copy of `tema.html` used to develop the `.post-content` markup — see Project overview), `perfil.html` (user profile), `paleta.html` (color palette dev tool), `tablon-viejo.html` (legacy reference page — imports an external live ForoActivo/Forumotion/Forumactif stylesheet instead of the local one, kept for comparison, not part of the active build).

Repo-root loose files (`Group.png`, `Perfil.png`, `lista-temas.png`, `topics.png`) are visual reference mockups for the pages being built, not source assets used at runtime.

## Workflow rules (from AGENTS.md, as amended by the user)

- Never work on or push directly to the `develop` branch — use `feature/*` branches (this repo follows `feature/*` → `develop` → `main`).
- Opening pull requests is allowed. Don't merge them independently, though.
- Don't refactor existing code without explicit permission.
- If starting in Plan Mode, notify the user and get confirmation to switch to Build Mode before writing/modifying files.

# Nightwalker Project - AGENTS.MD

## Technology Stack

- CSS framework: Tailwind CSS
- JavaScript for frontend interactions
- Node.js environment

## Project Structure

- Source files in `src/` directory
- Multiple .html files for different pages
- CSS files: input.css (source), output.css (generated)
- JavaScript files: topic-section.js, profile-section.js, forum-section.js, script.js

## Build Process

- Uses Tailwind CSS for styling
- CSS build command: `npm run build:css`
- CSS watch command: `npm run watch:css`
- JavaScript files for components: topic-section.js, profile-section.js, forum-section.js, script.js

## Development Workflow

- Run `npm run watch:css` to watch for changes in CSS files
- The build process automatically generates output.css from input.css
- JavaScript files handle DOM manipulation and user interactions
- Theme switching supported between light and dark themes

## Commands

- `npm run build:css` - Build CSS using Tailwind
- `npm run watch:css` - Watch CSS files for changes
- `npm run dev` - Development server

## Important Files

- src/script.js - Main JavaScript file handling theme switching and DOM manipulations
- src/input.css - Source CSS file with Tailwind directives
- tailwind.config.js - Tailwind configuration
- package.json - Project dependencies and scripts configuration

## Common Patterns

- HTML files use Tailwind CSS classes for styling
- JavaScript files implement interactive behaviors (theme switching, DOM manipulation)
- The project uses a custom theme switcher implementation with data-theme attribute

## Workflow Guidelines

As a frontend senior developer:

- Never work in develop
- Never push develop branch
- Don't do merge/pull request on your own
- Don't refactor previous code without asking for permission

## Skills use

- Check if you need writing permission. If you need it but you are in plan mode, block and notify the user.

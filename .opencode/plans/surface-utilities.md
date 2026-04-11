# Surface Utilities Implementation Plan

## Objective

Refactor the current styling system to implement Tailwind CSS surface utilities (surface-1, surface-2, surface-3) that manage background, border, and dark mode atomically.

## Steps

### 1. Define CSS Tokens (Variables)

- Add `@layer base` block in `src/input.css` with semantic variables
- Create `--bg-surface-n` and `--border-surface-n` variables
- Include values for `:root` and `[data-theme="dark"]` `[data-theme="light"]` selectors
- Ensure incremental contrast between levels (darker to lighter in dark mode)

### 2. Configure Tailwind

- Update `tailwind.config.js`:
  - Enable `darkMode: 'class'`
  - Extend theme to map surface color names so Tailwind generates usable utilities (e.g., `bg-surface-1`)

### 3. Create Utility Abstractions

- Add `@layer components` block with exactly three classes:
  - `.surface-1`: Applies background color, 1px border width, and border color
  - `.surface-2`: Applies background color, 1px border width, and border color
  - `.surface-3`: Applies background color, 1px border width, and border color
- Each class should use `@apply` to combine the utilities

### 4. Refactor Existing Styles

- Replace old custom CSS classes (`background-1`, `background-2`, `background-3`, `border-color-1`, etc.) with new surface utilities
- Apply changes to HTML files in `src/` directory (ignore `tablon-viejo.html`)
- Ensure elements using `<div class="surface-2">` get proper background and border for both light/dark modes

## Files to Modify

- `src/input.css` - Add CSS variables
- `tailwind.config.js` - Configure dark mode and theme extension
- `src/*.html` (excluding tablon-viejo.html) - Replace background/border classes with surface utilities

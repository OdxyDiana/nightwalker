# Refactor Plan: Replace grid-areas with standard grid properties

## Analysis
The current CSS uses named grid areas which we want to replace with standard grid properties.

## Current Implementation
The existing grid system uses named grid areas:
- #post-header with grid-template-areas
- #post-footer with grid-template-areas
- Multiple elements with grid-area properties

## Changes to make in style.css:

1. Replace the grid-template-areas with standard grid-template-columns and grid-template-rows
2. Replace all grid-area properties with grid-column and grid-row properties
3. Keep all other CSS properties the same

## Implementation Plan

1. Update #post-header, #post-footer, and #post-wrapper to use:
   - grid-template-columns: repeat(11, 1fr)
   - Define explicit grid areas with grid-column and grid-row

2. Replace each grid-area with grid-column properties:
   - .post-author-name: grid-column: 1 / 5;
   - .post-author-field.post-field-post: grid-column: 1 / 3;
   - etc.

3. All elements will need explicit grid-column (and possibly grid-row) properties to position them correctly

## Files to modify:
1. src/style.css - Update the grid definitions
2. Possibly update HTML templates to work with the new CSS if needed

## Specific Changes Required:

1. In style.css, replace the current grid-area implementation with grid-column approach:
   - #post-header: grid-column: 1 / -4; grid-row: 1;
   - #post-footer: grid-column: 1 / -3; grid-row: 1;
   - etc.
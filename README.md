# Illuminum Shopify Theme

This repository contains a Shopify theme with frontend assets built using Webpack and Sass.

## Prerequisites

- Node.js (LTS recommended)
- npm
- Shopify CLI (required for local Shopify theme preview)
- Access to the target Shopify store

## Installation

Install project dependencies:

```bash
  npm install
```

## Development

### 1) Watch and rebuild frontend assets

Run Webpack in watch mode:

```bash
  npm run dev
```

This keeps JavaScript and SCSS assets up to date while you work.

### 2) Run Shopify theme preview

Start Shopify theme development server:

```bash
  npm run shop:run
```

This command uses Shopify CLI and serves the theme against the configured store.

## Build Commands

- `npm run build` - production build
- `npm run build:dev` - development build (single run)
- `npm run build:prod` - production build (single run)
- `npm run watch` - Webpack watch mode

## Project Structure (high level)

- `src/js` - JavaScript source files
- `src/scss` - SCSS source files
- `assets`, `sections`, `snippets`, `layout`, `templates`, `config`, `locales` - Shopify theme files

## Notes

- If Shopify CLI is not installed, install it first and authenticate:
  - [Shopify CLI installation guide](https://shopify.dev/docs/apps/tools/cli/installation)
- If the store in `shop:run` script changes, update the script in `package.json`.

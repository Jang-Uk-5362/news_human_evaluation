# News Human Evaluation (React + TypeScript + Vite)

## Local development

- Start backend (default): `http://127.0.0.1:8000`
- Start frontend (default): `http://127.0.0.1:5173`

Frontend uses API base:
- Default: `http://127.0.0.1:8000/api`
- Override with env: `VITE_API_BASE=...`

## GitHub Pages deployment

This project is deployed to:
- https://jang-uk-5362.github.io/news_human_evaluation/

### Important settings

- `vite.config.ts` sets:
  - `base: '/news_human_evaluation/'`

### Deploy

```bash
npm run deploy
```

This will build into `dist/` and publish it to the `gh-pages` branch.

### Backend note

GitHub Pages is static hosting. If `VITE_API_BASE` is not set, the app will still try to call the local backend (`127.0.0.1`).
To use a remote backend, set `VITE_API_BASE` at build time.

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

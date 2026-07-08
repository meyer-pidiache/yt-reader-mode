// Configuration for web-ext — Firefox's official CLI for WebExtensions.
// See: https://extensionworkshop.com/documentation/web-ext/
export default {
  // Source directory (where manifest.json lives)
  sourceDir: '.',
  // Where built artifacts (zip/xpi) and temporary profiles are stored
  artifactsDir: './web-ext-artifacts',
  // Files to exclude from linting, building, and watching
  ignoreFiles: [
    'package.json',
    'pnpm-lock.yaml',
    '.git/**',
    '.github/**',
    '.gitignore',
    '.nvmrc',
    'pnpm-workspace.yaml',
    '.web-ext-config.mjs',
    'vitest.config.js',
    'src/test-setup.js',
    'src/**/__tests__/**',
    'coverage/**',
    'node_modules/**',
    'CONTRIBUTING.md',
    'sonar-project.properties',
    '.agents/**',
    '.kiro/**',
    'skills-lock.json',
  ],
  // Build command defaults
  build: {
    overwriteDest: true,
  },
  // Run command defaults
  run: {
    target: ['firefox-desktop'],
    browserConsole: true,
  },
  // Lint command defaults
  lint: {
    warningsAsErrors: false,
    output: 'text',
  },
};

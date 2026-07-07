import { defineConfig } from 'vitest/config';

export default defineConfig({
  plugins: [
    {
      name: 'inject-esm-exports',
      transform(code, id) {
        if (id.endsWith('/src/core/eventBus.js')) {
          return { code: code + '\nexport { EventBus };', map: null };
        }
        if (id.endsWith('/src/core/stateManager.js')) {
          return { code: code + '\nexport { StateManager };', map: null };
        }
        if (id.endsWith('/src/controllers/readerModeController.js')) {
          return { code: code + '\nexport { ReaderModeController };', map: null };
        }
        if (id.endsWith('/src/services/settingsManager.js')) {
          return { code: code + '\nexport { SettingsManager };', map: null };
        }
        if (id.endsWith('/popup/popup.js')) {
          return { code: code + '\nexport { loadSettings, saveInitialPrompt, DEFAULTS };', map: null };
        }
        return null;
      },
    },
  ],
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/test-setup.js'],
    include: ['src/**/__tests__/**/*.test.js'],
    coverage: {
      reporter: ['text', 'lcov'],
    },
  },
});

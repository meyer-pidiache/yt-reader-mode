import { describe, it, expect, vi, beforeAll, beforeEach } from 'vitest';

const chromeMock = {
  runtime: {
    onInstalled: {
      addListener: vi.fn(),
    },
    getURL: vi.fn((path) => `chrome-extension://abc/${path}`),
    getManifest: vi.fn(() => ({ version: '0.1.0' })),
  },
  storage: {
    sync: {
      set: vi.fn().mockResolvedValue(),
    },
  },
  tabs: {
    create: vi.fn(),
  },
};

vi.stubGlobal('chrome', chromeMock);

let onInstalledHandler;

beforeAll(async () => {
  await import('../background.js');
  onInstalledHandler = chrome.runtime.onInstalled.addListener.mock.calls[0][0];
});

describe('background.js', () => {
  it('registers the onInstalled listener on import', () => {
    expect(chrome.runtime.onInstalled.addListener).toHaveBeenCalledWith(
      expect.any(Function),
    );
  });

  describe('install handler', () => {
    beforeEach(() => {
      vi.clearAllMocks();
    });

    it('opens the welcome page and sets defaults on install', async () => {
      await onInstalledHandler({ reason: 'install' });

      expect(chrome.tabs.create).toHaveBeenCalledWith({
        url: 'chrome-extension://abc/welcome/welcome.html',
      });
      expect(chrome.storage.sync.set).toHaveBeenCalledWith({
        autoActivate: false,
        initialPromptText: '',
      });
    });
  });

  describe('update handler', () => {
    it('logs a debug message on update', () => {
      const consoleSpy = vi.spyOn(console, 'debug').mockImplementation(() => {});

      onInstalledHandler({ reason: 'update', previousVersion: '0.0.9' });

      expect(consoleSpy).toHaveBeenCalledWith(
        'YT Reader Mode updated from 0.0.9 to 0.1.0',
      );
      consoleSpy.mockRestore();
    });
  });
});

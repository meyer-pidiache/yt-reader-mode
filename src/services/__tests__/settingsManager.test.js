import { describe, it, expect, beforeEach, vi } from 'vitest';

// Mock chrome.storage.sync before importing SettingsManager
const mockStorage = {
  autoActivate: true,
  initialPromptEnabled: true,
  initialPromptText: 'Summarize the video'
};

const chromeMock = {
  storage: {
    sync: {
      get: vi.fn().mockResolvedValue(mockStorage),
      set: vi.fn().mockResolvedValue()
    },
    onChanged: {
      addListener: vi.fn()
    }
  }
};

// Stub global chrome before importing
vi.stubGlobal('chrome', chromeMock);

// Import after chrome is mocked
import { SettingsManager } from '../settingsManager.js';

// Mock StateManager.setSettings
const mockSetSettings = vi.fn();

// Stub StateManager.setSettings globally
vi.stubGlobal('StateManager', {
  _state: {
    settings: {
      autoActivate: true,
      initialPromptEnabled: true,
      initialPromptText: 'Summarize the video'
    },
    isActive: false
  },
  setSettings: mockSetSettings,
  setActive: vi.fn()
});

describe('SettingsManager', () => {
  beforeEach(() => {
    // Reset mocks before each test
    vi.clearAllMocks();
  });

  describe('getDefaults()', () => {
    it('returns the default settings object', () => {
      const defaults = SettingsManager.getDefaults();
      expect(defaults).toEqual({
        autoActivate: true,
        initialPromptEnabled: true,
        initialPromptText: 'Summarize the video'
      });
    });

    it('returns a new object (not the same reference)', () => {
      const defaults1 = SettingsManager.getDefaults();
      const defaults2 = SettingsManager.getDefaults();
      expect(defaults1).not.toBe(defaults2);
    });
  });

  describe('load()', () => {
    it('loads settings from chrome.storage.sync and merges with defaults', async () => {
      const loaded = await SettingsManager.load();
      expect(chrome.storage.sync.get).toHaveBeenCalledWith();
      expect(loaded).toEqual(mockStorage);
      expect(StateManager.setSettings).toHaveBeenCalledWith(mockStorage);
    });

    it('uses defaults when storage is empty', async () => {
      chrome.storage.sync.get.mockResolvedValueOnce({});
      
      const loaded = await SettingsManager.load();
      const expected = {
        autoActivate: true,
        initialPromptEnabled: true,
        initialPromptText: 'Summarize the video'
      };
      expect(loaded).toEqual(expected);
      expect(StateManager.setSettings).toHaveBeenCalledWith(expected);
    });

    it('handles storage errors gracefully', async () => {
      chrome.storage.sync.get.mockRejectedValueOnce(new Error('Storage error'));
      
      const loaded = await SettingsManager.load();
      const defaults = {
        autoActivate: true,
        initialPromptEnabled: true,
        initialPromptText: 'Summarize the video'
      };
      expect(loaded).toEqual(defaults);
      expect(StateManager.setSettings).toHaveBeenCalledWith(defaults);
    });
  });

  describe('save()', () => {
    it('saves partial settings and merges with existing storage', async () => {
      const partial = { initialPromptText: 'New prompt' };
      const expected = {
        autoActivate: true,
        initialPromptEnabled: true,
        initialPromptText: 'New prompt'
      };
      
      await SettingsManager.save(partial);
      
      expect(chrome.storage.sync.get).toHaveBeenCalled();
      expect(chrome.storage.sync.set).toHaveBeenCalledWith(expected);
    });

    it('saves settings with defaults when storage is empty', async () => {
      chrome.storage.sync.get.mockResolvedValueOnce({});
      const partial = { autoActivate: false };
      const expected = {
        autoActivate: false,
        initialPromptEnabled: true,
        initialPromptText: 'Summarize the video'
      };
      
      await SettingsManager.save(partial);
      
      expect(chrome.storage.sync.set).toHaveBeenCalledWith(expected);
    });

    it('handles storage errors gracefully', async () => {
      chrome.storage.sync.set.mockRejectedValueOnce(new Error('Storage error'));
      
      await SettingsManager.save({ autoActivate: false });
      
      // Should not throw, just silently fail
      expect(chrome.storage.sync.set).toHaveBeenCalled();
    });
  });

  describe('init()', () => {
    it('registers onChanged listener and calls load()', async () => {
      await SettingsManager.init();
      
      expect(chrome.storage.onChanged.addListener).toHaveBeenCalled();
      // The listener should call load() when sync changes
      const listener = chrome.storage.onChanged.addListener.mock.calls[0][0];
      expect(listener).toBeDefined();
    });

    it('loads settings on init', async () => {
      await SettingsManager.init();
      expect(chrome.storage.sync.get).toHaveBeenCalled();
    });
  });
});

import { describe, it, expect, beforeEach, vi, beforeAll } from 'vitest';

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
    }
  },
  i18n: {
    getMessage: vi.fn((key) => {
      const messages = {
        savedFeedback: 'Saved!',
        savePromptButton: 'Save Prompt',
        defaultPrompt: 'Summarize the video',
        toggleVideoLabel: 'Video',
        toggleReaderLabel: 'Reader'
      };
      return messages[key] || key;
    })
  }
};

vi.stubGlobal('chrome', chromeMock);

let loadSettings;
let saveInitialPrompt;
let DEFAULTS;

beforeAll(async () => {
  document.body.innerHTML = `
    <input type="checkbox" id="autoActivate">
    <input type="checkbox" id="initialPromptEnabled">
    <input type="text" id="initialPromptText">
    <button id="savePrompt">Save Prompt</button>
  `;

  const popup = await import('../../popup/popup.js');
  loadSettings = popup.loadSettings;
  saveInitialPrompt = popup.saveInitialPrompt;
  DEFAULTS = popup.DEFAULTS;
});

describe('Popup DEFAULTS', () => {
  it('has the expected default values', () => {
    expect(DEFAULTS).toEqual({
      autoActivate: true,
      initialPromptEnabled: true,
      initialPromptText: 'Summarize the video'
    });
  });
});

describe('loadSettings()', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    document.getElementById('autoActivate').checked = false;
    document.getElementById('initialPromptEnabled').checked = false;
    document.getElementById('initialPromptText').value = '';
  });

  it('populates controls from storage', async () => {
    const items = {
      autoActivate: true,
      initialPromptEnabled: false,
      initialPromptText: 'My custom prompt'
    };
    chrome.storage.sync.get.mockResolvedValueOnce(items);

    await loadSettings();

    expect(document.getElementById('autoActivate').checked).toBe(true);
    expect(document.getElementById('initialPromptEnabled').checked).toBe(false);
    expect(document.getElementById('initialPromptText').value).toBe('My custom prompt');
  });

  it('falls back to DEFAULTS when storage rejects', async () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    chrome.storage.sync.get.mockRejectedValueOnce(new Error('Storage error'));

    await loadSettings();

    expect(document.getElementById('autoActivate').checked).toBe(true);
    expect(document.getElementById('initialPromptEnabled').checked).toBe(true);
    expect(document.getElementById('initialPromptText').value).toBe('Summarize the video');
    expect(consoleSpy).toHaveBeenCalledWith(
      'Failed to load settings from storage, falling back to defaults',
      expect.any(Error)
    );
    consoleSpy.mockRestore();
  });
});

describe('saveInitialPrompt()', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('saves prompt settings to storage', async () => {
    document.getElementById('initialPromptEnabled').checked = true;
    document.getElementById('initialPromptText').value = 'Test prompt';

    await saveInitialPrompt();

    expect(chrome.storage.sync.set).toHaveBeenCalledWith({
      initialPromptEnabled: true,
      initialPromptText: 'Test prompt'
    });
  });

  it('logs error when storage set fails', async () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    chrome.storage.sync.set.mockRejectedValueOnce(new Error('Write failed'));

    await saveInitialPrompt();

    expect(consoleSpy).toHaveBeenCalledWith('Failed to save prompt settings', expect.any(Error));
    consoleSpy.mockRestore();
  });
});

describe('autoActivate checkbox event', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('saves autoActivate on change', () => {
    const cb = document.getElementById('autoActivate');
    cb.checked = false;
    cb.dispatchEvent(new Event('change'));

    expect(chrome.storage.sync.set).toHaveBeenCalledWith({ autoActivate: false });
  });

  it('logs error when storage set fails', async () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    chrome.storage.sync.set.mockRejectedValueOnce(new Error('Quota exceeded'));
    const cb = document.getElementById('autoActivate');
    cb.checked = true;

    cb.dispatchEvent(new Event('change'));

    await vi.waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith('Failed to save autoActivate setting', expect.any(Error));
    });
    consoleSpy.mockRestore();
  });
});

describe('initialPromptText change event', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('saves text on change', () => {
    const input = document.getElementById('initialPromptText');
    input.value = 'New summary text';
    input.dispatchEvent(new Event('change'));

    expect(chrome.storage.sync.set).toHaveBeenCalledWith({ initialPromptText: 'New summary text' });
  });

  it('logs error when storage set fails', async () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    chrome.storage.sync.set.mockRejectedValueOnce(new Error('Quota exceeded'));
    const input = document.getElementById('initialPromptText');
    input.value = 'test';

    input.dispatchEvent(new Event('change'));

    await vi.waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith('Failed to save initial prompt text', expect.any(Error));
    });
    consoleSpy.mockRestore();
  });
});

describe('initialPromptEnabled change event', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('saves prompt settings via saveInitialPrompt on change', () => {
    document.getElementById('initialPromptEnabled').checked = false;
    document.getElementById('initialPromptText').value = 'test';
    document.getElementById('initialPromptEnabled').dispatchEvent(new Event('change'));

    expect(chrome.storage.sync.set).toHaveBeenCalledWith({
      initialPromptEnabled: false,
      initialPromptText: 'test'
    });
  });
});

describe('savePrompt button click', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('calls saveInitialPrompt and shows feedback', async () => {
    document.getElementById('initialPromptEnabled').checked = true;
    document.getElementById('initialPromptText').value = 'Summarize this';
    const btn = document.getElementById('savePrompt');

    btn.click();

    await vi.waitFor(() => {
      expect(chrome.storage.sync.set).toHaveBeenCalledWith({
        initialPromptEnabled: true,
        initialPromptText: 'Summarize this'
      });
    });

    await vi.waitFor(() => {
      expect(btn.textContent).toBe('Saved!');
    });

    expect(chrome.i18n.getMessage).toHaveBeenCalledWith('savedFeedback');
  });

});

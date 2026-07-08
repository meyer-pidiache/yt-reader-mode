import { describe, it, expect, vi, beforeEach } from 'vitest';

const chromeMock = {
  tabs: {
    getCurrent: vi.fn(),
    remove: vi.fn(),
  },
};

vi.stubGlobal('chrome', chromeMock);

describe('welcome.js', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    document.body.innerHTML = `
      <button id="close-welcome">Get started</button>
    `;
  });

  it('closes the current tab on get-started click', async () => {
    chrome.tabs.getCurrent.mockImplementation((cb) => cb({ id: 42 }));

    await import('../../welcome/welcome.js');

    document.getElementById('close-welcome').click();

    expect(chrome.tabs.getCurrent).toHaveBeenCalled();
    expect(chrome.tabs.remove).toHaveBeenCalledWith(42);
  });

  it('does nothing if tab has no id', async () => {
    chrome.tabs.getCurrent.mockImplementation((cb) => cb({}));

    await import('../../welcome/welcome.js');

    document.getElementById('close-welcome').click();

    expect(chrome.tabs.remove).not.toHaveBeenCalled();
  });
});

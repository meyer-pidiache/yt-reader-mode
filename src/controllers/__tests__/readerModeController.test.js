import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { ReaderModeController } from '../readerModeController.js';

beforeEach(() => {
  EventBus._listeners = {};

  globalThis.PanelManager = {
    triggerAskButton: vi.fn(),
    isPanelLoaded: vi.fn(),
    expand: vi.fn(),
    syncPosition: vi.fn(),
    startResizeObserver: vi.fn(),
    startPanelObserver: vi.fn(),
    sendMessage: vi.fn(),
    clickCloseButton: vi.fn(),
    stopResizeObserver: vi.fn(),
    stopPanelObserver: vi.fn(),
    clearPosition: vi.fn(),
  };

  globalThis.YouTubeFacade = {
    getAppContainer: vi.fn(() => document.createElement('div')),
    getEngagementPanel: vi.fn(),
    getPlayer: vi.fn(),
    getAskButton: vi.fn(),
    getChatTextarea: vi.fn(),
    getChatSendButton: vi.fn(),
  };

  StateManager._state.isActive = false;
  StateManager._state.settings = {
    autoActivate: true,
    initialPromptEnabled: true,
    initialPromptText: 'Summarize the video',
  };
});

afterEach(() => {
  ReaderModeController._clearWaiters();
  vi.useRealTimers();
});

describe('activate()', () => {
  it('does nothing when autoActivate is false', () => {
    StateManager.setSettings({ autoActivate: false });
    ReaderModeController.activate();
    expect(PanelManager.triggerAskButton).not.toHaveBeenCalled();
  });

  it('returns early when the Ask button is not found', () => {
    PanelManager.triggerAskButton.mockReturnValue(false);
    ReaderModeController.activate();
    expect(PanelManager.expand).not.toHaveBeenCalled();
    expect(StateManager.isActive).toBe(false);
  });

  it('completes activation immediately when panel is already loaded', () => {
    PanelManager.triggerAskButton.mockReturnValue(true);
    PanelManager.isPanelLoaded.mockReturnValue(true);
    const video = { pause: vi.fn() };
    YouTubeFacade.getPlayer.mockReturnValue({ querySelector: vi.fn(() => video) });

    ReaderModeController.activate();

    expect(PanelManager.triggerAskButton).toHaveBeenCalledTimes(1);
    expect(PanelManager.expand).toHaveBeenCalled();
    expect(video.pause).toHaveBeenCalled();
    expect(StateManager.isActive).toBe(true);
  });

  it('completes via MutationObserver when panel loads after click', async () => {
    PanelManager.triggerAskButton.mockReturnValue(true);
    PanelManager.isPanelLoaded
      .mockReturnValueOnce(false)
      .mockReturnValueOnce(true);
    const container = document.createElement('div');
    YouTubeFacade.getAppContainer.mockReturnValue(container);
    const video = { pause: vi.fn() };
    YouTubeFacade.getPlayer.mockReturnValue({ querySelector: vi.fn(() => video) });

    ReaderModeController.activate();
    container.appendChild(document.createElement('div'));

    await new Promise(resolve => setTimeout(resolve, 0));

    expect(PanelManager.expand).toHaveBeenCalled();
    expect(StateManager.isActive).toBe(true);
  });
});

describe('polling logic', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    PanelManager.triggerAskButton.mockReturnValue(true);
    YouTubeFacade.getAppContainer.mockReturnValue(document.createElement('div'));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('retries the button click and completes when panel loads on second poll', () => {
    PanelManager.isPanelLoaded
      .mockReturnValueOnce(false)
      .mockReturnValueOnce(false)
      .mockReturnValueOnce(true);
    const video = { pause: vi.fn() };
    YouTubeFacade.getPlayer.mockReturnValue({ querySelector: vi.fn(() => video) });

    ReaderModeController.activate();

    vi.advanceTimersByTime(2000);
    expect(PanelManager.triggerAskButton).toHaveBeenCalledTimes(2);

    vi.advanceTimersByTime(2000);
    expect(PanelManager.triggerAskButton).toHaveBeenCalledTimes(2);
    expect(PanelManager.expand).toHaveBeenCalled();
    expect(StateManager.isActive).toBe(true);
  });

  it('stops polling after max retries when panel never loads', () => {
    PanelManager.isPanelLoaded.mockReturnValue(false);

    ReaderModeController.activate();

    vi.advanceTimersByTime(2000);
    vi.advanceTimersByTime(2000);
    vi.advanceTimersByTime(2000);

    expect(PanelManager.triggerAskButton).toHaveBeenCalledTimes(4);
    expect(StateManager.isActive).toBe(false);

    vi.advanceTimersByTime(2000);
    expect(PanelManager.triggerAskButton).toHaveBeenCalledTimes(4);
  });

  it('stops polling if activation happens externally during retries', () => {
    PanelManager.isPanelLoaded.mockReturnValue(false);

    ReaderModeController.activate();

    vi.advanceTimersByTime(2000);
    expect(PanelManager.triggerAskButton).toHaveBeenCalledTimes(2);

    StateManager.setActive(true);

    vi.advanceTimersByTime(2000);
    expect(PanelManager.triggerAskButton).toHaveBeenCalledTimes(2);
  });
});

describe('activateManual()', () => {
  it('triggers activation regardless of autoActivate setting', () => {
    StateManager.setSettings({ autoActivate: false });
    PanelManager.triggerAskButton.mockReturnValue(true);
    PanelManager.isPanelLoaded.mockReturnValue(true);
    const video = { pause: vi.fn() };
    YouTubeFacade.getPlayer.mockReturnValue({ querySelector: vi.fn(() => video) });

    ReaderModeController.activateManual();

    expect(PanelManager.triggerAskButton).toHaveBeenCalled();
    expect(PanelManager.expand).toHaveBeenCalled();
    expect(StateManager.isActive).toBe(true);
  });
});

describe('deactivate()', () => {
  it('removes reader mode and clears state', () => {
    PanelManager.triggerAskButton.mockReturnValue(true);
    PanelManager.isPanelLoaded.mockReturnValue(true);
    const video = { pause: vi.fn() };
    YouTubeFacade.getPlayer.mockReturnValue({ querySelector: vi.fn(() => video) });
    ReaderModeController.activate();
    expect(StateManager.isActive).toBe(true);

    ReaderModeController.deactivate();

    expect(PanelManager.clickCloseButton).toHaveBeenCalled();
    expect(StateManager.isActive).toBe(false);
    expect(document.body.classList.contains('yt-reader-mode')).toBe(false);
  });

  it('does nothing if already inactive', () => {
    ReaderModeController.deactivate();
    expect(PanelManager.clickCloseButton).not.toHaveBeenCalled();
  });
});

describe('toggle()', () => {
  it('activates when inactive', () => {
    PanelManager.triggerAskButton.mockReturnValue(true);
    PanelManager.isPanelLoaded.mockReturnValue(true);
    const video = { pause: vi.fn() };
    YouTubeFacade.getPlayer.mockReturnValue({ querySelector: vi.fn(() => video) });

    ReaderModeController.toggle();

    expect(StateManager.isActive).toBe(true);
  });

  it('deactivates when active', () => {
    PanelManager.triggerAskButton.mockReturnValue(true);
    PanelManager.isPanelLoaded.mockReturnValue(true);
    const video = { pause: vi.fn() };
    YouTubeFacade.getPlayer.mockReturnValue({ querySelector: vi.fn(() => video) });
    ReaderModeController.toggle();
    expect(StateManager.isActive).toBe(true);

    ReaderModeController.toggle();
    expect(StateManager.isActive).toBe(false);
  });
});

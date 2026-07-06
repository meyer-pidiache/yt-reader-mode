import { describe, it, expect, beforeEach } from 'vitest';

beforeEach(() => {
  EventBus._listeners = {};
  StateManager._state.isActive = false;
  StateManager._state.settings = {
    autoActivate: true,
    initialPromptEnabled: true,
    initialPromptText: 'Summarize the video',
  };
});

describe('StateManager.isActive', () => {
  it('defaults to false', () => {
    expect(StateManager.isActive).toBe(false);
  });

  it('returns true after setActive(true)', () => {
    StateManager.setActive(true);
    expect(StateManager.isActive).toBe(true);
  });
});

describe('StateManager.setActive()', () => {
  it('emits STATE_CHANGED with the new state', () => {
    const events = [];
    EventBus.on('STATE_CHANGED', (p) => events.push(p));
    StateManager.setActive(true);
    expect(events).toEqual([{ isActive: true }]);
  });

  it('emits STATE_CHANGED when deactivating', () => {
    StateManager.setActive(true);
    const events = [];
    EventBus.on('STATE_CHANGED', (p) => events.push(p));
    StateManager.setActive(false);
    expect(events).toEqual([{ isActive: false }]);
  });

  it('does NOT emit when state does not change', () => {
    const events = [];
    EventBus.on('STATE_CHANGED', (p) => events.push(p));
    StateManager.setActive(false);
    StateManager.setActive(false);
    expect(events).toHaveLength(0);
  });
});

describe('StateManager.settings', () => {
  it('returns the current settings object', () => {
    expect(StateManager.settings).toEqual({
      autoActivate: true,
      initialPromptEnabled: true,
      initialPromptText: 'Summarize the video',
    });
  });
});

describe('StateManager.setSettings()', () => {
  it('merges new settings into existing ones', () => {
    StateManager.setSettings({ autoActivate: false });
    expect(StateManager.settings.autoActivate).toBe(false);
    expect(StateManager.settings.initialPromptText).toBe('Summarize the video');
  });

  it('does not mutate the previous settings object', () => {
    const before = StateManager.settings;
    StateManager.setSettings({ autoActivate: false });
    expect(before.autoActivate).toBe(true);
  });

  it('emits SETTINGS_CHANGED with the merged settings', () => {
    const events = [];
    EventBus.on('SETTINGS_CHANGED', (p) => events.push(p));
    StateManager.setSettings({ initialPromptText: 'New text' });
    expect(events).toHaveLength(1);
    expect(events[0].initialPromptText).toBe('New text');
    expect(events[0].autoActivate).toBe(true);
  });
});

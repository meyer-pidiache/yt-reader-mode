import { describe, it, expect, vi, beforeAll } from 'vitest';

const mockInit = vi.fn().mockResolvedValue(undefined);

vi.stubGlobal('SettingsManager', { init: mockInit });

let emitSpy;
beforeAll(() => {
  emitSpy = vi.spyOn(EventBus, 'emit');
});

beforeAll(async () => {
  await import('../content.js');
});

describe('content.js init flow', () => {
  it('calls SettingsManager.init() then emits APP_INIT', async () => {
    await vi.waitFor(() => {
      expect(mockInit).toHaveBeenCalled();
    });
    await vi.waitFor(() => {
      expect(EventBus.emit).toHaveBeenCalledWith('APP_INIT');
    });
  });
});

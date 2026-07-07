import { describe, it, expect, vi, beforeAll } from 'vitest';

const mockInit = vi.fn().mockResolvedValue(undefined);

vi.stubGlobal('SettingsManager', { init: mockInit });

beforeAll(async () => {
  await import('../content.js');
});

describe('content.js init flow', () => {
  it('calls SettingsManager.init() then emits APP_INIT', async () => {
    await vi.waitFor(() => {
      expect(mockInit).toHaveBeenCalled();
    });
  });
});

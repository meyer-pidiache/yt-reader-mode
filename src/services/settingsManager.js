const SettingsManager = {
  _defaults: {
    autoActivate: true,
    initialPromptEnabled: true,
    initialPromptText: 'Summarize the video'
  },

  getDefaults() {
    return { ...this._defaults };
  },

  async load() {
    try {
      const items = await chrome.storage.sync.get();
      const settings = items && typeof items === 'object'
        ? { ...this._defaults, ...items }
        : { ...this._defaults };
      StateManager.setSettings(settings);
      return settings;
    } catch {
      StateManager.setSettings({ ...this._defaults });
      return { ...this._defaults };
    }
  },

  async save(partial) {
    try {
      const current = await chrome.storage.sync.get();
      const merged = { ...this._defaults, ...current, ...partial };
      await chrome.storage.sync.set(merged);
    } catch {}
  },

  init() {
    this.load();
    chrome.storage.onChanged.addListener((_, areaName) => {
      if (areaName === 'sync') {
        this.load();
      }
    });
  }
};

EventBus.on('APP_INIT', () => SettingsManager.init());

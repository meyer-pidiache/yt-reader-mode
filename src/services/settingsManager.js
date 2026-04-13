const SettingsManager = {
  _defaults: {
    autoActivate: true,
    initialPromptEnabled: true,
    initialPromptText: 'Summarize the video'
  },

  getDefaults() {
    return { ...this._defaults };
  },

  load() {
    return new Promise((resolve) => {
      try {
        chrome.storage.sync.get((items) => {
          let settings = this._defaults;
          if (!chrome.runtime.lastError && items && typeof items === 'object') {
            settings = { ...this._defaults, ...items };
          }
          StateManager.setSettings(settings);
          resolve(settings);
        });
      } catch (e) {
        StateManager.setSettings(this._defaults);
        resolve(this._defaults);
      }
    });
  },

  save(partial) {
    return new Promise((resolve) => {
      try {
        chrome.storage.sync.get((current) => {
          const merged = { ...this._defaults, ...current, ...partial };
          chrome.storage.sync.set(merged, resolve);
        });
      } catch (e) {
        resolve();
      }
    });
  },

  init() {
    this.load();
    chrome.storage.onChanged.addListener((changes, areaName) => {
      if (areaName === 'sync') {
        chrome.storage.sync.get((items) => {
          const settings = { ...this._defaults, ...items };
          StateManager.setSettings(settings);
        });
      }
    });
  }
};

EventBus.on('APP_INIT', () => SettingsManager.init());

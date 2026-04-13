const StateManager = {
  _state: {
    isActive: false,
    settings: {
      autoActivate: true,
      initialPromptEnabled: true,
      initialPromptText: 'Summarize the video'
    }
  },

  get isActive() {
    return this._state.isActive;
  },

  get settings() {
    return this._state.settings;
  },

  setSettings(newSettings) {
    this._state.settings = Object.assign({}, this._state.settings, newSettings);
    EventBus.emit('SETTINGS_CHANGED', this._state.settings);
  },

  setActive(isActive) {
    if (this._state.isActive === isActive) return;
    this._state.isActive = isActive;
    EventBus.emit('STATE_CHANGED', { isActive: this._state.isActive });
  }
};

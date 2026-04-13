const NavigationWatcher = {
  _listener: null,

  start() {
    this.stop();
    this._listener = () => {
      EventBus.emit('NAVIGATE_FINISH');
    };
    window.addEventListener('yt-navigate-finish', this._listener);
  },

  stop() {
    if (this._listener) {
      window.removeEventListener('yt-navigate-finish', this._listener);
      this._listener = null;
    }
  }
};

EventBus.on('APP_INIT', () => NavigationWatcher.start());

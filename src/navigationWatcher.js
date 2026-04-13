(function (global) {
  'use strict';

  var NavigationWatcher = {
    _listener: null,
    _reinitTimeout: null,

    start: function () {
      this.stop();

      this._listener = function () {
        ReaderModeController.deactivate();

        if (this._reinitTimeout) {
          clearTimeout(this._reinitTimeout);
        }

        this._reinitTimeout = setTimeout(function () {
          StyleManager.inject();
          ToggleButton.inject();
          ReaderModeController.activate();
        }, 500);
      }.bind(this);

      window.addEventListener('yt-navigate-finish', this._listener);
    },

    stop: function () {
      if (this._listener) {
        window.removeEventListener('yt-navigate-finish', this._listener);
        this._listener = null;
      }

      if (this._reinitTimeout) {
        clearTimeout(this._reinitTimeout);
        this._reinitTimeout = null;
      }
    }
  };

  global.NavigationWatcher = NavigationWatcher;
})(window);

(function (global) {
  'use strict';

  var ReaderModeController = {
    isActive: false,
    _pollInterval: null,
    _pollAttempts: 0,
    _maxAttempts: 25,
    _pollIntervalMs: 200,

    activate: function () {
      var self = this;
      SettingsManager.load().then(function (settings) {
        if (!settings.autoActivate) {
          return;
        }
        self._activateInternal();
      });
    },

    activateManual: function () {
      this._activateInternal();
    },

    _activateInternal: function () {
      var self = this;
      this._pollAttempts = 0;

      if (!PanelManager.triggerAskButton()) {
        return;
      }

      var poll = function () {
        if (self.isActive) return;

        self._pollAttempts++;

        if (PanelManager.isPanelLoaded()) {
          self._completeActivation();
        } else if (self._pollAttempts >= self._maxAttempts) {
          self._pollAttempts = 0;
        } else {
          self._pollInterval = setTimeout(poll, self._pollIntervalMs);
        }
      };

      setTimeout(poll, 100);
    },

    _completeActivation: function () {
      var video = document.querySelector('video');
      if (video) {
        video.pause();
      }

      PanelManager.expand();
      document.body.classList.add('yt-reader-mode');
      this.isActive = true;
      PanelManager.syncPosition();
      PanelManager.startResizeObserver();
      PanelManager.startPanelObserver(function () {
        this.deactivate();
      }.bind(this));
      ToggleButton.update(true);

      var self = this;
      SettingsManager.load().then(function (settings) {
        if (settings.initialPromptEnabled && settings.initialPromptText) {
          setTimeout(function () {
            PanelManager.sendMessage(settings.initialPromptText);
          }, 500);
        }
      });
    },

    deactivate: function () {
      if (!this.isActive) return;

      this._clearPoll();

      document.body.classList.remove('yt-reader-mode');
      PanelManager.clearPosition();
      PanelManager.stopResizeObserver();
      PanelManager.stopPanelObserver();
      PanelManager.clickCloseButton();

      this.isActive = false;
      ToggleButton.update(false);
    },

    toggle: function () {
      if (this.isActive) {
        this.deactivate();
      } else {
        this.activateManual();
      }
    },

    _clearPoll: function () {
      if (this._pollInterval) {
        clearTimeout(this._pollInterval);
        this._pollInterval = null;
      }
      this._pollAttempts = 0;
    }
  };

  global.ReaderModeController = ReaderModeController;
})(window);

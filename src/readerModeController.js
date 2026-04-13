(function (global) {
  'use strict';

  var ReaderModeController = {
    isActive: false,
    _activationObserver: null,
    _activationTimeout: null,
    _maxWaitMs: 10000,

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

      if (!PanelManager.triggerAskButton()) {
        return;
      }

      if (PanelManager.isPanelLoaded()) {
        this._completeActivation();
        return;
      }

      this._clearWaiters();

      var targetNode = document.querySelector('ytd-app') || document.body;

      this._activationObserver = new MutationObserver(function (mutations, obs) {
        if (self.isActive) {
          self._clearWaiters();
          return;
        }
        if (PanelManager.isPanelLoaded()) {
          self._clearWaiters();
          self._completeActivation();
        }
      });

      this._activationObserver.observe(targetNode, { childList: true, subtree: true });

      this._activationTimeout = setTimeout(function () {
        self._clearWaiters();
      }, this._maxWaitMs);
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

      this._clearWaiters();

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

    _clearWaiters: function () {
      if (this._activationObserver) {
        this._activationObserver.disconnect();
        this._activationObserver = null;
      }
      if (this._activationTimeout) {
        clearTimeout(this._activationTimeout);
        this._activationTimeout = null;
      }
    }
  };

  global.ReaderModeController = ReaderModeController;
})(window);

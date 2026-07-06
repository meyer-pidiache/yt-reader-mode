const ReaderModeController = {
  _activationObserver: null,
  _activationTimeout: null,

  _clearWaiters() {
    if (this._activationObserver) {
      this._activationObserver.disconnect();
      this._activationObserver = null;
    }
    if (this._activationTimeout) {
      clearTimeout(this._activationTimeout);
      this._activationTimeout = null;
    }
  },

  activate() {
    if (StateManager.settings.autoActivate) {
      this._activateInternal();
    }
  },

  activateManual() {
    this._activateInternal();
  },

  _activateInternal() {
    if (!PanelManager.triggerAskButton()) {
      return;
    }

    if (PanelManager.isPanelLoaded()) {
      this._completeActivation();
      return;
    }

    this._clearWaiters();

    const targetNode = YouTubeFacade.getAppContainer();

    this._activationObserver = new MutationObserver(() => {
      this._tryComplete();
    });
    this._activationObserver.observe(targetNode, { childList: true, subtree: true });

    let retries = 0;
    const maxRetries = 3;
    const poll = () => {
      if (this._tryComplete()) return;
      if (retries < maxRetries) {
        retries++;
        if (!PanelManager.triggerAskButton()) {
          this._clearWaiters();
          return;
        }
        this._activationTimeout = setTimeout(poll, 2000);
        return;
      }
      this._clearWaiters();
    };

    this._activationTimeout = setTimeout(poll, 2000);
  },

  _tryComplete() {
    if (StateManager.isActive) {
      this._clearWaiters();
      return true;
    }
    if (PanelManager.isPanelLoaded()) {
      this._clearWaiters();
      this._completeActivation();
      return true;
    }
    return false;
  },

  _completeActivation() {
    const player = YouTubeFacade.getPlayer();
    if (player) {
      const video = player.querySelector('video');
      if (video) video.pause();
    }

    PanelManager.expand();
    document.body.classList.add('yt-reader-mode');

    StateManager.setActive(true);

    PanelManager.syncPosition();
    PanelManager.startResizeObserver();
    PanelManager.startPanelObserver();

    if (StateManager.settings.initialPromptEnabled && StateManager.settings.initialPromptText) {
      setTimeout(() => {
        PanelManager.sendMessage(StateManager.settings.initialPromptText);
      }, 500);
    }
  },

  deactivate() {
    if (!StateManager.isActive) return;

    this._clearWaiters();

    document.body.classList.remove('yt-reader-mode');
    PanelManager.clearPosition();
    PanelManager.stopResizeObserver();
    PanelManager.stopPanelObserver();
    PanelManager.clickCloseButton();

    StateManager.setActive(false);
  },

  toggle() {
    if (StateManager.isActive) {
      this.deactivate();
    } else {
      this.activateManual();
    }
  }
};

EventBus.on('APP_INIT', () => ReaderModeController.activate());
EventBus.on('TOGGLE_REQUESTED', () => ReaderModeController.toggle());
EventBus.on('PANEL_CLOSED_BY_USER', () => ReaderModeController.deactivate());
EventBus.on('NAVIGATE_FINISH', () => {
  ReaderModeController.deactivate();
  setTimeout(() => {
    EventBus.emit('APP_INIT');
  }, 500);
});

const PanelManager = {
  _resizeObserver: null,
  _panelObserver: null,
  _timestampListener: null,

  isPanelLoaded() {
    const panel = YouTubeFacade.getEngagementPanel();
    if (!panel) return false;
    const textarea = YouTubeFacade.getChatTextarea();
    return textarea !== null;
  },

  triggerAskButton() {
    const askBtn = YouTubeFacade.getAskButton();
    if (askBtn) {
      askBtn.click();
      return true;
    }
    return false;
  },

  expand() {
    const panel = YouTubeFacade.getEngagementPanel();
    if (!panel) return;
    panel.setAttribute('visibility', 'ENGAGEMENT_PANEL_VISIBILITY_EXPANDED');
  },

  syncPosition() {
    const player = YouTubeFacade.getPlayer();
    if (!player) return;

    const rect = player.getBoundingClientRect();
    if (rect.width === 0) return;

    const panel = YouTubeFacade.getEngagementPanel();
    if (!panel) return;

    const scrollX = window.pageXOffset || document.documentElement.scrollLeft;
    const scrollY = window.pageYOffset || document.documentElement.scrollTop;

    panel.style.top = (rect.top + scrollY) + 'px';
    panel.style.left = (rect.left + scrollX) + 'px';
    panel.style.width = rect.width + 'px';
    panel.style.height = rect.height + 'px';
  },

  clearPosition() {
    const panel = YouTubeFacade.getEngagementPanel();
    if (!panel) return;
    panel.style.top = '';
    panel.style.left = '';
    panel.style.width = '';
    panel.style.height = '';
  },

  startResizeObserver() {
    const player = YouTubeFacade.getPlayer();
    if (!player) return;

    this.stopResizeObserver();

    this._resizeObserver = new ResizeObserver(() => {
      this.syncPosition();
    });

    this._resizeObserver.observe(player);
  },

  stopResizeObserver() {
    if (this._resizeObserver) {
      this._resizeObserver.disconnect();
      this._resizeObserver = null;
    }
  },

  startPanelObserver() {
    const panel = YouTubeFacade.getEngagementPanel();
    if (!panel) return;

    this.stopPanelObserver();

    this._timestampListener = (e) => {
      if (YouTubeFacade.isTimestamp(e.target)) {
        EventBus.emit('PANEL_CLOSED_BY_USER');
      }
    };
    panel.addEventListener('click', this._timestampListener);

    this._panelObserver = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'attributes' && mutation.attributeName === 'visibility') {
          const visibility = panel.getAttribute('visibility');
          if (visibility !== 'ENGAGEMENT_PANEL_VISIBILITY_EXPANDED') {
            EventBus.emit('PANEL_CLOSED_BY_USER');
          }
        }
      });
    });

    this._panelObserver.observe(panel, { attributes: true });
  },

  stopPanelObserver() {
    const panel = YouTubeFacade.getEngagementPanel();
    if (panel && this._timestampListener) {
      panel.removeEventListener('click', this._timestampListener);
    }
    this._timestampListener = null;

    if (this._panelObserver) {
      this._panelObserver.disconnect();
      this._panelObserver = null;
    }
  },

  clickCloseButton() {
    const panel = YouTubeFacade.getEngagementPanel();
    if (!panel) return;

    let closeBtn = panel.querySelector('button#close-button') || panel.querySelector('[aria-label="Close"]');
    if (closeBtn) {
      closeBtn.click();
    }
  },

  sendMessage(text) {
    const textarea = YouTubeFacade.getChatTextarea();
    const button = YouTubeFacade.getChatSendButton();
    if (textarea && button) {
      textarea.value = text;
      textarea.dispatchEvent(new Event('input', { bubbles: true, composed: true }));
      textarea.dispatchEvent(new Event('change', { bubbles: true, composed: true }));
      textarea.dispatchEvent(new Event('keyup', { bubbles: true, composed: true }));
      setTimeout(() => {
        if (!button.disabled) {
          button.click();
        }
      }, 100);
    }
  }
};

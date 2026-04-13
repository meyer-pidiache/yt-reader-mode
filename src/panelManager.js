(function (global) {
  'use strict';

  var PanelManager = {
    _resizeObserver: null,
    _panelObserver: null,
    _panelObserverCallback: null,
    _scrollTimeout: null,
    _timestampListener: null,

    getPanel: function () {
      return document.querySelector('ytd-engagement-panel-section-list-renderer[target-id="PAyouchat"]');
    },

    isPanelLoaded: function () {
      var panel = this.getPanel();
      if (!panel) return false;
      return panel.querySelector('textarea') !== null;
    },

    triggerAskButton: function () {
      var askBtn = document.querySelector('.you-chat-entrypoint-button button');
      if (askBtn) {
        askBtn.click();
        return true;
      }
      return false;
    },

    expand: function () {
      var panel = this.getPanel();
      if (!panel) return;
      panel.setAttribute('visibility', 'ENGAGEMENT_PANEL_VISIBILITY_EXPANDED');
    },

    syncPosition: function () {
      var player = document.getElementById('player');
      if (!player) return;

      var rect = player.getBoundingClientRect();
      if (rect.width === 0) return;

      var panel = this.getPanel();
      if (!panel) return;

      var scrollX = window.pageXOffset || document.documentElement.scrollLeft;
      var scrollY = window.pageYOffset || document.documentElement.scrollTop;

      panel.style.top = (rect.top + scrollY) + 'px';
      panel.style.left = (rect.left + scrollX) + 'px';
      panel.style.width = rect.width + 'px';
      panel.style.height = rect.height + 'px';
    },

    clearPosition: function () {
      var panel = this.getPanel();
      if (!panel) return;
      panel.style.top = '';
      panel.style.left = '';
      panel.style.width = '';
      panel.style.height = '';
    },

    startResizeObserver: function () {
      var player = document.getElementById('player');
      if (!player) return;

      this.stopResizeObserver();

      this._resizeObserver = new ResizeObserver(function () {
        this.syncPosition();
      }.bind(this));

      this._resizeObserver.observe(player);
    },

    stopResizeObserver: function () {
      if (this._resizeObserver) {
        this._resizeObserver.disconnect();
        this._resizeObserver = null;
      }
    },

    startPanelObserver: function (onClose) {
      var panel = this.getPanel();
      if (!panel) return;

      this.stopPanelObserver();
      this._panelObserverCallback = onClose;

      this._timestampListener = function(e) {
        if (e.target && e.target.classList && e.target.classList.contains('ytwMarkdownDivTimestamp')) {
          if (this._panelObserverCallback) {
            this._panelObserverCallback();
          }
        }
      }.bind(this);
      panel.addEventListener('click', this._timestampListener);

      this._panelObserver = new MutationObserver(function (mutations) {
        mutations.forEach(function (mutation) {
          if (mutation.type === 'attributes' && mutation.attributeName === 'visibility') {
            var visibility = panel.getAttribute('visibility');
            if (visibility !== 'ENGAGEMENT_PANEL_VISIBILITY_EXPANDED') {
              if (this._panelObserverCallback) {
                this._panelObserverCallback();
              }
            }
          }
        }.bind(this));
      }.bind(this));

      this._panelObserver.observe(panel, { attributes: true });
    },

    stopPanelObserver: function () {
      var panel = this.getPanel();
      if (panel && this._timestampListener) {
        panel.removeEventListener('click', this._timestampListener);
      }
      this._timestampListener = null;

      if (this._panelObserver) {
        this._panelObserver.disconnect();
        this._panelObserver = null;
      }
      this._panelObserverCallback = null;
    },

    clickCloseButton: function () {
      var panel = this.getPanel();
      if (!panel) return;

      var closeBtn = panel.querySelector('button#close-button');
      if (!closeBtn) {
        closeBtn = panel.querySelector('[aria-label="Close"]');
      }
      if (closeBtn) {
        closeBtn.click();
      }
    },

    sendMessage: function (text) {
      var textarea = document.querySelector('yt-chat-input-view-model textarea.chatInputViewModelChatInput');
      var button = document.querySelector('yt-chat-input-view-model button[aria-label="Send"]');
      if (textarea && button) {
        textarea.innerText = text;
        textarea.dispatchEvent(new Event('input', { bubbles: true, composed: true }));
        textarea.dispatchEvent(new Event('change', { bubbles: true, composed: true }));
        textarea.dispatchEvent(new Event('keyup', { bubbles: true, composed: true }));
        setTimeout(function() {
          if (!button.disabled) {
            button.click();
          }
        }, 100);
      }
    }
  };

  global.PanelManager = PanelManager;
})(window);

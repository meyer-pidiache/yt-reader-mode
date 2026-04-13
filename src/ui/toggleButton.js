const ToggleButton = {
  _button: null,
  _visibilityObserver: null,
  _bookIcon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M18 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zM6 4h5v8l-2.5-1.5L6 12V4z"/></svg>',
  _playIcon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>',

  inject() {
    this.remove();

    const container = document.querySelector('#actions #menu ytd-menu-renderer #flexible-item-buttons');
    if (!container) return;

    this._button = document.createElement('yt-button-view-model');
    this._button.className = 'ytd-menu-renderer';
    this._button.style.display = 'none';
    this._button.innerHTML = '<button-view-model class="ytSpecButtonViewModelHost"><button class="yt-spec-button-shape-next yt-spec-button-shape-next--tonal yt-spec-button-shape-next--mono yt-spec-button-shape-next--size-m yt-spec-button-shape-next--icon-leading yt-spec-button-shape-next--enable-backdrop-filter-experiment" id="yt-reader-toggle"><div aria-hidden="true" class="yt-spec-button-shape-next__icon"><span class="ytIconWrapperHost" style="width: 24px; height: 24px;"><span class="yt-icon-shape ytSpecIconShapeHost" id="yt-reader-icon"></span></span></div><div class="yt-spec-button-shape-next__button-text-content" id="yt-reader-label"></div></button></button-view-model>';

    const btn = this._button.querySelector('#yt-reader-toggle');
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      EventBus.emit('TOGGLE_REQUESTED');
    });

    container.insertBefore(this._button, container.firstChild);

    this.update({ isActive: StateManager.isActive });
    this._checkVisibility();
  },

  _checkVisibility() {
    if (this._visibilityObserver) {
      this._visibilityObserver.disconnect();
    }

    const targetNode = YouTubeFacade.getAppContainer();
    const check = () => {
      const askBtn = YouTubeFacade.getAskButton();
      if (askBtn && this._button) {
        this._button.style.display = '';
        if (this._visibilityObserver) {
          this._visibilityObserver.disconnect();
          this._visibilityObserver = null;
        }
      }
    };

    check();

    this._visibilityObserver = new MutationObserver(check);
    this._visibilityObserver.observe(targetNode, { childList: true, subtree: true });
  },

  remove() {
    if (this._visibilityObserver) {
      this._visibilityObserver.disconnect();
      this._visibilityObserver = null;
    }
    if (this._button && this._button.parentNode) {
      this._button.parentNode.removeChild(this._button);
      this._button = null;
    }
  },

  update({ isActive }) {
    if (!this._button) return;

    const icon = this._button.querySelector('#yt-reader-icon');
    const label = this._button.querySelector('#yt-reader-label');

    if (isActive) {
      icon.innerHTML = this._playIcon;
      label.textContent = 'Video';
    } else {
      icon.innerHTML = this._bookIcon;
      label.textContent = 'Reader';
    }
  }
};

EventBus.on('APP_INIT', () => ToggleButton.inject());
EventBus.on('STATE_CHANGED', (state) => ToggleButton.update(state));

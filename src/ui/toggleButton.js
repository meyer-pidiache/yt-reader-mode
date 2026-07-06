const ToggleButton = {
  _button: null,
  _visibilityObserver: null,
  _icons: null,

  _buildIcon(pathD) {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('viewBox', '0 0 24 24');
    svg.setAttribute('fill', 'currentColor');
    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path.setAttribute('d', pathD);
    svg.appendChild(path);
    return svg;
  },

  inject() {
    this.remove();

    if (!this._icons) {
      this._icons = {
        book: this._buildIcon('M18 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zM6 4h5v8l-2.5-1.5L6 12V4z'),
        play: this._buildIcon('M8 5v14l11-7z'),
      };
    }

    const container = document.querySelector('#actions #menu ytd-menu-renderer #flexible-item-buttons');
    if (!container) return;

    const template = container.querySelector('yt-button-view-model, button-view-model');
    if (template) {
      this._button = template.cloneNode(true);
      this._button.style.display = 'none';
      this._button.className = 'ytd-menu-renderer';

      const existingIds = this._button.querySelectorAll('[id]');
      for (const el of existingIds) el.removeAttribute('id');
    } else {
      this._button = document.createElement('yt-button-view-model');
      this._button.className = 'ytd-menu-renderer';
      this._button.style.display = 'none';
      const vm = document.createElement('button-view-model');
      const btn = document.createElement('button');
      btn.id = 'yt-reader-toggle';
      btn.style.cssText = 'display:inline-flex;align-items:center;gap:6px;padding:0 12px;height:36px;border:none;border-radius:18px;cursor:pointer;color:inherit;background:transparent';
      const ico = document.createElement('div');
      ico.innerHTML = '<span class="ytIconWrapperHost" style="width:24px;height:24px"><span class="yt-icon-shape ytSpecIconShapeHost" id="yt-reader-icon"></span></span>';
      const lbl = document.createElement('div');
      lbl.id = 'yt-reader-label';
      btn.append(ico, lbl);
      vm.append(btn);
      this._button.append(vm);
    }

    const btn = this._button.querySelector('button');
    if (!btn) {
      this._button = null;
      return;
    }
    btn.id = 'yt-reader-toggle';

    const iconSlot = btn.querySelector('[class*="icon" i], [class*="Icon" i]');
    if (iconSlot) {
      iconSlot.innerHTML = '';
      const wrapper = document.createElement('span');
      wrapper.className = 'ytIconWrapperHost';
      wrapper.style.cssText = 'width:24px;height:24px';
      const shape = document.createElement('span');
      shape.className = 'yt-icon-shape ytSpecIconShapeHost';
      shape.id = 'yt-reader-icon';
      wrapper.append(shape);
      iconSlot.append(wrapper);
    }

    const labelSlot = btn.querySelector('[class*="text-content" i], [class*="TextContent" i], [class*="label" i]');
    if (labelSlot) {
      labelSlot.id = 'yt-reader-label';
      labelSlot.textContent = '';
    }

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
    if (this._button) {
      if (this._button.parentNode) {
        this._button.parentNode.removeChild(this._button);
      }
      this._button = null;
    }
  },

  update({ isActive }) {
    if (!this._button) return;

    const icon = this._button.querySelector('#yt-reader-icon');
    const label = this._button.querySelector('#yt-reader-label');

    if (!icon || !label) return;

    if (isActive) {
      icon.replaceChildren(this._icons.play);
      label.textContent = 'Video';
    } else {
      icon.replaceChildren(this._icons.book);
      label.textContent = 'Reader';
    }
  }
};

EventBus.on('APP_INIT', () => ToggleButton.inject());
EventBus.on('STATE_CHANGED', (state) => ToggleButton.update(state));

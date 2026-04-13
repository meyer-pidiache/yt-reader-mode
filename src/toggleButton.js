(function (global) {
  'use strict';

  var ToggleButton = {
    _button: null,
    _css: [
      '#yt-reader-toggle {',
      '  display: inline-flex;',
      '  align-items: center;',
      '  gap: 6px;',
      '}',
      '',
      '#yt-reader-toggle svg {',
      '  width: 24px;',
      '  height: 24px;',
      '  flex-shrink: 0;',
      '}'
    ].join('\n'),

    _bookIcon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M18 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zM6 4h5v8l-2.5-1.5L6 12V4z"/></svg>',
    _playIcon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>',

    inject: function () {
      this.remove();

      var style = document.createElement('style');
      style.textContent = this._css;
      document.head.appendChild(style);

      var container = document.querySelector('#actions #menu ytd-menu-renderer #flexible-item-buttons');
      if (!container) return;

      this._button = document.createElement('yt-button-view-model');
      this._button.className = 'ytd-menu-renderer';
      this._button.innerHTML = '<button-view-model class="ytSpecButtonViewModelHost"><button class="yt-spec-button-shape-next yt-spec-button-shape-next--tonal yt-spec-button-shape-next--mono yt-spec-button-shape-next--size-m yt-spec-button-shape-next--icon-leading yt-spec-button-shape-next--enable-backdrop-filter-experiment" id="yt-reader-toggle"><div aria-hidden="true" class="yt-spec-button-shape-next__icon"><span class="ytIconWrapperHost" style="width: 24px; height: 24px;"><span class="yt-icon-shape ytSpecIconShapeHost" id="yt-reader-icon"></span></span></div><div class="yt-spec-button-shape-next__button-text-content" id="yt-reader-label"></div></button></button-view-model>';

      var btn = this._button.querySelector('#yt-reader-toggle');
      btn.addEventListener('click', function (e) {
        e.preventDefault();
        e.stopPropagation();
        ReaderModeController.toggle();
      });

      container.insertBefore(this._button, container.firstChild);

      this.update(ReaderModeController.isActive);
    },

    remove: function () {
      if (this._button && this._button.parentNode) {
        this._button.parentNode.removeChild(this._button);
        this._button = null;
      }
    },

    update: function (isActive) {
      if (!this._button) return;

      var icon = this._button.querySelector('#yt-reader-icon');
      var label = this._button.querySelector('#yt-reader-label');

      if (isActive) {
        icon.innerHTML = this._playIcon;
        label.textContent = 'Video';
      } else {
        icon.innerHTML = this._bookIcon;
        label.textContent = 'Reader';
      }
    }
  };

  global.ToggleButton = ToggleButton;
})(window);

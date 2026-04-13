(function (global) {
  'use strict';

  var StyleManager = {
    _styleId: 'yt-reader-styles',
    _css: [
      'body.yt-reader-mode #player {',
      '  opacity: 0 !important;',
      '  pointer-events: none !important;',
      '}',
      '',
      'body.yt-reader-mode #secondary,',
      'body.yt-reader-mode #secondary-inner,',
      'body.yt-reader-mode #panels,',
      'body.yt-reader-mode #panels-inner {',
      '  contain: none !important;',
      '  transform: none !important;',
      '  position: static !important;',
      '}',
      '',
      'body.yt-reader-mode ytd-watch-flexy {',
      '  contain: none !important;',
      '  transform: none !important;',
      '  position: static !important;',
      '}',
      '',
      'body.yt-reader-mode ytd-engagement-panel-section-list-renderer[target-id="PAyouchat"] {',
      '  position: absolute !important;',
      '  z-index: 9999 !important;',
      '  display: flex !important;',
      '  flex-direction: column !important;',
      '  margin: 0 !important;',
      '  visibility: visible !important;',
      '  opacity: 1 !important;',
      '  border-radius: 12px !important;',
      '  background: #0f0f0f !important;',
      '  border: 1px solid #333 !important;',
      '  box-shadow: 0 4px 24px rgba(0,0,0,0.8) !important;',
      '}',
      '',
      'body.yt-reader-mode ytd-engagement-panel-section-list-renderer[target-id="PAyouchat"] #content {',
      '  flex: 1 1 auto !important;',
      '  overflow-y: auto !important;',
      '  min-height: 0 !important;',
      '}',
      '',
      'body.yt-reader-mode ytd-engagement-panel-section-list-renderer[target-id="PAyouchat"] #header,',
      'body.yt-reader-mode ytd-engagement-panel-section-list-renderer[target-id="PAyouchat"] #footer {',
      '  flex: 0 0 auto !important;',
      '  display: block !important;',
      '}',
      '',
      'body.yt-reader-mode ytd-engagement-panel-section-list-renderer[target-id="PAyouchat"] #visibility-button,',
      'body.yt-reader-mode ytd-engagement-panel-section-list-renderer[target-id="PAyouchat"] button[aria-label="Close"] {',
      '  display: none !important;',
      '}'
    ].join('\n'),

    inject: function () {
      this.remove();
      var style = document.createElement('style');
      style.id = this._styleId;
      style.textContent = this._css;
      document.head.appendChild(style);
    },

    remove: function () {
      var existing = document.getElementById(this._styleId);
      if (existing) {
        existing.parentNode.removeChild(existing);
      }
    }
  };

  global.StyleManager = StyleManager;
})(window);

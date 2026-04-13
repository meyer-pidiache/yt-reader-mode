(function (global) {
  'use strict';

  var SettingsManager = {
    _defaults: {
      autoActivate: true,
      initialPromptEnabled: true,
      initialPromptText: 'Summarize the video'
    },

    getDefaults: function () {
      return {
        autoActivate: this._defaults.autoActivate,
        initialPromptEnabled: this._defaults.initialPromptEnabled,
        initialPromptText: this._defaults.initialPromptText
      };
    },

    load: function () {
      var self = this;
      return new Promise(function (resolve) {
        try {
          chrome.storage.sync.get(function (items) {
            var settings = self._defaults;
            if (chrome.runtime.lastError) {
              resolve(settings);
              return;
            }
            if (items && typeof items === 'object') {
              settings = Object.assign({}, self._defaults, items);
            }
            resolve(settings);
          });
        } catch (e) {
          resolve(self._defaults);
        }
      });
    },

    save: function (partial) {
      var self = this;
      return new Promise(function (resolve) {
        try {
          chrome.storage.sync.get(function (current) {
            var merged = Object.assign({}, self._defaults, current, partial);
            chrome.storage.sync.set(merged, function () {
              resolve();
            });
          });
        } catch (e) {
          resolve();
        }
      });
    },

    onChange: function (cb) {
      chrome.storage.onChanged.addListener(function (changes, areaName) {
        if (areaName === 'sync') {
          chrome.storage.sync.get(function (items) {
            var settings = Object.assign({}, this._defaults, items);
            cb(settings);
          }.bind(this));
        }
      }.bind(this));
    }
  };

  global.SettingsManager = SettingsManager;
})(window);

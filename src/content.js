(async () => {
  await SettingsManager.init();
  EventBus.emit('APP_INIT');
})();

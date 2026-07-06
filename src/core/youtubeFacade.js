const YouTubeFacade = {
  getAppContainer() {
    return document.querySelector('ytd-app') || document.body;
  },

  getPlayer() {
    return document.getElementById('player');
  },

  getEngagementPanel() {
    return document.querySelector('ytd-engagement-panel-section-list-renderer[target-id="PAyouchat"]');
  },

  getAskButton() {
    return document.querySelector('.you-chat-entrypoint-button button');
  },

  getChatTextarea() {
    return document.querySelector('yt-chat-input-view-model textarea.chatInputViewModelChatInput');
  },

  getChatSendButton() {
    return document.querySelector('yt-chat-input-view-model form button');
  },

  isTimestamp(element) {
    return element && element.classList && element.classList.contains('ytwMarkdownDivTimestamp');
  }
};

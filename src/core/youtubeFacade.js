const YouTubeFacade = {
  getAppContainer() {
    return document.querySelector('ytd-app') || document.body;
  },

  getPlayer() {
    const el = document.getElementById('player');
    if (!el) console.log('[YT-Reader] YouTubeFacade.getPlayer(): NOT FOUND');
    return el;
  },

  getEngagementPanel() {
    const el = document.querySelector('ytd-engagement-panel-section-list-renderer[target-id="PAyouchat"]');
    if (!el) console.log('[YT-Reader] YouTubeFacade.getEngagementPanel(): NOT FOUND');
    return el;
  },

  getAskButton() {
    return document.querySelector('.you-chat-entrypoint-button button');
  },

  getChatTextarea() {
    const el = document.querySelector('yt-chat-input-view-model textarea.chatInputViewModelChatInput');
    if (!el) console.log('[YT-Reader] YouTubeFacade.getChatTextarea(): NOT FOUND');
    return el;
  },

  getChatSendButton() {
    return document.querySelector('yt-chat-input-view-model form button');
  },

  isShortsPage() {
    return window.location.pathname.startsWith('/shorts/');
  },

  isTimestamp(element) {
    return element && element.classList && element.classList.contains('ytwMarkdownDivTimestamp');
  }
};

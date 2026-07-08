'use strict';

function localizeUI() {
  const appName = chrome.i18n.getMessage('appName');
  if (appName) {
    document.title = appName;
  }
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.dataset.i18n;
    const msg = chrome.i18n.getMessage(key);
    if (msg) {
      if (el.hasAttribute('placeholder')) {
        el.placeholder = msg;
      } else {
        el.textContent = msg;
      }
    }
  });
}

const autoActivateCheckbox = document.getElementById('autoActivate');
const initialPromptEnabled = document.getElementById('initialPromptEnabled');
const initialPromptText = document.getElementById('initialPromptText');
const savePromptBtn = document.getElementById('savePrompt');

const DEFAULTS = {
  autoActivate: true,
  initialPromptEnabled: true,
  initialPromptText: chrome.i18n.getMessage('defaultPrompt')
};

async function loadSettings() {
  try {
    const items = await chrome.storage.sync.get(DEFAULTS);
    autoActivateCheckbox.checked = items.autoActivate;
    initialPromptEnabled.checked = items.initialPromptEnabled;
    initialPromptText.value = items.initialPromptText || '';
  } catch (error) {
    console.error('Failed to load settings from storage, falling back to defaults', error);
    autoActivateCheckbox.checked = DEFAULTS.autoActivate;
    initialPromptEnabled.checked = DEFAULTS.initialPromptEnabled;
    initialPromptText.value = DEFAULTS.initialPromptText;
  }
}

async function saveInitialPrompt() {
  try {
    await chrome.storage.sync.set({
      initialPromptEnabled: initialPromptEnabled.checked,
      initialPromptText: initialPromptText.value
    });
  } catch (error) {
    console.error('Failed to save prompt settings', error);
  }
}

autoActivateCheckbox.addEventListener('change', async function () {
  try {
    await chrome.storage.sync.set({ autoActivate: this.checked });
  } catch (error) {
    console.error('Failed to save autoActivate setting', error);
  }
});

initialPromptEnabled.addEventListener('change', saveInitialPrompt);

initialPromptText.addEventListener('change', async function () {
  try {
    await chrome.storage.sync.set({ initialPromptText: this.value });
  } catch (error) {
    console.error('Failed to save initial prompt text', error);
  }
});

savePromptBtn.addEventListener('click', async function () {
  await saveInitialPrompt();
  savePromptBtn.textContent = chrome.i18n.getMessage('savedFeedback');
  setTimeout(() => {
    savePromptBtn.textContent = chrome.i18n.getMessage('savePromptButton');
  }, 1500);
});

localizeUI();
loadSettings();

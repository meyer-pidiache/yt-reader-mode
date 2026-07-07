'use strict';

const autoActivateCheckbox = document.getElementById('autoActivate');
const initialPromptEnabled = document.getElementById('initialPromptEnabled');
const initialPromptText = document.getElementById('initialPromptText');
const savePromptBtn = document.getElementById('savePrompt');

const DEFAULTS = {
  autoActivate: true,
  initialPromptEnabled: true,
  initialPromptText: 'Summarize the video'
};

async function loadSettings() {
  const items = await chrome.storage.sync.get(DEFAULTS);
  autoActivateCheckbox.checked = items.autoActivate;
  initialPromptEnabled.checked = items.initialPromptEnabled;
  initialPromptText.value = items.initialPromptText || '';
}

async function saveInitialPrompt() {
  await chrome.storage.sync.set({
    initialPromptEnabled: initialPromptEnabled.checked,
    initialPromptText: initialPromptText.value
  });
}

autoActivateCheckbox.addEventListener('change', async function () {
  await chrome.storage.sync.set({ autoActivate: this.checked });
});

initialPromptEnabled.addEventListener('change', saveInitialPrompt);

initialPromptText.addEventListener('input', async function () {
  await chrome.storage.sync.set({ initialPromptText: this.value });
});

savePromptBtn.addEventListener('click', async function () {
  await saveInitialPrompt();
  savePromptBtn.textContent = 'Saved!';
  setTimeout(() => {
    savePromptBtn.textContent = 'Save Prompt';
  }, 1500);
});

loadSettings();

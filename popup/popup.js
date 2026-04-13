'use strict';

const autoActivateCheckbox = document.getElementById('autoActivate');
const initialPromptEnabled = document.getElementById('initialPromptEnabled');
const initialPromptText = document.getElementById('initialPromptText');
const savePromptBtn = document.getElementById('savePrompt');

function loadSettings() {
  chrome.storage.sync.get({
    autoActivate: true,
    initialPromptEnabled: true,
    initialPromptText: 'Summarize the video'
  }, function (items) {
    autoActivateCheckbox.checked = items.autoActivate;
    initialPromptEnabled.checked = items.initialPromptEnabled;
    initialPromptText.value = items.initialPromptText || '';
  });
}

function saveInitialPrompt() {
  chrome.storage.sync.set({
    initialPromptEnabled: initialPromptEnabled.checked,
    initialPromptText: initialPromptText.value
  });
}

autoActivateCheckbox.addEventListener('change', function () {
  chrome.storage.sync.set({ autoActivate: this.checked });
});

initialPromptEnabled.addEventListener('change', saveInitialPrompt);

initialPromptText.addEventListener('input', function () {
  chrome.storage.sync.set({ initialPromptText: this.value });
});

savePromptBtn.addEventListener('click', function () {
  saveInitialPrompt();
  savePromptBtn.textContent = 'Saved!';
  setTimeout(function () {
    savePromptBtn.textContent = 'Save Prompt';
  }, 1500);
});

loadSettings();

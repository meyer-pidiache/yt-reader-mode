/**
 * Background service worker for YT Reader Mode.
 *
 * Handles extension lifecycle events: first-install onboarding,
 * updates, and browser startup coordination.
 */

chrome.runtime.onInstalled.addListener((details) => {
  if (details.reason === 'install') {
    chrome.tabs.create({ url: chrome.runtime.getURL('welcome/welcome.html') });

    chrome.storage.sync.set({
      autoActivate: false,
      initialPromptText: '',
    });
  }

  if (details.reason === 'update') {
    console.debug(
      `YT Reader Mode updated from ${details.previousVersion} to ${chrome.runtime.getManifest().version}`,
    );
  }
});

export {};

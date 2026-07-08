/**
 * Welcome page logic for YT Reader Mode.
 *
 * Handles the "Get started" button to close the tab
 * after onboarding.
 */

document.getElementById('close-welcome').addEventListener('click', () => {
  chrome.tabs.getCurrent((tab) => {
    if (tab?.id) {
      chrome.tabs.remove(tab.id);
    }
  });
});

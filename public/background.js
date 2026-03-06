// background.js (Manifest V3)
chrome.runtime.onInstalled.addListener((details) => {
  if (details.reason === 'update') {
    const newVersion = chrome.runtime.getManifest().version;
    const url = 'https://chromewebstore.google.com/detail/eboakcaphhgldoakdlkmdlnfemkmobab'
    const id = 'poke-tab-update';

    const redirectToStore = (notificationId) => {
      if (notificationId === id) {
        chrome.tabs.create({ url });
      }
    }

    // Create the notification
    chrome.notifications.create(id, {
      type: 'basic',
      iconUrl: 'favicon.ico',
      title: 'Extension Updated!',
      message: `Updated to ${newVersion}. Check out the new features!`,
      priority: 2,
      buttons: [{ title: 'View Update' }]
    });

    chrome.notifications.onClicked.addListener(redirectToStore);

    chrome.notifications.onButtonClicked.addListener(redirectToStore)
  }
});
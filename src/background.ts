import browser from 'webextension-polyfill';

// Open Option page on install
browser.runtime.onInstalled.addListener((event) => {
  if (event.reason === 'install') {
    browser.runtime.openOptionsPage();
  }
});

export {};

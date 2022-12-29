import { platforms } from './platforms';
import 'normalize.css';
import './options.scss';

// Get stored platform, Spotify default
chrome.storage.sync.get({ platform: 'spotify' }, ({ platform }) => {
  // Set page lang
  document.documentElement.lang = chrome.i18n.getMessage('@@ui_locale');
  // Set messages
  document.title = chrome.i18n.getMessage('optionsTitle');
  const optionsSteamingPlatformLabel = document.createTextNode(
    chrome.i18n.getMessage('optionsSteamingPlatformLabel'),
  );
  document
    .querySelector('[for="streaming-platforms"]')
    ?.appendChild(optionsSteamingPlatformLabel);
  const footerElement = document.querySelector('footer');
  if (footerElement)
    footerElement.innerHTML = chrome.i18n.getMessage('optionsCredits');
  // Get select element
  const select = document.getElementById('streaming-platforms');
  // Add streaming services
  for (const key in platforms) {
    const option = document.createElement('option');
    option.value = key;
    if (platform === key) option.setAttribute('selected', '');
    const optionText = document.createTextNode((platforms as any)[key].name);
    option.append(optionText);
    select?.append(option);
  }
  // Set new platform on change
  select?.addEventListener('change', ({ target: { value } }: any) => {
    chrome.storage.sync.set({ platform: value }, () => {});
  });
});

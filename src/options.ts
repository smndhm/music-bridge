import browser from 'webextension-polyfill';
import { platforms } from './platforms';
import 'normalize.css';
import './options.scss';

(async () => {
  // Get stored platform, Spotify default
  let { platform = 'spotify' } = await browser.storage.local.get('platform');

  // Set page lang
  document.documentElement.lang = browser.i18n.getMessage('@@ui_locale');
  // Set messages
  document.title = browser.i18n.getMessage('optionsTitle');
  const optionsSteamingPlatformLabel = document.createTextNode(
    browser.i18n.getMessage('optionsSteamingPlatformLabel'),
  );
  document
    .querySelector('[for="streaming-platforms"]')
    ?.appendChild(optionsSteamingPlatformLabel);
  const footerElement = document.querySelector('footer');
  if (footerElement)
    footerElement.innerHTML = browser.i18n.getMessage('optionsCredits');
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
  select?.addEventListener('change', async ({ target: { value } }: any) => {
    await browser.storage.local.set({ platform: value });
  });
})();

import browser from 'webextension-polyfill';
import { platforms } from './platforms';
import 'normalize.css';
import './options.scss';

(async () => {
  // Get stored platform, Spotify default
  let { platform = 'spotify' } = await browser.storage.local.get('platform');

  // Set page lang
  document.documentElement.lang = browser.i18n.getMessage('@@ui_locale');

  // Set page title
  document.title = browser.i18n.getMessage('optionsTitle');
  const optionsSteamingPlatformLabel = document.createTextNode(
    browser.i18n.getMessage('optionsSteamingPlatformLabel'),
  );

  // Set select label
  document
    .querySelector('[for="streaming-platforms"]')
    ?.appendChild(optionsSteamingPlatformLabel);

  // Set select elements
  const select: HTMLInputElement = document.getElementById(
    'streaming-platforms',
  ) as HTMLInputElement;
  // Add streaming services
  for (const key in platforms) {
    const option = document.createElement('option');
    option.value = key;
    if (platform === key) option.setAttribute('selected', '');
    const optionText = document.createTextNode((platforms as any)[key].name);
    option.append(optionText);
    select?.append(option);
  }

  // Set button
  const button: HTMLButtonElement = document.querySelector(
    'button',
  ) as HTMLButtonElement;
  // Label
  const optionsSaveButton = document.createTextNode(
    browser.i18n.getMessage('optionsSaveButton'),
  );
  button.appendChild(optionsSaveButton);

  // Set Confirmation message
  const alert: HTMLDivElement = document.querySelector(
    '[role="alert"]',
  ) as HTMLDivElement;
  const optionsSaveConfirmation = document.createTextNode(
    browser.i18n.getMessage('optionsSaveConfirmation'),
  );
  alert.appendChild(optionsSaveConfirmation);

  //Add event listener to save platform value
  const form: HTMLFormElement = document.querySelector(
    'form',
  ) as HTMLFormElement;
  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    await browser.storage.local.set({ platform: select.value });
    alert.hidden = false;
    setTimeout(() => {
      alert.hidden = true;
    }, 3000);
  });

  // Footer credits
  const footerElement: HTMLElement = document.querySelector(
    'footer',
  ) as HTMLElement;
  footerElement.innerHTML = browser.i18n.getMessage('optionsCredits');
})();

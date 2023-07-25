import browser from 'webextension-polyfill';
import { platforms } from './platforms';
import { isChromeOs } from './utils';
import 'normalize.css';
import './options.scss';

(async () => {
  // Get stored platform, Spotify default
  let { platform = 'spotify' } = await browser.storage.local.get('platform');
  let { openInApp = false } = await browser.storage.local.get('openInApp');
  let platformInfo = platforms[platform];

  // Set page lang
  document.documentElement.lang = browser.i18n.getMessage('@@ui_locale');

  // Set page title
  document.title = browser.i18n.getMessage('optionsTitle');

  // Set select label
  const optionsSteamingPlatformLabel: Text = document.createTextNode(
    browser.i18n.getMessage('optionsSteamingPlatformLabel'),
  );
  document
    .querySelector('[for="streaming-platforms"]')
    ?.prepend(optionsSteamingPlatformLabel);

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

  // Set checkbox label
  const optionsOpenAppLabel: Text = document.createTextNode(
    browser.i18n.getMessage('optionsOpenAppLabel'),
  );
  const openDesktopApp: HTMLLabelElement =
    document.querySelector('[for="open-app"]')!;
  openDesktopApp.appendChild(optionsOpenAppLabel);

  // Set Checkbox value
  const checkbox: HTMLInputElement = document.getElementById(
    'open-app',
  ) as HTMLInputElement;
  checkbox.checked = openInApp;

  // Update checkbox visibility
  const displayOptionsOpenDesktopApp = () => {
    openDesktopApp.hidden =
      platformInfo.hasNativeAppLink !== true || isChromeOs();
  };
  displayOptionsOpenDesktopApp();

  // Watch platform change
  select.addEventListener('change', ({ target: { value } }) => {
    platformInfo = platforms[value];
    checkbox.checked = false;
    displayOptionsOpenDesktopApp();
  });

  // Set button
  const button: HTMLButtonElement = document.querySelector('button')!;
  const optionsSaveButton = document.createTextNode(
    browser.i18n.getMessage('optionsSaveButton'),
  );
  button.appendChild(optionsSaveButton);

  // Set Confirmation message
  const alert: HTMLDivElement = document.querySelector('[role="alert"]')!;
  const optionsSaveConfirmation = document.createTextNode(
    browser.i18n.getMessage('optionsSaveConfirmation'),
  );
  alert.appendChild(optionsSaveConfirmation);

  //Add event listener to save platform value
  const form: HTMLFormElement = document.querySelector('form')!;
  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    await browser.storage.local.set({
      platform: select.value,
      openInApp: checkbox.checked,
    });
    alert.hidden = false;
    setTimeout(() => {
      alert.hidden = true;
    }, 2000);
  });

  // Footer credits
  const footerElement: HTMLElement = document.querySelector('footer')!;
  footerElement.innerHTML = browser.i18n.getMessage('optionsCredits');
})();

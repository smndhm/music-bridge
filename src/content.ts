import browser from 'webextension-polyfill';
import { platforms } from './platforms';

(async () => {
  let { platform = 'spotify' } = await browser.storage.local.get('platform');

  const redirect = `https://song.link/redirect?url=${encodeURIComponent(
    window.location.href,
  )}&to=${platform}`;

  if (!window.location.href.startsWith(platforms[platform].url))
    window.location.href = redirect;
})();

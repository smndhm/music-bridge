import browser from 'webextension-polyfill';
import { platforms } from './platforms';

(async () => {
  let { platform = 'spotify' } = await browser.storage.local.get('platform');
  let { openInApp = false } = await browser.storage.local.get('openInApp');

  const params = new URLSearchParams({
    url: encodeURIComponent(window.location.href),
    platform,
  });

  if (openInApp) params.set('typeURI', 'nativeAppUriDesktop');

  const redirect = `https://music-bridge.bricodage.fr/?${params.toString()}`;

  if (openInApp || !window.location.href.startsWith(platforms[platform].url))
    window.location.href = redirect;
})();

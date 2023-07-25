import browser from 'webextension-polyfill';
import {
  isChromeOs,
  isSamePlatform,
  getDeezerDesktopUri,
  getSpotifyDesktopUri,
  redirect,
} from './utils';

(async () => {
  let { platform = 'spotify' } = await browser.storage.local.get('platform');
  let { openInApp = false } = await browser.storage.local.get('openInApp');
  // Don't open in app on ChromeOS
  openInApp = openInApp && !isChromeOs();

  // Redirect a Deezer link to the app without need to call API
  if (openInApp && isSamePlatform(platform) && platform === 'deezer') {
    const deezerDesktopUri: string | undefined = getDeezerDesktopUri(
      window.location.href,
    );
    if (deezerDesktopUri !== undefined) redirect(deezerDesktopUri, openInApp);
  }
  // Redirect a Spotify link to the app without need to call API
  else if (openInApp && isSamePlatform(platform) && platform === 'spotify') {
    const spotifyDesktopUri: string | undefined = getSpotifyDesktopUri(
      window.location.href,
    );
    if (spotifyDesktopUri !== undefined) redirect(spotifyDesktopUri, openInApp);
  }
  // Redirect using API
  else {
    const params: URLSearchParams = new URLSearchParams({
      url: encodeURIComponent(window.location.href),
      platform,
    });

    if (openInApp) params.set('typeURI', 'nativeAppUriDesktop');

    const redirectUrl = `https://music-bridge.bricodage.fr/?${params.toString()}`;

    if (openInApp || !isSamePlatform(platform)) {
      redirect(redirectUrl, openInApp);
    }
  }
})();

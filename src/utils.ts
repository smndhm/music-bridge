import { platforms } from './platforms';

export const isChromeOs = (): boolean => /\bCrOS\b/.test(navigator.userAgent);

export const isFirefox = (): boolean =>
  /\bfirefox\b/i.test(navigator.userAgent);

export const getDeezerDesktopUri = (url: string): string | undefined => {
  const match =
    /https:\/\/www\.deezer\.com\/(?:[a-z]{0,2}\/)?(track|album)\/(\d+)/.exec(
      url,
    );
  return match != null ? `deezer://${match[1]}/${match[2]}` : undefined;
};

export const getSpotifyDesktopUri = (url: string): string | undefined => {
  const match =
    /^https:\/\/open\.spotify\.com\/(?:intl-[a-z]{0,2}\/)?(album|track)\/([\w\d]+)/.exec(
      url,
    );
  return match != null ? `spotify:${match[1]}:${match[2]}` : undefined;
};

export const isSamePlatform = (platform: string): boolean =>
  window.location.href.startsWith(platforms[platform].url);

export const redirect = (url: string, openInApp: boolean) => {
  window.location.href = url;
  // Close tab after opening app on firefox
  // if (openInApp && isFirefox()) window.close();
};

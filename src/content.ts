import { platforms } from './platforms';
chrome.storage.sync.get(
  {
    platform: 'spotify',
  },
  ({ platform }) => {
    const redirect = `https://song.link/redirect?url=${encodeURIComponent(
      window.location.href,
    )}&to=${platform}`;
    if (!window.location.href.startsWith(platforms[platform].url))
      window.location.href = redirect;
  },
);

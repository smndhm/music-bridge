import { describe, it, expect, vi, beforeAll, afterAll } from 'vitest';
import {
  isChromeOs,
  isFirefox,
  getDeezerDesktopUri,
  getSpotifyDesktopUri,
  isSamePlatform,
  redirect,
} from './utils';
import { platforms } from './platforms';

vi.stubGlobal(
  'navigator',
  vi.fn(() => ({ userAgent: vi.fn() })),
);

describe('Utils', () => {
  describe('isChromeOs', () => {
    it('should return true if userAgent contains "CrOS"', () => {
      Object.defineProperty(globalThis.navigator, 'userAgent', {
        value:
          'Mozilla/5.0 (X11; CrOS x86_64 10032.75.0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4240.199 Safari/537.36',
        writable: true,
      });
      expect(isChromeOs()).toBe(true);
    });

    it('should return false if userAgent does not contain "CrOS"', () => {
      Object.defineProperty(globalThis.navigator, 'userAgent', {
        value:
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36',
        writable: true,
      });
      expect(isChromeOs()).toBe(false);
    });
  });

  describe('isFirefox', () => {
    it('should return true if userAgent contains "firefox"', () => {
      Object.defineProperty(globalThis.navigator, 'userAgent', {
        value:
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:58.0) Gecko/20100101 Firefox/58.0',
        writable: true,
      });
      expect(isFirefox()).toBe(true);
    });

    it('should return false if userAgent does not contain "firefox"', () => {
      Object.defineProperty(globalThis.navigator, 'userAgent', {
        value:
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36',
        writable: true,
      });
      expect(isFirefox()).toBe(false);
    });
  });

  describe('getDeezerDesktopUri', () => {
    it.each([
      {
        url: 'https://www.deezer.com/track/123',
        expected: 'deezer://track/123',
      },
      {
        url: 'https://www.deezer.com/fr/track/123',
        expected: 'deezer://track/123',
      },
      {
        url: 'https://www.deezer.com/album/123',
        expected: 'deezer://album/123',
      },
      {
        url: 'https://www.deezer.com/fr/album/123',
        expected: 'deezer://album/123',
      },
      {
        url: 'https://www.deezer.com/fr/album/123?blu=blu',
        expected: 'deezer://album/123',
      },
      {
        url: 'https://www.deezer.com/',
        expected: undefined,
      },
      {
        url: 'https://www.deezer.com/playlist/123',
        expected: undefined,
      },
      {
        url: 'https://www.deezer.com/blu/album/123',
        expected: undefined,
      },
      {
        url: 'https://www.blu.com',
        expected: undefined,
      },
    ])('should return deezer uri if url is valid', ({ url, expected }) => {
      expect(getDeezerDesktopUri(url)).toBe(expected);
    });
  });

  describe('getSpotifyDesktopUri', () => {
    it.each([
      {
        url: 'https://open.spotify.com/track/123',
        expected: 'spotify:track:123',
      },
      {
        url: 'https://open.spotify.com/intl-fr/track/123',
        expected: 'spotify:track:123',
      },
      {
        url: 'https://open.spotify.com/album/123',
        expected: 'spotify:album:123',
      },
      {
        url: 'https://open.spotify.com/intl-de/album/123',
        expected: 'spotify:album:123',
      },
      {
        url: 'https://open.spotify.com/album/123?blu=blu',
        expected: 'spotify:album:123',
      },
      {
        url: 'https://open.spotify.com/',
        expected: undefined,
      },
      {
        url: 'https://open.spotify.com/playlist/123',
        expected: undefined,
      },
      {
        url: 'https://www.blu.com',
        expected: undefined,
      },
    ])('should return spotify uri if url is valid', ({ url, expected }) => {
      expect(getSpotifyDesktopUri(url)).toBe(expected);
    });
  });

  describe('isSamePlatform', () => {
    it.each(Object.entries(platforms))(
      'returns true when the URL starts with the platform URL (%s)',
      (platform, data) => {
        global.window = { location: { href: `${data.url}/blu/bli/blo` } };
        expect(isSamePlatform(platform)).toBe(true);
      },
    );

    it('returns false when the URL does not start with the platform URL', () => {
      global.window = {
        location: { href: 'https://www.deezer.com/track/123' },
      };
      expect(isSamePlatform('spotify')).toBe(false);
    });
  });

  describe('redirect', () => {
    let oldLocationHref: string;

    beforeAll(() => {
      oldLocationHref = window.location.href;
    });

    afterAll(() => {
      window.location.href = oldLocationHref;
    });

    it('updates the window location href with the provided URL', () => {
      redirect('https://example.com/your-path', false);
      expect(window.location.href).toBe('https://example.com/your-path');
    });

    // it('closes the tab if openInApp is true and the browser is Firefox', () => {
    //   window.close = vi.fn(); // mock window.close function
    //   Object.defineProperty(globalThis.navigator, 'userAgent', {
    //     value:
    //       'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:58.0) Gecko/20100101 Firefox/58.0',
    //     writable: true,
    //   });
    //   redirect('https://example.com/your-path', true);
    //   expect(window.close).toHaveBeenCalled();
    // });
  });
});

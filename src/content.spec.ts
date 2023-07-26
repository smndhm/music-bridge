import { describe, it, vi, beforeEach, expect } from 'vitest';
import { platforms } from './platforms';
import { manifest } from './manifest';

// Mock local storage
let platformMock: string;
let openInAppMock: boolean;

vi.stubGlobal(
  'navigator',
  vi.fn(() => ({ userAgent: vi.fn() })),
);

vi.mock('webextension-polyfill', () => ({
  default: {
    storage: {
      local: {
        get: vi.fn(() =>
          Promise.resolve({
            platform: platformMock,
            openInApp: openInAppMock,
          }),
        ),
      },
    },
  },
}));

describe('content', () => {
  beforeEach(() => {
    vi.resetModules();
  });

  describe.each(['CrOS', 'Windows firefox'])('userAgent (%s)', (userAgent) => {
    describe.each([true, false])('Open in app (%s)', (openInApp) => {
      describe.each(manifest.content_scripts[0].matches)(
        'Matching URLs (%s)',
        (match) => {
          it.each(Object.entries(platforms))(
            'Platform (%s)',
            async (platform, data) => {
              platformMock = platform;
              openInAppMock = openInApp && data.hasNativeAppLink === true;

              const locationHref =
                (match.match(/\*/g) || []).length === 1
                  ? match.replace('*', '1234567890')
                  : platform === 'spotify'
                  ? match.replace('*', 'intl-fr').replace('*', '1234567890')
                  : match.replace('*', 'en').replace('*', '1234567890');

              global.window = {
                location: {
                  href: locationHref,
                },
              };

              Object.defineProperty(globalThis.navigator, 'userAgent', {
                value: userAgent,
                writable: true,
              });

              // window.close = vi.fn(); // mock window.close function

              await import('./content');

              //Expects
              if (
                openInAppMock &&
                userAgent !== 'CrOS' &&
                locationHref.startsWith(data.url) &&
                data.hasNativeAppLink === true
              ) {
                if (['deezer', 'spotify'].includes(platform))
                  expect(window.location.href).toMatch(
                    new RegExp(`^${platform}:`),
                  );
                else
                  expect(window.location.href).toMatch(
                    /^https:\/\/music-bridge\.bricodage\.fr\/\?url=.+&typeURI=nativeAppUriDesktop$/,
                  );
              } else if (locationHref.startsWith(data.url)) {
                expect(window.location.href).toEqual(locationHref);
              } else {
                expect(window.location.href).toMatch(
                  /^https:\/\/music-bridge\.bricodage\.fr\/\?url=/,
                );
              }

              // expect(window.close).toHaveBeenCalledTimes(
              //   userAgent === 'Windows firefox' && openInAppMock ? 1 : 0,
              // );
            },
          );
        },
      );
    });
  });
});

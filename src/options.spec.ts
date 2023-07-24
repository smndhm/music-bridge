import { describe, it, vi, afterEach, beforeEach, expect } from 'vitest';
import { platforms } from './platforms';
import { readFileSync } from 'fs';
import { JSDOM } from 'jsdom';
import { join } from 'path';

const htmlFilePath = join(__dirname, './options.html');
const html = readFileSync(htmlFilePath, 'utf-8');

// Mock local storage
let platformMock: string;
let openInAppMock: boolean;
let browserStorageLocalSet = vi.fn();

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
        set: browserStorageLocalSet,
      },
    },
    i18n: {
      getMessage: vi.fn((key) => key),
    },
  },
}));

/**
 * @vitest-environment jsdom
 */

describe('options', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.resetModules();
    const { window: jsdomWindow } = new JSDOM(html);
    window = jsdomWindow;
    document = window.document;
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it.each(Object.entries(platforms))(
    'Platform (%s)',
    // Run the code
    async (platform) => {
      platformMock = platform;
      await import('./options');
      expect(document.documentElement.outerHTML).toMatchSnapshot();
    },
  );

  it('Should change platform and unselect openDesktopApp option and save', async () => {
    await import('./options');

    const checkbox: HTMLInputElement = document.getElementById(
      'open-app',
    ) as HTMLInputElement;
    checkbox.checked = true;

    const select: HTMLInputElement = document.getElementById(
      'streaming-platforms',
    ) as HTMLInputElement;
    select.value = Object.keys(platforms)[0];
    select.dispatchEvent(new Event('change'));

    expect(checkbox.checked).toEqual(false);

    const form: HTMLFormElement = document.querySelector('form')!;
    const alert: HTMLDivElement = document.querySelector('[role="alert"]')!;

    form.dispatchEvent(new Event('submit'));

    expect(browserStorageLocalSet).toHaveBeenCalledWith({
      platform: select.value,
      openInApp: checkbox.checked,
    });

    await vi.runAllTimersAsync();

    expect(alert.hidden).toEqual(true);
  });
});

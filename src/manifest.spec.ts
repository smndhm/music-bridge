import { describe, it, vi, beforeEach, expect, afterEach } from 'vitest';

describe('manifest', () => {
  beforeEach(() => {
    vi.resetModules();
    vi.mock('../package.json', () => {
      return {
        version: '0.0.0',
      };
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it.each(['firefox', 'not firefox'])('browser (%s)', async (browser) => {
    process.argv[3] = browser;
    const { manifest } = await import('./manifest');
    expect(manifest).toMatchSnapshot();
  });
});

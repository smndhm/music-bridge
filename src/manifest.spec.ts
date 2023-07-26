import { describe, it, vi, beforeEach, expect, afterEach } from 'vitest';

describe('manifest', () => {
  beforeEach(() => {
    vi.resetModules();
  });

  it.each(['firefox', 'not firefox'])('browser (%s)', async (browser) => {
    process.argv[3] = browser;
    const { manifest } = await import('./manifest');
    manifest.version = '0.0.0';
    expect(manifest).toMatchSnapshot();
  });
});

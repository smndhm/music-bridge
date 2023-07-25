import { describe, it, vi, afterEach, beforeEach, expect } from 'vitest';

describe('options', () => {
  beforeEach(() => {
    vi.resetModules();
  });

  it.each(['firefox', 'not firefox'])('browser (%s)', async (browser) => {
    process.argv[3] = browser;
    const { manifest } = await import('./manifest');
    expect(manifest).toMatchSnapshot();
  });
});

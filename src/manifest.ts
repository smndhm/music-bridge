import { writeFile, mkdir } from 'fs/promises';
import pckg from '../package.json' assert { type: 'json' };

const isFirefoxManifest = process.argv[3] === 'firefox';

const manifest = {
  manifest_version: isFirefoxManifest ? 2 : 3,
  name: '__MSG_name__',
  description: '__MSG_description__',
  version: pckg.version,
  icons: {
    '48': 'icons/48.png',
    '128': 'icons/128.png',
  },
  default_locale: 'en',
  content_scripts: [
    {
      matches: [
        'https://open.spotify.com/track/*',
        'https://open.spotify.com/album/*',
        'https://www.deezer.com/*/track/*',
        'https://www.deezer.com/*/album/*',
        'https://music.apple.com/*/album/*',
        'https://music.youtube.com/watch?v=*',
        'https://music.youtube.com/playlist?list=*',
        'https://listen.tidal.com/track/*',
        'https://listen.tidal.com/album/*',
        'https://www.pandora.com/TR:*',
        'https://www.pandora.com/AL:*',
        'https://music.amazon.com/albums/*',
        'https://web.napster.com/track/*',
        'https://web.napster.com/album/*',
      ],
      js: ['content.js'],
      run_at: 'document_start',
    },
  ],
  background: isFirefoxManifest
    ? {
        scripts: ['background.js'],
        persistent: false,
      }
    : {
        service_worker: 'background.js',
      },
  options_ui: {
    page: 'options.html',
    open_in_tab: false,
  },
  permissions: ['storage'],
};

(async () => {
  await mkdir('./dist', { recursive: true });
  await writeFile('./dist/manifest.json', JSON.stringify(manifest));
})();

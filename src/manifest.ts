import { writeFile, mkdir } from 'fs/promises';
import pckg from '../package.json' assert { type: 'json' };

const isManifestV2 = process.argv[3] === 'v2';

const manifest = {
  manifest_version: isManifestV2 ? 2 : 3,
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
        'https://music.youtube.com/*',
        'https://listen.tidal.com/track/*',
        'https://listen.tidal.com/album/*',
        'https://soundcloud.com/*',
        'https://www.pandora.com/*',
        'https://music.amazon.com/albums/*',
        'https://web.napster.com/track/*',
        'https://web.napster.com/album/*',
      ],
      all_frames: true,
      js: ['content.js'],
    },
  ],
  background: isManifestV2
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

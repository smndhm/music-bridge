interface Platform {
  name: string;
  url: string;
}

interface Platforms {
  [key: string]: Platform;
}

export const platforms: Platforms = {
  spotify: {
    name: 'Spotify',
    url: 'https://open.spotify.com',
  },
  deezer: {
    name: 'Deezer',
    url: 'https://www.deezer.com',
  },
  appleMusic: {
    name: 'Apple Music',
    url: 'https://music.apple.com',
  },
  youtube: {
    name: 'Youtube',
    url: 'https://www.youtube.com',
  },
  youtubeMusic: {
    name: 'Youtube Music',
    url: 'https://music.youtube.com',
  },
  tidal: {
    name: 'Tidal',
    url: 'https://listen.tidal.com',
  },
  soundcloud: {
    name: 'SoundCloud',
    url: 'https://soundcloud.com',
  },
  pandora: {
    name: 'Pandora',
    url: 'https://www.pandora.com',
  },
  amazonMusic: {
    name: 'Amazon Music',
    url: 'https://music.amazon.com',
  },
  napster: {
    name: 'Napster',
    url: 'https://play.napster.com',
  },
};

// https://www.notion.so/Redirect-URLs-9e906d3277d945e29ce422e461fb3c06
// yandex
// spinrilla
// audius
// itunes
// googleStore
// amazonStore

// https://www.notion.so/API-d0ebe08a5e304a55928405eb682f6741
// itunes
// google
// googleStore
// amazonStore
// yandex
// spinrilla
// audius
// audiomack
// anghami
// boomplay

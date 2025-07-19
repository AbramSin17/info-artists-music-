// lib/api.ts
const LAST_FM_API_KEY = process.env.NEXT_PUBLIC_LAST_FM_API_KEY;
const BANDSINTOWN_API_KEY = process.env.NEXT_PUBLIC_BANDSINTOWN_API_KEY || "000";

// --- INTERFACE BARU UNTUK EVENT BANDSINTOWN ---
interface BandsintownEvent {
  title: string;
  id: string;
  artist_id: string;
  url: string;
  on_sale_datetime: string;
  datetime: string; // Tanggal dan waktu event
  description: string | null;
  venue: {
    id: string;
    name: string;
    latitude: string;
    longitude: string;
    city: string;
    region: string;
    country: string;
  };
  lineup: string[];
  offers: Array<{
    type: string;
    url: string;
    status: string;
  }>;
  artist: {
    name: string;
    mbid: string;
    url: string;
    image_url: string;
    thumb_url: string;
    facebook_page_url: string;
    tracker_count: number;
    upcoming_event_count: number;
  };
}
// --- AKHIR INTERFACE BARU ---

interface LastFmArtist {
  name: string;
  mbid?: string;
  url: string;
  image: Array<{ '#text': string; size: string }>;
  bio?: {
    summary: string;
    content: string;
  };
  tags?: {
    tag: Array<{ name: string; url: string }>;
  };
  stats?: {
    listeners: string;
    playcount: string;
  };
}

interface LastFmAlbum {
  name: string;
  playcount: number;
  mbid?: string;
  url: string;
  artist: {
    name: string;
    mbid?: string;
    url: string;
  };
  image: Array<{ '#text': string; size: string }>;
}

interface LastFmTrack {
  name: string;
  playcount: number;
  listeners: number;
  mbid: string;
  url: string;
  artist: {
    name: string;
    mbid: string;
    url: string;
  };
}

// Fungsi untuk mengambil detail artis dari Last.fm (sama)
export async function getAllArtistDetails(identifier: string): Promise<LastFmArtist | null> {
  let url = '';
  const isMBID = identifier.length === 36 && identifier.includes('-') && identifier.match(/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/i);

  if (isMBID) {
    url = `https://ws.audioscrobbler.com/2.0/?method=artist.getinfo&mbid=${identifier}&api_key=${LAST_FM_API_KEY}&format=json`;
  } else {
    url = `https://ws.audioscrobbler.com/2.0/?method=artist.getinfo&artist=${encodeURIComponent(identifier)}&api_key=${LAST_FM_API_KEY}&format=json`;
  }

  try {
    const response = await fetch(url);
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Gagal mengambil detail artis dari Last.fm untuk ${identifier}: ${response.status} - ${errorText}`);
      return null;
    }
    const data = await response.json();
    if (data.artist && !data.error) {
      return data.artist;
    }
    console.warn(`Data artis dari Last.fm tidak ditemukan untuk ${identifier}:`, data);
    return null;
  } catch (error) {
    console.error("Kesalahan saat mengambil detail artis dari Last.fm:", error);
    return null;
  }
}

// Fungsi untuk mencari artis di Last.fm (sama)
export async function searchArtistLastFm(query: string): Promise<LastFmArtist[]> {
  const url = `https://ws.audioscrobbler.com/2.0/?method=artist.search&artist=${encodeURIComponent(query)}&api_key=${LAST_FM_API_KEY}&format=json`;
  try {
    const response = await fetch(url);
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Gagal mencari artis di Last.fm untuk ${query}: ${response.status} - ${errorText}`);
      return [];
    }
    const data = await response.json();
    if (data.results && data.results.artistmatches && data.results.artistmatches.artist) {
      return data.results.artistmatches.artist;
    }
    return [];
  } catch (error) {
    console.error("Kesalahan saat mencari artis di Last.fm:", error);
    return [];
  }
}

// Fungsi untuk mendapatkan detail dari Last.fm untuk beberapa artis (sama)
export async function getMultipleArtistsDetails(artistNames: string[]): Promise<LastFmArtist[]> {
  const promises = artistNames.map(name => getAllArtistDetails(name));
  const results = await Promise.all(promises);
  return results.filter(Boolean) as LastFmArtist[];
}

// Fungsi untuk mengambil top album artis dari Last.fm (sama)
export async function getArtistTopAlbumsLastFm(artistName: string, mbid?: string): Promise<LastFmAlbum[]> {
  let url = '';
  if (mbid) {
    url = `https://ws.audioscrobbler.com/2.0/?method=artist.gettopalbums&mbid=${mbid}&api_key=${LAST_FM_API_KEY}&format=json`;
  } else {
    url = `https://ws.audioscrobbler.com/2.0/?method=artist.gettopalbums&artist=${encodeURIComponent(artistName)}&api_key=${LAST_FM_API_KEY}&format=json`;
  }

  try {
    const response = await fetch(url);
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Gagal mengambil album teratas dari Last.fm untuk ${artistName}: ${response.status} - ${errorText}`);
      return [];
    }
    const data = await response.json();
    if (data.topalbums && data.topalbums.album) {
      return data.topalbums.album.slice(0, 10);
    }
    return [];
  } catch (error) {
    console.error("Kesalahan saat mengambil album teratas dari Last.fm:", error);
    return [];
  }
}

// Fungsi untuk mengambil top tracks artis dari Last.fm (sama)
export async function getArtistTopTracksLastFm(artistName: string, mbid?: string): Promise<LastFmTrack[]> {
  let url = '';
  if (mbid) {
    url = `https://ws.audioscrobbler.com/2.0/?method=artist.gettoptracks&mbid=${mbid}&api_key=${LAST_FM_API_KEY}&format=json`;
  } else {
    url = `https://ws.audioscrobbler.com/2.0/?method=artist.gettoptracks&artist=${encodeURIComponent(artistName)}&api_key=${LAST_FM_API_KEY}&format=json`;
  }

  try {
    const response = await fetch(url);
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Gagal mengambil top tracks dari Last.fm untuk ${artistName}: ${response.status} - ${errorText}`);
      return [];
    }
    const data = await response.json();
    if (data.toptracks && data.toptracks.track) {
      return data.toptracks.track.slice(0, 10);
    }
    return [];
  } catch (error) {
    console.error("Kesalahan saat mengambil top tracks dari Last.fm:", error);
    return [];
  }
}

// Fungsi untuk mengambil gambar artis dari Bandsintown (sama)
export async function getArtistImageFromBandsintown(artistName: string): Promise<string | null> {
  const url = `https://rest.bandsintown.com/artists/${encodeURIComponent(artistName)}?app_id=${BANDSINTOWN_API_KEY}`;
  try {
    const response = await fetch(url);
    if (!response.ok) {
      if (response.status === 404) {
        console.warn(`Artis ${artistName} tidak ditemukan di Bandsintown.`);
        return null;
      }
      const errorText = await response.text();
      console.error(`Gagal mengambil gambar dari Bandsintown untuk ${artistName}: ${response.status} - ${errorText}`);
      return null;
    }
    const data = await response.json();
    if (data.image_url) {
      return data.image_url;
    }
    return null;
  } catch (error) {
    console.error("Kesalahan saat mengambil gambar dari Bandsintown:", error);
    return null;
  }
}

// --- FUNGSI BARU: Ambil Event Artis dari Bandsintown ---
export async function getArtistEventsFromBandsintown(artistName: string): Promise<BandsintownEvent[]> {
  const url = `https://rest.bandsintown.com/artists/${encodeURIComponent(artistName)}/events?app_id=${BANDSINTOWN_API_KEY}`;
  try {
    const response = await fetch(url);
    if (!response.ok) {
      if (response.status === 404) {
        console.warn(`Event untuk artis ${artistName} tidak ditemukan di Bandsintown.`);
        return [];
      }
      const errorText = await response.text();
      console.error(`Gagal mengambil event dari Bandsintown untuk ${artistName}: ${response.status} - ${errorText}`);
      return [];
    }
    const data = await response.json();
    // Bandsintown mengembalikan array event langsung jika berhasil
    if (Array.isArray(data)) {
      return data;
    }
    return [];
  } catch (error) {
    console.error("Kesalahan saat mengambil event dari Bandsintown:", error);
    return [];
  }
}
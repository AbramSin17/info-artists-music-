// app/artist/[id]/page.tsx
"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Heart, ArrowLeft, Calendar, Disc, Music, ExternalLink } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { Skeleton } from "@/components/ui/skeleton"
// Mengimport getArtistImageFromBandsintown
import { getAllArtistDetails, getArtistTopAlbumsLastFm, getArtistTopTracksLastFm, getArtistImageFromBandsintown } from '@/lib/api'; 

// Interface untuk artis dari Last.fm (sama seperti sebelumnya)
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

// Interface untuk album dari Last.fm (sama seperti sebelumnya)
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

// Interface untuk top track dari Last.fm
interface LastFmTrack {
  name: string;
  playcount: number;
  listeners: number;
  mbid: string;
  url: string; // URL ke halaman Last.fm lagu
  artist: {
    name: string;
    mbid: string;
    url: string;
  };
}

// --- Fungsi Helper untuk Deteksi Placeholder Last.fm (sama dengan app/page.tsx) ---
const isLastFmKnownPlaceholder = (url: string): boolean => {
  if (!url) return false;
  return url.includes('2a96cbd8b46e442fc41c2b86b821562f.png') ||
         url.includes('default_avatar.png') ||
         url.includes('_avatar.png');
};
// --- Akhir Fungsi Helper ---


export default function ArtistDetailPage() {
  const params = useParams()
  const artistIdentifier = decodeURIComponent(params.id as string); 
  const [artist, setArtist] = useState<LastFmArtist | null>(null)
  const [albums, setAlbums] = useState<LastFmAlbum[]>([])
  const [topTracks, setTopTracks] = useState<LastFmTrack[]>([])
  const [loading, setLoading] = useState(true)
  const [isLiked, setIsLiked] = useState(false)
  const [bandsintownArtistImage, setBandsintownArtistImage] = useState<string | null>(null); // State baru untuk gambar dari Bandsintown

  useEffect(() => {
    const fetchArtistData = async () => {
      setLoading(true)

      const savedLikes = localStorage.getItem("likedArtists")
      const likedArtistIds = savedLikes ? JSON.parse(savedLikes) : []
      setIsLiked(likedArtistIds.includes(artistIdentifier))

      try {
        // Fetch dari Last.fm
        const fetchedArtist = await getAllArtistDetails(artistIdentifier)
        setArtist(fetchedArtist)

        // Fetch gambar dari Bandsintown
        const fetchedBandsintownImage = await getArtistImageFromBandsintown(artistIdentifier); 
        setBandsintownArtistImage(fetchedBandsintownImage);

        if (fetchedArtist) {
          const fetchedAlbums = await getArtistTopAlbumsLastFm(fetchedArtist.name, fetchedArtist.mbid)
          setAlbums(fetchedAlbums)

          const fetchedTopTracks = await getArtistTopTracksLastFm(fetchedArtist.name, fetchedArtist.mbid)
          setTopTracks(fetchedTopTracks)
        }
      } catch (error) {
        console.error("Error fetching artist data:", error);
        setArtist(null);
        setAlbums([]);
        setTopTracks([]);
        setBandsintownArtistImage(null); 
      } finally {
        setLoading(false);
      }
    }

    fetchArtistData()
  }, [artistIdentifier])

  const handleToggleLike = () => {
    const savedLikes = localStorage.getItem("likedArtists")
    const likedArtistIds = savedLikes ? JSON.parse(savedLikes) : []

    let updatedLikes
    if (isLiked) {
      updatedLikes = likedArtistIds.filter((id: string) => id !== artistIdentifier)
    } else {
      updatedLikes = [...likedArtistIds, artistIdentifier]
    }

    localStorage.setItem("likedArtists", JSON.stringify(updatedLikes))
    setIsLiked(!isLiked)
  }

  // --- Logika pemilihan gambar utama yang diperbarui ---
  const rawLastFmArtistImage = artist?.image?.find(img => img.size === 'extralarge' || img.size === 'large' || img.size === 'medium')?.['#text'];

  // Prioritaskan: Bandsintown -> Last.fm (jika bukan placeholder) -> Placeholder lokal
  const artistImage = bandsintownArtistImage || 
                      (rawLastFmArtistImage && !isLastFmKnownPlaceholder(rawLastFmArtistImage) ? rawLastFmArtistImage : null) || 
                      "/placeholder.svg";
  // --- Akhir Logika pemilihan gambar utama yang diperbarui ---


  if (loading) {
    return (
      <ArtistDetailSkeleton />
    )
  }

  if (!artist) {
    return (
      <div className="p-6 text-center">
        <h1 className="text-2xl font-bold mb-4">Artis tidak ditemukan</h1>
        <Link href="/">
          <Button>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Kembali ke Artis
          </Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-8">
      <Link href="/">
        <Button variant="ghost" className="hover:bg-gray-800/50">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Kembali ke Artis
        </Button>
      </Link>

      <div className="flex flex-col lg:flex-row gap-8">
        <div className="lg:w-1/3">
          <Card className="bg-gray-800/30 border-gray-700">
            <CardContent className="p-6">
              <div className="relative mb-6">
                <Image
                  src={artistImage}
                  alt={artist.name}
                  width={400}
                  height={400}
                  className="w-full rounded-lg shadow-lg shadow-cyan-400/10 object-cover aspect-square"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/placeholder.svg';
                  }}
                  priority
                />
              </div>

              <div className="space-y-4">
                <div>
                  <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
                    {artist.name}
                  </h1>
                  <p className="text-xl text-gray-400">
                    {artist.tags?.tag?.[0]?.name || "Genre Tidak Diketahui"}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  {artist.stats && (
                    <Badge variant="outline" className="border-gray-600">
                      Pendengar: {parseInt(artist.stats.listeners).toLocaleString()}
                    </Badge>
                  )}
                </div>

                <Button
                  onClick={handleToggleLike}
                  className={`
                    w-full transition-all duration-200
                    ${
                      isLiked
                        ? "bg-pink-600/20 text-pink-400 border border-pink-400/50 hover:bg-pink-600/30"
                        : "bg-gray-700/50 text-gray-300 border border-gray-600 hover:bg-gray-700 hover:text-pink-400"
                    }
                  `}
                >
                  <Heart className={`w-4 h-4 mr-2 ${isLiked ? "fill-current" : ""}`} />
                  {isLiked ? "Disukai" : "Sukai Artis"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="lg:w-2/3 space-y-8">
          <Card className="bg-gray-800/30 border-gray-700">
            <CardHeader>
              <h2 className="text-2xl font-semibold">Biografi</h2>
            </CardHeader>
            <CardContent>
              {artist?.bio?.summary ? (
                <p className="text-gray-300 leading-relaxed" dangerouslySetInnerHTML={{ __html: artist.bio.summary.replace(/<a href="[^"]+">Read more on Last.fm<\/a>/i, '') }} />
              ) : (
                <p className="text-gray-400 italic">Biografi tidak tersedia untuk artis ini.</p>
              )}
            </CardContent>
          </Card>

          <Card className="bg-gray-800/30 border-gray-700">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Disc className="w-6 h-6 text-cyan-400" />
                <h2 className="text-2xl font-semibold">Album</h2>
                {albums.length > 0 && (
                  <Badge variant="outline" className="border-gray-600">
                    {albums.length}
                  </Badge>
                )}
              </div>
            </CardHeader>
            <CardContent>
              {albums.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {albums.map((album) => {
                    const rawAlbumImage = album.image?.find(img => img.size === 'large' || img.size === 'medium')?.['#text'];
                    const finalAlbumImage = (rawAlbumImage && !isLastFmKnownPlaceholder(rawAlbumImage)) ? rawAlbumImage : "/placeholder.svg?height=150&width=150";

                    return (
                      <div
                        key={album.mbid || album.name}
                        className="bg-gray-700/30 rounded-lg p-4 hover:bg-gray-700/50 transition-colors group"
                      >
                        <div className="relative mb-3">
                          <Image
                            src={finalAlbumImage}
                            alt={album.name}
                            width={150}
                            height={150}
                            className="w-full h-32 object-cover rounded-lg group-hover:shadow-lg group-hover:shadow-cyan-400/10 transition-shadow"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = '/placeholder.svg';
                            }}
                          />
                        </div>
                        <h3 className="font-semibold text-white group-hover:text-cyan-400 transition-colors truncate">
                          {album.name}
                        </h3>
                        <div className="flex items-center gap-2 mt-1">
                          {album.playcount !== undefined && (
                            <div className="flex items-center gap-1 text-xs text-gray-400">
                              <Calendar className="w-3 h-3" />
                              <span>{album.playcount.toLocaleString()} Putar</span>
                            </div>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Disc className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                  <p className="text-gray-400">Tidak ada informasi album tersedia</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Top Tracks */}
          {topTracks.length > 0 && (
            <Card className="bg-gray-800/30 border-gray-700">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Music className="w-6 h-6 text-cyan-400" />
                  <h2 className="text-2xl font-semibold">Top Tracks</h2>
                  <Badge variant="outline" className="border-gray-600">
                    {topTracks.length}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {topTracks.map((track, index) => (
                    <li key={track.mbid || track.name} className="py-2 border-b border-gray-700 last:border-b-0 flex items-center justify-between hover:bg-gray-700/50 rounded transition-colors">
                      <div className="flex items-center">
                        <span className="mr-4 text-gray-400">{index + 1}.</span>
                        <div>
                          <h4 className="text-white font-semibold">{track.name}</h4>
                          <p className="text-gray-500 text-sm">Pendengar: {track.listeners.toLocaleString()}</p>
                        </div>
                      </div>
                      <Link href={track.url} target="_blank" rel="noopener noreferrer">
                        <Button size="sm" variant="outline">
                          <ExternalLink className="w-4 h-4 mr-2" /> Lihat di Last.fm
                        </Button>
                      </Link>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}

function ArtistDetailSkeleton() {
  return (
    <div className="p-6 space-y-8">
      <Skeleton className="h-10 w-32" />

      <div className="flex flex-col lg:flex-row gap-8">
        <div className="lg:w-1/3">
          <Card className="bg-gray-800/30 border-gray-700">
            <CardContent className="p-6">
              <Skeleton className="w-full h-80 mb-6 rounded-md" />
              <div className="space-y-4">
                <div>
                  <Skeleton className="h-8 w-3/4 mb-2" />
                  <Skeleton className="h-6 w-1/2" />
                </div>
                <div className="flex gap-2">
                  <Skeleton className="h-6 w-16" />
                  <Skeleton className="h-6 w-20" />
                </div>
                <Skeleton className="h-10 w-full" />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="lg:w-2/3 space-y-8">
          <Card className="bg-gray-800/30 border-gray-700">
            <CardHeader>
              <Skeleton className="h-8 w-32" />
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800/30 border-gray-700">
            <CardHeader>
              <Skeleton className="h-8 w-24" />
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="bg-gray-700/30 rounded-lg p-4">
                    <Skeleton className="w-full h-32 mb-3 rounded-md" />
                    <Skeleton className="h-5 w-3/4 mb-1" />
                    <Skeleton className="h-4 w-1/2" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800/30 border-gray-700">
            <CardHeader>
              <Skeleton className="h-8 w-40" />
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {Array.from({ length: 5 }).map((_, i) => (
                  <li key={i} className="py-2 border-b border-gray-700 last:border-b-0 flex items-center justify-between">
                    <div className="flex items-center">
                      <Skeleton className="h-5 w-5 mr-4 rounded-full" />
                      <div>
                        <Skeleton className="h-5 w-64 mb-1" />
                        <Skeleton className="h-4 w-48" />
                      </div>
                    </div>
                    <Skeleton className="h-8 w-16" />
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
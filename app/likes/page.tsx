"use client"

import { useState, useEffect, useCallback } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Heart, Users, Loader2 } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { getAllArtistDetails, getArtistImageFromBandsintown } from '@/lib/api' // Pastikan ini diimpor dengan benar

interface ArtistFromAPI {
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

interface DisplayArtist {
  id: string; // ID yang konsisten (MBID atau slug nama artis)
  name: string;
  genre: string;
  image: string; // URL gambar akhir
  isLiked: boolean; // Selalu true di halaman ini
}

// Fungsi Helper untuk Deteksi Placeholder Last.fm (sama dengan app/page.tsx dan app/artist/[id]/page.tsx)
const isLastFmKnownPlaceholder = (url: string): boolean => {
  if (!url) return false;
  return url.includes('2a96cbd8b46e442fc41c2b86b821562f.png') ||
         url.includes('default_avatar.png') ||
         url.includes('_avatar.png');
};


export default function LikesPage() {
  const [likedArtists, setLikedArtists] = useState<DisplayArtist[]>([])
  const [loading, setLoading] = useState(true)

  const fetchLikedArtistsData = useCallback(async () => {
    setLoading(true)
    const savedLikes = localStorage.getItem("likedArtists")
    const likedArtistIds: string[] = savedLikes ? JSON.parse(savedLikes) : []

    const fetchedArtists: DisplayArtist[] = []

    for (const artistId of likedArtistIds) {
      try {
        const artistDetail: ArtistFromAPI | null = await getAllArtistDetails(artistId) // Mendapatkan detail artis berdasarkan ID/nama
        if (artistDetail) {
          // Ambil gambar dari Bandsintown terlebih dahulu
          const bandsintownImage = await getArtistImageFromBandsintown(artistDetail.name);

          // Gambar dari Last.fm (jika ada dan bukan placeholder)
          const lastFmRawImage = artistDetail.image?.find(img => img.size === 'extralarge' || img.size === 'large' || img.size === 'medium')?.['#text'];
          const lastFmImageCleaned = (lastFmRawImage && !isLastFmKnownPlaceholder(lastFmRawImage)) ? lastFmRawImage : null;

          // Prioritaskan: Bandsintown -> Last.fm (jika bukan placeholder) -> Placeholder lokal
          const finalImage = bandsintownImage || lastFmImageCleaned || "/placeholder.svg?height=300&width=300";

          fetchedArtists.push({
            id: artistId, // Menggunakan ID yang sama dengan yang disimpan
            name: artistDetail.name,
            genre: artistDetail.tags?.tag?.[0]?.name || 'Unknown Genre', // Ambil genre dari Last.fm
            image: finalImage,
            isLiked: true, // Karena ini halaman artis yang disukai, ini selalu true
          })
        }
      } catch (error) {
        console.error(`Error fetching liked artist with ID ${artistId}:`, error)
        // Opsional: tambahkan artis placeholder jika gagal mengambil data
        fetchedArtists.push({
          id: artistId,
          name: "Unknown Artist",
          genre: "Unknown Genre",
          image: "/placeholder.svg?height=300&width=300",
          isLiked: true,
        });
      }
    }
    setLikedArtists(fetchedArtists)
    setLoading(false)
  }, [])

  useEffect(() => {
    fetchLikedArtistsData()
  }, [fetchLikedArtistsData])

  const handleUnlike = (artistId: string) => {
    // Hapus dari state lokal
    const updatedArtists = likedArtists.filter((artist) => artist.id !== artistId)
    setLikedArtists(updatedArtists)

    // Perbarui localStorage
    const savedLikes = localStorage.getItem("likedArtists")
    const likedArtistIds = savedLikes ? JSON.parse(savedLikes) : []
    const updatedLikes = likedArtistIds.filter((id: string) => id !== artistId)
    localStorage.setItem("likedArtists", JSON.stringify(updatedLikes))
  }

  if (loading) {
    return (
      <div className="p-6 space-y-8">
        <div className="flex items-center justify-between">
          <Skeleton className="h-10 w-64" />
          <Skeleton className="h-6 w-32" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i} className="bg-gray-800/30 border-gray-700">
              <CardContent className="p-0">
                <Skeleton className="w-full h-48 object-cover" />
                <div className="p-4">
                  <Skeleton className="h-6 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-1/2" />
                  <div className="flex items-center justify-between text-xs text-gray-500 mt-2">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-4 w-16" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-pink-400 to-purple-500 bg-clip-text text-transparent">
            Liked Artists
          </h1>
          <p className="text-gray-400 text-lg">Your favorite artists collection</p>
        </div>

        <div className="flex items-center gap-2 text-sm text-gray-400">
          <Heart className="w-4 h-4 text-pink-400 fill-current" />
          <span>{likedArtists.length} Artists Liked</span>
        </div>
      </div>

      {/* Liked Artists Grid */}
      {likedArtists.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
          {likedArtists.map((artist) => (
            <Card
              key={artist.id}
              className="bg-gray-800/30 border-gray-700 hover:border-pink-400/50 transition-all duration-300 group cursor-pointer overflow-hidden"
            >
              <CardContent className="p-0">
                <Link href={`/artist/${artist.id}`}>
                  <div className="relative">
                    <Image
                      src={artist.image || "/placeholder.svg?height=300&width=300"}
                      alt={artist.name}
                      width={300}
                      height={300}
                      className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = '/placeholder.svg?height=300&width=300';
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>
                </Link>

                <div className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <Link href={`/artist/${artist.id}`} className="flex-1 min-w-0">
                      <h3 className="font-semibold text-lg text-white group-hover:text-pink-400 transition-colors truncate">
                        {artist.name}
                      </h3>
                      <p className="text-gray-400 text-sm truncate">{artist.genre}</p>
                    </Link>

                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={(e) => {
                        e.preventDefault()
                        handleUnlike(artist.id)
                      }}
                      className="ml-2 text-pink-400 hover:text-pink-300 hover:bg-pink-400/10 transition-all duration-200 hover:scale-110"
                    >
                      <Heart className="w-5 h-5 fill-current" />
                    </Button>
                  </div>

                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>Click to explore</span>
                    <span className="text-pink-400 font-medium">♥ Liked</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <Heart className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2">No liked artists yet</h3>
          <p className="text-gray-400 mb-6">Start exploring artists and like your favorites</p>
          <Link href="/">
            <Button className="bg-gradient-to-r from-pink-400 to-purple-500 hover:from-pink-500 hover:to-purple-600 transition-all duration-300">
              <Users className="w-4 h-4 mr-2" />
              Discover Artists
            </Button>
          </Link>
        </div>
      )}
    </div>
  )
}

function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={`animate-pulse bg-gray-700 rounded-md ${className}`} {...props} />
}
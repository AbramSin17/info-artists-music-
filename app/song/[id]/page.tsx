"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Play, Pause, Heart, Share2, Plus, ArrowLeft } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { Skeleton } from "@/components/ui/skeleton"

interface Artist {
  idArtist: string
  strArtist: string
  strBiography: string
  strArtistThumb: string
  strGenre: string
}

interface Song {
  id: string
  title: string
  artist: string
  genre: string
  duration: string
  albumCover: string
}

const mockSongs: Record<string, Song> = {
  "1": {
    id: "1",
    title: "Midnight City",
    artist: "M83",
    genre: "Electronic",
    duration: "4:03",
    albumCover: "/placeholder.svg?height=300&width=300",
  },
  "10": {
    id: "10",
    title: "Starboy",
    artist: "The Weeknd",
    genre: "R&B",
    duration: "3:50",
    albumCover: "/placeholder.svg?height=300&width=300",
  },
  "11": {
    id: "11",
    title: "Bohemian Rhapsody",
    artist: "Queen",
    genre: "Rock",
    duration: "5:55",
    albumCover: "/placeholder.svg?height=300&width=300",
  },
}

export default function SongDetailPage() {
  const params = useParams()
  const songId = params.id as string
  const [song, setSong] = useState<Song | null>(null)
  const [artist, setArtist] = useState<Artist | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchSongAndArtist = async () => {
      setLoading(true)

      // Get song from mock data
      const songData = mockSongs[songId]
      if (songData) {
        setSong(songData)

        // Fetch artist data from TheAudioDB
        try {
          const response = await fetch(
            `https://www.theaudiodb.com/api/v1/json/2/search.php?s=${encodeURIComponent(songData.artist)}`,
          )

          // If the request failed or returned no body, skip JSON parsing
          if (!response.ok) {
            throw new Error(`TheAudioDB responded with ${response.status}`)
          }

          // Response might be empty → guard against that
          const text = await response.text()
          if (text) {
            const data = JSON.parse(text)
            if (data?.artists?.length) {
              setArtist(data.artists[0])
            }
          }
        } catch (error) {
          console.error("Error fetching artist data:", error)
        }
      }

      setLoading(false)
    }

    fetchSongAndArtist()
  }, [songId])

  if (loading) {
    return <SongDetailSkeleton />
  }

  if (!song) {
    return (
      <div className="p-6 text-center">
        <h1 className="text-2xl font-bold mb-4">Song not found</h1>
        <Link href="/">
          <Button>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-8">
      {/* Back Button */}
      <Link href="/">
        <Button variant="ghost" className="hover:bg-gray-800/50">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Home
        </Button>
      </Link>

      {/* Song Header */}
      <div className="flex flex-col lg:flex-row gap-8">
        <div className="lg:w-1/3">
          <Card className="glass-effect border-gray-800">
            <CardContent className="p-6">
              <div className="relative mb-6">
                <Image
                  src={song.albumCover || "/placeholder.svg"}
                  alt={song.title}
                  width={300}
                  height={300}
                  className="w-full rounded-lg glow-border"
                />
                <Button
                  size="icon"
                  className="absolute bottom-4 right-4 w-16 h-16 rounded-full neon-gradient animate-pulse-glow"
                  onClick={() => setIsPlaying(!isPlaying)}
                >
                  {isPlaying ? <Pause className="w-8 h-8" /> : <Play className="w-8 h-8" />}
                </Button>
              </div>

              <div className="space-y-4">
                <div>
                  <h1 className="text-2xl font-bold glow-text">{song.title}</h1>
                  <p className="text-xl text-gray-400">{song.artist}</p>
                </div>

                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="bg-cyan-400/20 text-cyan-400">
                    {song.genre}
                  </Badge>
                  <Badge variant="outline" className="border-gray-600">
                    {song.duration}
                  </Badge>
                </div>

                <div className="flex gap-2">
                  <Button className="flex-1 neon-gradient">
                    <Play className="w-4 h-4 mr-2" />
                    Play
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    className="border-gray-600 hover:border-cyan-400 bg-transparent"
                  >
                    <Heart className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    className="border-gray-600 hover:border-cyan-400 bg-transparent"
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    className="border-gray-600 hover:border-cyan-400 bg-transparent"
                  >
                    <Share2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Artist Info */}
        <div className="lg:w-2/3">
          <Card className="glass-effect border-gray-800">
            <CardHeader>
              <h2 className="text-2xl font-semibold">About {song.artist}</h2>
            </CardHeader>
            <CardContent className="space-y-6">
              {artist ? (
                <>
                  {artist.strArtistThumb && (
                    <div className="flex justify-center">
                      <Image
                        src={artist.strArtistThumb || "/placeholder.svg"}
                        alt={artist.strArtist}
                        width={200}
                        height={200}
                        className="rounded-lg glow-border"
                      />
                    </div>
                  )}

                  {artist.strGenre && (
                    <div>
                      <h3 className="font-semibold mb-2 text-cyan-400">Genre</h3>
                      <p className="text-gray-300">{artist.strGenre}</p>
                    </div>
                  )}

                  {artist.strBiography && (
                    <div>
                      <h3 className="font-semibold mb-2 text-cyan-400">Biography</h3>
                      <p className="text-gray-300 leading-relaxed">
                        {artist.strBiography.length > 500
                          ? `${artist.strBiography.substring(0, 500)}...`
                          : artist.strBiography}
                      </p>
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-400">Artist information not available</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

function SongDetailSkeleton() {
  return (
    <div className="p-6 space-y-8">
      <Skeleton className="h-10 w-32" />

      <div className="flex flex-col lg:flex-row gap-8">
        <div className="lg:w-1/3">
          <Card className="glass-effect border-gray-800">
            <CardContent className="p-6">
              <Skeleton className="w-full h-80 mb-6" />
              <div className="space-y-4">
                <div>
                  <Skeleton className="h-8 w-3/4 mb-2" />
                  <Skeleton className="h-6 w-1/2" />
                </div>
                <div className="flex gap-2">
                  <Skeleton className="h-6 w-16" />
                  <Skeleton className="h-6 w-12" />
                </div>
                <div className="flex gap-2">
                  <Skeleton className="h-10 flex-1" />
                  <Skeleton className="h-10 w-10" />
                  <Skeleton className="h-10 w-10" />
                  <Skeleton className="h-10 w-10" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="lg:w-2/3">
          <Card className="glass-effect border-gray-800">
            <CardHeader>
              <Skeleton className="h-8 w-48" />
            </CardHeader>
            <CardContent className="space-y-6">
              <Skeleton className="h-48 w-48 mx-auto" />
              <div>
                <Skeleton className="h-6 w-16 mb-2" />
                <Skeleton className="h-4 w-32" />
              </div>
              <div>
                <Skeleton className="h-6 w-24 mb-2" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

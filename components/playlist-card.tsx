"use client"

import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Play, Music, MoreHorizontal } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useState } from "react"

interface Song {
  id: string
  title: string
  artist: string
  genre: string
  duration: string
}

interface Playlist {
  id: string
  name: string
  description: string
  songCount: number
  image: string
  songs: Song[]
}

interface PlaylistCardProps {
  playlist: Playlist
}

export function PlaylistCard({ playlist }: PlaylistCardProps) {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <Card
      className="glass-effect border-gray-800 hover:glow-border transition-all duration-300 group cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <CardHeader className="p-4">
        <div className="relative">
          <Image
            src={playlist.image || "/placeholder.svg"}
            alt={playlist.name}
            width={200}
            height={200}
            className="w-full h-48 object-cover rounded-lg"
          />
          {isHovered && (
            <div className="absolute inset-0 bg-black/50 rounded-lg flex items-center justify-center">
              <Button size="icon" className="w-12 h-12 rounded-full neon-gradient animate-pulse-glow">
                <Play className="w-6 h-6" />
              </Button>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        <div className="flex items-start justify-between mb-2">
          <div>
            <h3 className="font-semibold text-lg group-hover:text-cyan-400 transition-colors">{playlist.name}</h3>
            <p className="text-gray-400 text-sm">{playlist.description}</p>
          </div>
          <Button variant="ghost" size="icon" className="opacity-0 group-hover:opacity-100 transition-opacity">
            <MoreHorizontal className="w-4 h-4" />
          </Button>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-400 mb-4">
          <Music className="w-4 h-4" />
          <span>{playlist.songCount} songs</span>
        </div>
        <div className="space-y-2">
          {playlist.songs.slice(0, 3).map((song) => (
            <Link
              key={song.id}
              href={`/song/${song.id}`}
              className="flex items-center justify-between p-2 rounded hover:bg-gray-800/50 transition-colors group/song"
            >
              <div>
                <p className="font-medium text-sm group-hover/song:text-cyan-400 transition-colors">{song.title}</p>
                <p className="text-xs text-gray-400">{song.artist}</p>
              </div>
              <span className="text-xs text-gray-500">{song.duration}</span>
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Play, Heart, Share2 } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

const featuredSongs = [
  {
    id: "10",
    title: "Starboy",
    artist: "The Weeknd",
    genre: "R&B",
    duration: "3:50",
    image: "/placeholder.svg?height=80&width=80",
  },
  {
    id: "11",
    title: "Bohemian Rhapsody",
    artist: "Queen",
    genre: "Rock",
    duration: "5:55",
    image: "/placeholder.svg?height=80&width=80",
  },
  {
    id: "12",
    title: "Shape of You",
    artist: "Ed Sheeran",
    genre: "Pop",
    duration: "3:53",
    image: "/placeholder.svg?height=80&width=80",
  },
]

export function FeaturedSongs() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {featuredSongs.map((song) => (
        <Card
          key={song.id}
          className="glass-effect border-gray-800 hover:glow-border transition-all duration-300 group"
        >
          <CardContent className="p-4">
            <div className="flex items-center gap-4">
              <div className="relative">
                <Image
                  src={song.image || "/placeholder.svg"}
                  alt={song.title}
                  width={80}
                  height={80}
                  className="rounded-lg"
                />
                <Button
                  size="icon"
                  className="absolute -top-2 -right-2 w-8 h-8 rounded-full neon-gradient opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Play className="w-4 h-4" />
                </Button>
              </div>
              <div className="flex-1 min-w-0">
                <Link href={`/song/${song.id}`}>
                  <h3 className="font-semibold truncate hover:text-cyan-400 transition-colors">{song.title}</h3>
                </Link>
                <p className="text-gray-400 text-sm">{song.artist}</p>
                <div className="flex items-center gap-4 mt-2">
                  <span className="text-xs text-gray-500">{song.genre}</span>
                  <span className="text-xs text-gray-500">{song.duration}</span>
                </div>
              </div>
              <div className="flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button variant="ghost" size="icon" className="w-8 h-8">
                  <Heart className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="icon" className="w-8 h-8">
                  <Share2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

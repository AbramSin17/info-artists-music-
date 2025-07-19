// components/artist-card.tsx
"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Heart } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useState } from "react"

interface Artist {
  id: string
  name: string
  genre: string
  image: string // Ini akan menjadi URL gambar yang sudah difilter di app/page.tsx
  isLiked: boolean
}

interface ArtistCardProps {
  artist: Artist
  onToggleLike: (artistId: string) => void
}

export function ArtistCard({ artist, onToggleLike }: ArtistCardProps) {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <Card
      className="bg-gray-800/30 border-gray-700 hover:border-cyan-400/50 transition-all duration-300 group cursor-pointer overflow-hidden"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <CardContent className="p-0">
        {/* Menggunakan encodeURIComponent untuk artist.name */}
        <Link href={`/artist/${encodeURIComponent(artist.name)}`}>
          <div className="relative">
            <Image
              src={artist.image || "/placeholder.svg?height=300&width=300"} // Gunakan artist.image yang sudah difilter
              alt={artist.name}
              width={300}
              height={300}
              className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
              onError={(e) => {
                // Tambahkan onError di sini sebagai jaring pengaman terakhir
                (e.target as HTMLImageElement).src = '/placeholder.svg?height=300&width=300';
              }}
            />
            {isHovered && (
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
            )}
          </div>
        </Link>

        <div className="p-4">
          <div className="flex items-start justify-between mb-2">
            {/* Menggunakan encodeURIComponent untuk artist.name */}
            <Link href={`/artist/${encodeURIComponent(artist.name)}`} className="flex-1 min-w-0">
              <h3 className="font-semibold text-lg text-white group-hover:text-cyan-400 transition-colors truncate">
                {artist.name}
              </h3>
              <p className="text-gray-400 text-sm truncate">{artist.genre}</p>
            </Link>

            <Button
              variant="ghost"
              size="icon"
              onClick={(e) => {
                e.preventDefault()
                onToggleLike(artist.id)
              }}
              className={`
                ml-2 transition-all duration-200 hover:scale-110
                ${artist.isLiked ? "text-pink-400 hover:text-pink-300" : "text-gray-400 hover:text-pink-400"}
              `}
            >
              <Heart className={`w-5 h-5 transition-all duration-200 ${artist.isLiked ? "fill-current" : ""}`} />
            </Button>
          </div>

          <div className="flex items-center justify-between text-xs text-gray-500">
            <span>Click to explore</span>
            {artist.isLiked && <span className="text-pink-400 font-medium">♥ Liked</span>}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
import { PlaylistCard } from "@/components/playlist-card"
import { Button } from "@/components/ui/button"
import { Plus, Music } from "lucide-react"

const mockPlaylists = [
  {
    id: "1",
    name: "Chill Vibes",
    description: "Relaxing tunes for your downtime",
    songCount: 24,
    image: "/placeholder.svg?height=200&width=200",
    songs: [
      { id: "1", title: "Midnight City", artist: "M83", genre: "Electronic", duration: "4:03" },
      { id: "2", title: "Weightless", artist: "Marconi Union", genre: "Ambient", duration: "8:10" },
      { id: "3", title: "Teardrop", artist: "Massive Attack", genre: "Trip Hop", duration: "5:29" },
    ],
  },
  {
    id: "2",
    name: "Workout Pump",
    description: "High-energy tracks to fuel your workout",
    songCount: 18,
    image: "/placeholder.svg?height=200&width=200",
    songs: [
      { id: "4", title: "Till I Collapse", artist: "Eminem", genre: "Hip Hop", duration: "4:57" },
      { id: "5", title: "Thunder", artist: "Imagine Dragons", genre: "Rock", duration: "3:07" },
      { id: "6", title: "Stronger", artist: "Kanye West", genre: "Hip Hop", duration: "5:11" },
    ],
  },
  {
    id: "3",
    name: "My Vibes",
    description: "Your personal collection of favorites",
    songCount: 32,
    image: "/placeholder.svg?height=200&width=200",
    songs: [
      { id: "7", title: "Blinding Lights", artist: "The Weeknd", genre: "Pop", duration: "3:20" },
      { id: "8", title: "Good 4 U", artist: "Olivia Rodrigo", genre: "Pop Rock", duration: "2:58" },
      { id: "9", title: "Levitating", artist: "Dua Lipa", genre: "Pop", duration: "3:23" },
    ],
  },
  {
    id: "4",
    name: "Late Night Drive",
    description: "Perfect soundtrack for midnight adventures",
    songCount: 15,
    image: "/placeholder.svg?height=200&width=200",
    songs: [
      { id: "10", title: "Starboy", artist: "The Weeknd", genre: "R&B", duration: "3:50" },
      { id: "11", title: "Bohemian Rhapsody", artist: "Queen", genre: "Rock", duration: "5:55" },
      { id: "12", title: "Shape of You", artist: "Ed Sheeran", genre: "Pop", duration: "3:53" },
    ],
  },
]

export default function PlaylistsPage() {
  return (
    <div className="p-6 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold glow-text mb-2">My Playlists</h1>
          <p className="text-gray-400">Your curated music collections</p>
        </div>
        <Button className="neon-gradient hover:scale-105 transition-transform duration-300">
          <Plus className="w-4 h-4 mr-2" />
          Create Playlist
        </Button>
      </div>

      {/* Playlists Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {mockPlaylists.map((playlist) => (
          <PlaylistCard key={playlist.id} playlist={playlist} />
        ))}
      </div>

      {/* Empty State (if no playlists) */}
      {mockPlaylists.length === 0 && (
        <div className="text-center py-16">
          <Music className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2">No playlists yet</h3>
          <p className="text-gray-400 mb-6">Create your first playlist to get started</p>
          <Button className="neon-gradient">
            <Plus className="w-4 h-4 mr-2" />
            Create Your First Playlist
          </Button>
        </div>
      )}
    </div>
  )
}

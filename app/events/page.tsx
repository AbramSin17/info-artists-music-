// app/events/page.tsx
"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Calendar, MapPin, Music, Plus, Search, Ticket } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"
import { EventNoteModal } from "@/components/event-note-modal"

import { format } from "date-fns"
import { id } from "date-fns/locale"
import { getArtistEventsFromBandsintown } from "@/lib/api"

// Interfaces
interface Event {
  id: string
  title: string
  artist_name: string
  datetime: string
  venue: {
    name: string
    city: string
    country: string
  }
  description?: string
  ticketUrl?: string
  bandsintownUrl?: string
}

interface Note {
  id: string
  eventId: string
  title: string
  content: string
  createdAt: string
  updatedAt: string
  eventTitle: string
  eventArtistName: string
  eventDatetime: string
  eventVenueName: string
  eventVenueCity: string
  eventVenueCountry: string
}


// Popular artists list
const popularArtistsForEvents = [
  "Coldplay", "Taylor Swift", "Ed Sheeran", "Billie Eilish", "Dua Lipa", "Queen",
  "The Weeknd", "Adele", "Bruno Mars", "Ariana Grande", "Post Malone", "Harry Styles",
  "Bad Bunny", "Drake", "BTS", "Blackpink", "Eminem", "Rihanna", "Justin Bieber",
  "Beyonce", "Lady Gaga", "Daft Punk", "Linkin Park", "Metallica", "Red Hot Chili Peppers",
  "Foo Fighters", "Green Day", "Imagine Dragons", "Maroon 5", "Twenty One Pilots"
]

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([])
  const [notes, setNotes] = useState<Note[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  useEffect(() => {
    const savedNotes = localStorage.getItem("eventNotes")
    if (savedNotes) setNotes(JSON.parse(savedNotes))
    fetchEvents()
  }, [])

  const fetchEvents = async () => {
    setLoading(true)
    const allFetchedEvents: Event[] = []

    try {
      for (const artistName of popularArtistsForEvents) {
        try {
          const bandsintownEvents = await getArtistEventsFromBandsintown(artistName)
          bandsintownEvents.forEach(event => {
            allFetchedEvents.push({
              id: event.id,
              title: event.title || `${event.artist?.name || (event.lineup?.join(", ") || 'Unknown Artist')} Live at ${event.venue?.name || 'Unknown Venue'}`,
              artist_name: event.artist?.name || (event.lineup?.join(", ") || 'Unknown Artist'),
              datetime: event.datetime,
              venue: {
                name: event.venue?.name || 'Unknown Venue',
                city: event.venue?.city || 'Unknown City',
                country: event.venue?.country || 'Unknown Country',
              },
              description: event.description || '',
              ticketUrl: event.offers?.find(offer => offer.type === "Tickets")?.url,
              bandsintownUrl: event.url,
            })
          })
        } catch (error) {
          console.error(`Error fetching events for ${artistName}:`, error)
        }
      }
      allFetchedEvents.sort((a, b) => new Date(a.datetime).getTime() - new Date(b.datetime).getTime())
      setEvents(allFetchedEvents)
    } catch (error) {
      console.error("Error fetching events:", error)
    } finally {
      setLoading(false)
    }
  }

  // Filtered events
  const filteredEvents = events.filter(event =>
    event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    event.artist_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    event.venue.city.toLowerCase().includes(searchTerm.toLowerCase())
  )

  // Note functions
  const handleAddNote = (eventId: string, title: string, content: string) => {
    if (!selectedEvent) return

    const newNote: Note = {
      id: Date.now().toString(),
      eventId,
      title,
      content,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      eventTitle: selectedEvent.title,
      eventArtistName: selectedEvent.artist_name,
      eventDatetime: selectedEvent.datetime,
      eventVenueName: selectedEvent.venue.name,
      eventVenueCity: selectedEvent.venue.city,
      eventVenueCountry: selectedEvent.venue.country,
    }

    const updatedNotes = [...notes, newNote]
    setNotes(updatedNotes)
    localStorage.setItem("eventNotes", JSON.stringify(updatedNotes))
  }

  const handleUpdateNote = (noteId: string, content: string) => {
    const updatedNotes = notes.map(note =>
      note.id === noteId ? { ...note, content, updatedAt: new Date().toISOString() } : note
    )
    setNotes(updatedNotes)
    localStorage.setItem("eventNotes", JSON.stringify(updatedNotes))
  }

  const handleDeleteNote = (noteId: string) => {
    const updatedNotes = notes.filter(note => note.id !== noteId)
    setNotes(updatedNotes)
    localStorage.setItem("eventNotes", JSON.stringify(updatedNotes))
  }

  const getEventNote = (eventId: string): Note | null =>
    notes.find((note) => note.eventId === eventId) || null

  const openNoteModal = (event: Event) => {
    setSelectedEvent(event)
    setIsModalOpen(true)
  }

  if (loading) return <EventsSkeleton />

  return (
    <div className="p-6 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold glow-text mb-2">Events & Concerts</h1>
          <p className="text-gray-400">Discover live music events and save your notes</p>
        </div>
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Search events, artists, or cities..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="pl-10 bg-gray-800/50 border-gray-700 focus:border-cyan-400"
          />
        </div>
      </div>

      {/* Events Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {filteredEvents.length > 0 ? filteredEvents.map(event => {
          const eventNote = getEventNote(event.id)
          const eventDate = new Date(event.datetime)

          return (
            <Card key={event.id} className="glass-effect border-gray-800 hover:glow-border transition-all duration-300 group">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg group-hover:text-cyan-400 transition-colors">{event.title}</h3>
                    <p className="text-cyan-400 font-medium">{event.artist_name}</p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => openNoteModal(event)}
                    className="opacity-0 group-hover:opacity-100 hover:bg-cyan-400/20"
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                <div className="flex items-center gap-2 text-sm text-gray-400">
                  <Calendar className="w-4 h-4" />
                  <span>{format(eventDate, "EEEE, dd MMMM yyyy HH:mm", { locale: id })} WIB</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-400">
                  <MapPin className="w-4 h-4" />
                  <span>{event.venue.name}, {event.venue.city}, {event.venue.country}</span>
                </div>

                {event.ticketUrl && (
                  <Link href={event.ticketUrl} target="_blank" rel="noopener noreferrer" className="w-full">
                    <Button className="w-full bg-green-600 hover:bg-green-700 text-white">
                      <Ticket className="w-4 h-4 mr-2" />
                      Beli Tiket
                    </Button>
                  </Link>
                )}
                {!event.ticketUrl && event.bandsintownUrl && (
                  <Link href={event.bandsintownUrl} target="_blank" rel="noopener noreferrer" className="w-full">
                    <Button variant="outline" className="w-full border-gray-600 hover:border-cyan-400 hover:text-cyan-400">
                      Lihat di Bandsintown
                    </Button>
                  </Link>
                )}

                {eventNote ? (
                  <div className="p-3 bg-gray-800/50 rounded-lg border border-gray-700">
                    <div className="flex items-center gap-2 mb-2">
                      <Music className="w-4 h-4 text-cyan-400" />
                      <span className="text-sm font-medium text-cyan-400">Your Note</span>
                    </div>
                    <p className="text-sm text-gray-300 line-clamp-3">{eventNote.content}</p>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => openNoteModal(event)}
                      className="mt-2 text-xs hover:text-cyan-400"
                    >
                      Edit Note
                    </Button>
                  </div>
                ) : (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => openNoteModal(event)}
                    className="w-full border-gray-600 hover:border-cyan-400 hover:text-cyan-400"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Tambah Catatan
                  </Button>
                )}
              </CardContent>
            </Card>
          )
        }) : null}
      </div>

      {filteredEvents.length === 0 && !loading && (
        <div className="text-center py-12 col-span-full">
          <Calendar className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2">Tidak ada event mendatang ditemukan</h3>
          <p className="text-gray-400">Coba periksa kembali nanti atau sesuaikan pencarian.</p>
        </div>
      )}

      {/* Event Note Modal */}
      <EventNoteModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        event={selectedEvent}
        existingNote={selectedEvent ? getEventNote(selectedEvent.id) : null}
        onSave={handleAddNote}
        onUpdate={handleUpdateNote}
        onDelete={handleDeleteNote}
      />

    </div>
  )
}

function EventsSkeleton() {
  return (
    <div className="p-6 space-y-8">
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div>
          <Skeleton className="h-10 w-80 mb-2" />
          <Skeleton className="h-5 w-64" />
        </div>
        <Skeleton className="h-10 w-80" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <Card key={i} className="glass-effect border-gray-800">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <Skeleton className="h-6 w-3/4 mb-2" />
                  <Skeleton className="h-5 w-1/2" />
                </div>
                <Skeleton className="h-8 w-8" />
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
              <Skeleton className="h-10 w-full" />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

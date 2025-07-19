// app/notes/page.tsx
"use client"

import React, { useEffect, useState, useCallback } from "react"; // Tambahkan useCallback
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Calendar, MapPin, Music, Search, Edit, Trash2, Plus, Loader2
} from "lucide-react";
import { EventNoteModal } from "@/components/event-note-modal";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { getArtistEventsFromBandsintown } from "@/lib/api"; //

// Interfaces
interface Note {
  id: string;
  eventId: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  eventTitle: string;
  eventArtistName: string;
  eventDatetime: string;
  eventVenueName: string;
  eventVenueCity: string;
  eventVenueCountry: string;
}

interface EventForModal {
  id: string;
  title: string;
  artist_name: string;
  datetime: string;
  venue: {
    name: string;
    city: string;
    country: string;
  };
}

// Daftar artis populer
const popularArtistsForEvents = [
  "Coldplay", "Taylor Swift", "Ed Sheeran", "Billie Eilish", "Dua Lipa",
  "Queen", "The Weeknd", "Adele", "Bruno Mars", "Ariana Grande", "Post Malone",
  "Harry Styles", "Bad Bunny", "Drake", "BTS", "Blackpink", "Eminem", "Rihanna",
  "Justin Bieber", "Beyonce", "Lady Gaga", "Daft Punk", "Linkin Park",
  "Metallica", "Red Hot Chili Peppers", "Foo Fighters", "Green Day",
  "Imagine Dragons", "Maroon 5", "Twenty One Pilots"
];

export default function NotesPage() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [eventsForAddModal, setEventsForAddModal] = useState<EventForModal[]>([]);
  const [loadingEventsForModal, setLoadingEventsForModal] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load notes & events saat mount
  useEffect(() => {
    const savedNotes = localStorage.getItem("eventNotes"); //
    if (savedNotes) setNotes(JSON.parse(savedNotes)); //

    const fetchEvents = async () => {
      setLoadingEventsForModal(true); //
      setError(null); //
      const allEvents: EventForModal[] = []; //

      try {
        await Promise.all(
          popularArtistsForEvents.map(async (artistName) => { //
            try {
              const bandsintownEvents = await getArtistEventsFromBandsintown(artistName); //
              bandsintownEvents.forEach(event => { //
                allEvents.push({ //
                  id: event.id, //
                  title: event.title || //
                    `${event.artist?.name || event.lineup?.join(", ") || "Unknown Artist"} Live at ${event.venue?.name || "Unknown Venue"}`, //
                  artist_name: event.artist?.name || event.lineup?.join(", ") || "Unknown Artist", //
                  datetime: event.datetime || new Date().toISOString(), // Pastikan datetime selalu ada
                  venue: {
                    name: event.venue?.name || "Unknown Venue", //
                    city: event.venue?.city || "Unknown City", //
                    country: event.venue?.country || "Unknown Country" //
                  }
                });
              });
            } catch (e) {
              console.error(`Gagal mengambil event untuk ${artistName}:`, e); //
            }
          })
        );
        allEvents.sort((a, b) => new Date(a.datetime).getTime() - new Date(b.datetime).getTime()); //
        setEventsForAddModal(allEvents); //
      } catch {
        setError("Gagal memuat event. Silakan coba lagi nanti."); //
      } finally {
        setLoadingEventsForModal(false); //
      }
    };

    fetchEvents(); //
  }, []); // [] agar hanya berjalan sekali saat mount

  // Filter notes sesuai search
  const filteredNotes = notes.filter(note => //
    note.content.toLowerCase().includes(searchTerm.toLowerCase()) || //
    note.title.toLowerCase().includes(searchTerm.toLowerCase()) || //
    note.eventTitle.toLowerCase().includes(searchTerm.toLowerCase()) || //
    note.eventArtistName.toLowerCase().includes(searchTerm.toLowerCase()) || //
    note.eventVenueCity.toLowerCase().includes(searchTerm.toLowerCase()) //
  );

  // CRUD functions
  const handleAddNote = (eventId: string, title: string, content: string) => { //
    const eventDetails = eventsForAddModal.find(e => e.id === eventId); //
    if (!eventDetails) return console.error("Event tidak ditemukan:", eventId); //

    // Validasi dan set safeDatetime
    const safeDatetime = eventDetails.datetime && !isNaN(new Date(eventDetails.datetime).getTime()) //
      ? eventDetails.datetime //
      : new Date().toISOString(); //

    const newNote: Note = { //
      id: Date.now().toString(), //
      eventId, //
      title, //
      content, //
      createdAt: new Date().toISOString(), //
      updatedAt: new Date().toISOString(), //
      eventTitle: eventDetails.title, //
      eventArtistName: eventDetails.artist_name, //
      eventDatetime: safeDatetime, // Gunakan safeDatetime
      eventVenueName: eventDetails.venue.name, //
      eventVenueCity: eventDetails.venue.city, //
      eventVenueCountry: eventDetails.venue.country, //
    }

    const updated = [...notes, newNote]; //
    setNotes(updated); //
    localStorage.setItem("eventNotes", JSON.stringify(updated)); //
  };

  const handleUpdateNote = (noteId: string, title: string, content: string) => { //
    const updated = notes.map(note => //
      note.id === noteId ? { ...note, title, content, updatedAt: new Date().toISOString() } : note //
    );
    setNotes(updated); //
    localStorage.setItem("eventNotes", JSON.stringify(updated)); //
  };

  const handleDeleteNote = (noteId: string) => { //
    const updated = notes.filter(note => note.id !== noteId); //
    setNotes(updated); //
    localStorage.setItem("eventNotes", JSON.stringify(updated)); //
  };

  // Modal handlers
  const openEditModal = (note: Note) => { //
    setSelectedNote(note); //
    setIsModalOpen(true); //
  };

  const closeModal = () => { //
    setIsModalOpen(false); //
    setSelectedNote(null); //
  };

  const isLoading = loadingEventsForModal || (notes.length === 0 && !searchTerm); //

  return (
    <div className="p-6 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold glow-text mb-2">My Notes</h1>
          <p className="text-gray-400">Your personal event memories and thoughts</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search notes or events..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="pl-10 w-full sm:w-80 bg-gray-800/50 border-gray-700 focus:border-cyan-400"
            />
          </div>
          <Button
            onClick={() => { setSelectedNote(null); setIsModalOpen(true); }}
            disabled={loadingEventsForModal}
            className="bg-gradient-to-r from-cyan-400 to-purple-500 hover:from-cyan-500 hover:to-purple-600"
          >
            {loadingEventsForModal ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Loading...</> : <><Plus className="w-4 h-4 mr-2" />Add Note</>}
          </Button>
        </div>
      </div>

      {/* Konten */}
      {error ? (
        <div className="text-center py-16 text-red-400">{error}</div>
      ) : isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <Card key={i} className="glass-effect border-gray-800">
              <CardContent className="p-6 space-y-4">
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : filteredNotes.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredNotes.map(note => {
            const eventDate = new Date(note.eventDatetime); //
            const formattedDate = !isNaN(eventDate.getTime()) //
              ? format(eventDate, "EEEE, dd MMMM yyyy HH:mm", { locale: id }) + " WIB" //
              : "Tanggal tidak valid"; //

            return (
              <Card
                key={note.id}
                className="glass-effect border-gray-800 hover:glow-border group cursor-pointer"
                onClick={() => openEditModal(note)}
              >
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-lg truncate group-hover:text-cyan-400">{note.eventTitle}</h3>
                      <p className="text-cyan-400 font-medium">{note.eventArtistName}</p>
                    </div>
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100">
                      <Button variant="ghost" size="icon" onClick={e => { e.stopPropagation(); openEditModal(note); }}><Edit className="w-4 h-4" /></Button>
                      <Button variant="ghost" size="icon" onClick={e => { e.stopPropagation(); handleDeleteNote(note.id); }}><Trash2 className="w-4 h-4 text-red-400" /></Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-2 text-sm text-gray-400">
                    <Calendar className="w-4 h-4" />
                    <span>{formattedDate}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-400">
                    <MapPin className="w-4 h-4" />
                    <span>{note.eventVenueName}, {note.eventVenueCity}, {note.eventVenueCountry}</span> {/* Tampilkan Country */}
                  </div>
                  <div className="p-3 bg-gray-800/50 rounded-lg border border-gray-700">
                    <div className="flex items-center gap-2 mb-2">
                      <Music className="w-4 h-4 text-cyan-400" /><span className="text-sm font-medium text-cyan-400">{note.title}</span>
                    </div>
                    <p className="text-sm text-gray-300 line-clamp-4">{note.content}</p>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-16">
          <Music className="w-16 h-16 text-gray-600 mb-4 mx-auto" />
          <h3 className="text-xl font-semibold">{searchTerm ? "No matching notes found" : "No notes yet"}</h3>
        </div>
      )}

      {/* Modal */}
      <EventNoteModal
        isOpen={isModalOpen}
        onClose={closeModal}
        event={selectedNote ? {
          id: selectedNote.eventId,
          title: selectedNote.eventTitle,
          artist_name: selectedNote.eventArtistName,
          datetime: selectedNote.eventDatetime,
          venue: {
            name: selectedNote.eventVenueName,
            city: selectedNote.eventVenueCity,
            country: selectedNote.eventVenueCountry
          }
        } : null}
        existingNote={selectedNote}
        onSave={handleAddNote}
        onUpdate={handleUpdateNote}
        onDelete={handleDeleteNote}
      />
    </div>
  );
}

function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={`animate-pulse bg-gray-700 rounded-md ${className}`} {...props} />
}
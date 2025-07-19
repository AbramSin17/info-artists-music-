// components/event-note-modal.tsx
"use client"

import { useState, useEffect } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input" // Import Input
import { Label } from "@/components/ui/label" // Import Label
import { Textarea } from "@/components/ui/textarea"
import { Calendar, MapPin, Music, Loader2 } from "lucide-react" // Tambahkan Loader2 icon
import { format } from "date-fns" // Import format date-fns
import { id } from "date-fns/locale" // Import locale date-fns

// Interface Event (sama seperti di notes/page.tsx untuk EventForModal)
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
}

// Interface Note (sama seperti di notes/page.tsx, termasuk detail event)
interface Note {
  id: string
  eventId: string
  title: string // Judul catatan itu sendiri
  content: string
  createdAt: string
  updatedAt: string
  eventTitle: string // Judul event
  eventArtistName: string // Nama artis event
  eventDatetime: string // Waktu event
  eventVenueName: string // Nama venue
  eventVenueCity: string // Kota venue
  eventVenueCountry: string // Negara venue
}

interface EventNoteModalProps {
  isOpen: boolean
  onClose: () => void
  event: Event | null
  existingNote?: Note | null
  onSave: (eventId: string, title: string, content: string) => void
  onUpdate: (noteId: string, title: string, content: string) => void
  onDelete: (noteId: string) => void
}


export function EventNoteModal({
  isOpen,
  onClose,
  event,
  existingNote,
  onSave,
  onUpdate,
  onDelete,
}: EventNoteModalProps) {
  const [noteTitle, setNoteTitle] = useState("")
  const [noteContent, setNoteContent] = useState("")
  const [isSaving, setIsSaving] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false) // State untuk proses hapus

  useEffect(() => {
    // Reset state saat modal dibuka atau existingNote berubah
    if (isOpen) {
      setNoteTitle(existingNote?.title || event?.title || "") // Ambil judul dari existingNote atau event
      setNoteContent(existingNote?.content || "")
      setIsSaving(false)
      setIsDeleting(false)
    }
  }, [isOpen, existingNote, event])

  const handleSaveClick = async () => {
    if (!event || !noteTitle.trim() || !noteContent.trim()) {
      // Di sini bisa tambahkan toast atau feedback ke user (dari parent)
      console.error("Judul catatan, konten, atau event belum lengkap.");
      return;
    }
    setIsSaving(true);
    try {
      if (existingNote) {
        await onUpdate(existingNote.id, noteTitle, noteContent); // Panggil onUpdate jika mode edit
      } else {
        await onSave(event.id, noteTitle, noteContent); // Panggil onSave jika mode tambah baru
      }
      onClose(); // Tutup modal setelah berhasil
    } catch (error) {
      console.error("Error saving note in modal:", error);
      // Tampilkan toast error dari parent jika ada
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteClick = async () => {
    if (!existingNote) return;
    setIsDeleting(true);
    try {
      await onDelete(existingNote.id);
      onClose(); // Tutup modal setelah berhasil hapus
    } catch (error) {
      console.error("Error deleting note:", error);
      // Tampilkan toast error dari parent jika ada
    } finally {
      setIsDeleting(false);
    }
  };

  // Gunakan event atau data dari existingNote untuk display di modal
  const displayEvent = event || (existingNote ? {
    id: existingNote.eventId,
    title: existingNote.eventTitle,
    artist_name: existingNote.eventArtistName,
    datetime: existingNote.eventDatetime,
    venue: {
      name: existingNote.eventVenueName,
      city: existingNote.eventVenueCity,
      country: existingNote.eventVenueCountry,
    }
  } : null)

  if (!isOpen || !displayEvent) return null

  const eventDate = new Date(displayEvent.datetime); // Pastikan ini valid
  const isEventDateValid = !isNaN(eventDate.getTime()); // Cek apakah tanggal valid

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] bg-gray-900 text-white border-gray-700">
        <DialogHeader>
          <DialogTitle className="text-cyan-400">
            {existingNote ? "Edit Catatan Event" : "Tambah Catatan Event"}
          </DialogTitle>
          <DialogDescription className="text-gray-400">
            Untuk event: {displayEvent.title}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          {/* Detail Event di dalam Modal */}
          {isEventDateValid && (
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <Calendar className="w-4 h-4" />
              <span>{format(eventDate, "EEEE, dd MMMM yyyy HH:mm", { locale: id })} WIB</span>
            </div>
          )}
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <MapPin className="w-4 h-4" />
            <span>{displayEvent.venue.name}, {displayEvent.venue.city}, {displayEvent.venue.country}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <Music className="w-4 h-4" />
            <span>{displayEvent.artist_name}</span>
          </div>

          {/* Judul Catatan */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="note-title-modal" className="text-right text-gray-300">
              Judul Catatan
            </Label>
            <Input
              id="note-title-modal"
              value={noteTitle}
              onChange={(e) => setNoteTitle(e.target.value)}
              className="col-span-3 bg-gray-800 border-gray-600 text-white focus:border-cyan-400"
              placeholder="Judul catatan Anda..."
            />
          </div>

          {/* Konten Catatan */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="note-content-modal" className="text-right text-gray-300">
              Konten
            </Label>
            <Textarea
              id="note-content-modal"
              value={noteContent}
              onChange={(e) => setNoteContent(e.target.value)}
              className="col-span-3 bg-gray-800 border-gray-600 text-white focus:border-cyan-400 min-h-[100px]"
              placeholder="Tulis catatan Anda di sini..."
            />
          </div>
        </div>
        <DialogFooter>
          {existingNote && ( // Tombol hapus hanya muncul jika edit catatan yang sudah ada
            <Button
              variant="destructive"
              onClick={handleDeleteClick}
              className="mr-auto"
              disabled={isDeleting || isSaving}
            >
              {isDeleting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Menghapus...
                </>
              ) : (
                "Hapus Catatan"
              )}
            </Button>
          )}
          <Button
            onClick={onClose}
            variant="outline"
            className="border-gray-600 text-gray-300 hover:bg-gray-700/50"
            disabled={isSaving || isDeleting}
          >
            Batal
          </Button>
          <Button onClick={handleSaveClick} disabled={isSaving || isDeleting} className="bg-green-600 hover:bg-green-700">
            {isSaving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Menyimpan...
              </>
            ) : (
              existingNote ? "Simpan Perubahan" : "Simpan Catatan"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
// components/add-note-modal.tsx
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
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select" 
import { Loader2 } from "lucide-react" // Pastikan Loader2 diimport di sini

// Interface Note yang sama dengan di notes/page.tsx
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

// Interface EventForModal yang sama dengan di notes/page.tsx
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

interface AddNoteModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (eventId: string, title: string, content: string) => void // Untuk menyimpan catatan baru (dari notes/page.tsx)
  onUpdate: (noteId: string, title: string, content: string) => void // Untuk mengupdate catatan yang ada (dari notes/page.tsx)
  events: EventForModal[] // Daftar event yang bisa dipilih
  existingNote?: Note | null // Catatan yang sudah ada (jika dalam mode edit)
  loading?: boolean; // Loading state dari parent untuk daftar event
}

export function AddNoteModal({
  isOpen,
  onClose,
  onSave,
  onUpdate,
  events,
  existingNote,
  loading, // Menerima loading dari parent
}: AddNoteModalProps) {
  const [selectedEventId, setSelectedEventId] = useState<string>(existingNote?.eventId || "")
  const [noteTitle, setNoteTitle] = useState(existingNote?.title || "")
  const [noteContent, setNoteContent] = useState(existingNote?.content || "")
  const [isSaving, setIsSaving] = useState(false) // State internal untuk proses menyimpan

  useEffect(() => {
    // Reset state saat modal dibuka atau existingNote berubah
    if (isOpen) {
      setSelectedEventId(existingNote?.eventId || "")
      setNoteTitle(existingNote?.title || "")
      setNoteContent(existingNote?.content || "")
      setIsSaving(false)
    }
  }, [isOpen, existingNote])

  const handleSaveClick = async () => {
    if (!selectedEventId || !noteTitle.trim() || !noteContent.trim()) {
      // Di sini bisa tambahkan toast atau feedback ke user
      console.error("Judul, konten, atau event belum dipilih.");
      return;
    }
    setIsSaving(true);
    try {
      if (existingNote) {
        await onUpdate(existingNote.id, noteTitle, noteContent); // Panggil onUpdate jika mode edit
      } else {
        await onSave(selectedEventId, noteTitle, noteContent); // Panggil onSave jika mode tambah baru
      }
      onClose(); // Tutup modal setelah berhasil
    } catch (error) {
      console.error("Error saving note in modal:", error);
      // Tampilkan toast error dari parent jika ada
    } finally {
      setIsSaving(false);
    }
  };

  const currentEventTitle = events.find(e => e.id === selectedEventId)?.title || "Pilih event...";

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] bg-gray-900 text-white border-gray-700">
        <DialogHeader>
          <DialogTitle className="text-cyan-400">
            {existingNote ? "Edit Catatan" : "Tambah Catatan Baru"}
          </DialogTitle>
          <DialogDescription className="text-gray-400">
            {existingNote ? "Perbarui catatan Anda." : "Pilih event dan tambahkan catatan Anda."}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="event-select" className="text-right text-gray-300">
              Event
            </Label>
            <Select onValueChange={setSelectedEventId} value={selectedEventId} disabled={!!existingNote}> {/* Disable jika mode edit */}
              <SelectTrigger className="col-span-3 bg-gray-800 border-gray-600 text-white focus:border-cyan-400">
                <SelectValue placeholder={existingNote ? existingNote.eventTitle : "Pilih event..."} /> {/* Tampilkan judul event jika edit */}
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-600 text-white">
                {events.length === 0 && !loading ? (
                    <SelectItem value="no-events" disabled>Tidak ada event tersedia</SelectItem>
                ) : (
                    events.map((event) => (
                    <SelectItem key={event.id} value={event.id}>
                        {event.title} - {event.artist_name}
                    </SelectItem>
                    ))
                )}
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="note-title" className="text-right text-gray-300">
              Judul Catatan
            </Label>
            <Input
              id="note-title"
              value={noteTitle}
              onChange={(e) => setNoteTitle(e.target.value)}
              className="col-span-3 bg-gray-800 border-gray-600 text-white focus:border-cyan-400"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="note-content" className="text-right text-gray-300">
              Konten
            </Label>
            <Textarea
              id="note-content"
              value={noteContent}
              onChange={(e) => setNoteContent(e.target.value)}
              className="col-span-3 bg-gray-800 border-gray-600 text-white focus:border-cyan-400 min-h-[100px]"
              placeholder="Tulis catatan Anda di sini..."
            />
          </div>
        </div>
        <DialogFooter>
          <Button
            onClick={onClose}
            variant="outline"
            className="border-gray-600 text-gray-300 hover:bg-gray-700/50"
            disabled={isSaving}
          >
            Batal
          </Button>
          <Button onClick={handleSaveClick} disabled={isSaving} className="bg-green-600 hover:bg-green-700">
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
  )
}
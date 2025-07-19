"use client"

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { Calendar, MapPin, Music, Loader2 } from "lucide-react";

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

interface Event {
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

interface NoteDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  note: Note | null;
  event: Event | null;
  onUpdate: (noteId: string, title: string, content: string) => void;
  onDelete: (noteId: string) => void;
}

export function NoteDetailModal({
  isOpen,
  onClose,
  note,
  event,
  onUpdate,
  onDelete,
}: NoteDetailModalProps) {
  const [editMode, setEditMode] = useState(false);
  const [editedTitle, setEditedTitle] = useState(note?.title || "");
  const [editedContent, setEditedContent] = useState(note?.content || "");
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (isOpen && note) {
      setEditedTitle(note.title);
      setEditedContent(note.content);
      setEditMode(false);
    }
  }, [isOpen, note]);

  const handleSaveClick = async () => {
    if (!note || !editedContent.trim() || !editedTitle.trim()) return;
    setIsSaving(true);
    try {
      await onUpdate(note.id, editedTitle, editedContent);
      setEditMode(false);
    } catch (error) {
      console.error("Error updating note:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteClick = async () => {
    if (!note) return;
    setIsDeleting(true);
    try {
      await onDelete(note.id);
      onClose();
    } catch (error) {
      console.error("Error deleting note:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  if (!note || !event) return null;

  const eventDate = new Date(event.datetime);
  const noteDate = new Date(note.updatedAt);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] bg-gray-900 text-white border-gray-700">
        <DialogHeader>
          <DialogTitle className="text-cyan-400">
            {editMode ? "Edit Catatan" : "Detail Catatan"}
          </DialogTitle>
          <DialogDescription className="text-gray-400">
            Catatan untuk event: {event.title}
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <Calendar className="w-4 h-4" />
            <span>
              {format(eventDate, "EEEE, dd MMMM yyyy HH:mm", { locale: id })} WIB
            </span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <MapPin className="w-4 h-4" />
            <span>
              {event.venue.name}, {event.venue.city}, {event.venue.country}
            </span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <Music className="w-4 h-4" />
            <span>{event.artist_name}</span>
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="note-title-detail" className="text-right text-gray-300">
              Judul
            </Label>
            {editMode ? (
              <Input
                id="note-title-detail"
                value={editedTitle}
                onChange={(e) => setEditedTitle(e.target.value)}
                className="col-span-3 bg-gray-800 border-gray-600 text-white focus:border-cyan-400"
              />
            ) : (
              <span className="col-span-3 text-gray-300 font-semibold">{note.title}</span>
            )}
          </div>

          <div className="grid grid-cols-4 items-start gap-4">
            <Label htmlFor="note-content-detail" className="text-right text-gray-300">
              Konten
            </Label>
            {editMode ? (
              <Textarea
                id="note-content-detail"
                value={editedContent}
                onChange={(e) => setEditedContent(e.target.value)}
                className="col-span-3 bg-gray-800 border-gray-600 text-white focus:border-cyan-400 min-h-[100px]"
              />
            ) : (
              <span className="col-span-3 text-gray-300 whitespace-pre-wrap">
                {note.content}
              </span>
            )}
          </div>

          <p className="text-xs text-gray-500 col-span-full text-right">
            Terakhir diperbarui: {format(noteDate, "dd MMMM yyyy HH:mm", { locale: id })} WIB
          </p>
        </div>

        <DialogFooter>
          {editMode ? (
            <>
              <Button
                variant="outline"
                onClick={() => setEditMode(false)}
                className="border-gray-600 text-gray-300 hover:bg-gray-700/50"
                disabled={isSaving}
              >
                Batal
              </Button>
              <Button
                onClick={handleSaveClick}
                className="bg-green-600 hover:bg-green-700"
                disabled={isSaving}
              >
                {isSaving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Menyimpan...
                  </>
                ) : (
                  "Simpan Perubahan"
                )}
              </Button>
            </>
          ) : (
            <>
              <Button
                variant="destructive"
                onClick={handleDeleteClick}
                className="mr-auto"
                disabled={isDeleting}
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
              <Button
                onClick={() => setEditMode(true)}
                variant="outline"
                className="border-gray-600 text-gray-300 hover:bg-gray-700/50"
              >
                Edit
              </Button>
              <Button onClick={onClose} className="bg-cyan-600 hover:bg-cyan-700">
                Tutup
              </Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

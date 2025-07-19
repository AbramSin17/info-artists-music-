// app/page.tsx
"use client"

import { useState, useEffect, useCallback } from "react"
import { ArtistCard } from "@/components/artist-card"
import { Input } from "@/components/ui/input"
import { Search, Users, TrendingUp } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"
// Mengimport getArtistImageFromBandsintown
import { getMultipleArtistsDetails, searchArtistLastFm, getArtistImageFromBandsintown } from '@/lib/api';


type ArtistFromAPI = {
  [x: string]: string // Memungkinkan properti string tambahan
  idArtist: string;
  strArtist: string;
  strGenre: string;
  strArtistThumb: string; // Gambar dari Last.fm
}

interface DisplayArtist {
  id: string;
  name: string;
  genre: string;
  image: string; // URL gambar akhir
  isLiked: boolean;
}

// Daftar artis default yang akan dicari saat halaman dimuat tanpa searchTerm
const defaultArtistSearchList = [
  'Coldplay', 'Queen', 'Taylor Swift', 'The Weeknd', 'Billie Eilish',
  'Adele', 'Bruno Mars', 'Ariana Grande', 'Post Malone', 'Harry Styles',
  'Bad Bunny', 'Drake', 'BTS', 'Blackpink', 'Eminem', 'Rihanna',
  'Justin Bieber', 'Beyonce', 'Lady Gaga', 'Daft Punk', 'Linkin Park',
  'Metallica', 'Red Hot Chili Peppers', 'Foo Fighters', 'Green Day',
  'Imagine Dragons', 'Maroon 5', 'Twenty One Pilots'
];


// --- Fungsi Helper isLastFmKnownPlaceholder yang sama ---
const isLastFmKnownPlaceholder = (url: string): boolean => {
  if (!url) return false;
  return url.includes('2a96cbd8b46e442fc41c2b86b821562f.png') ||
         url.includes('default_avatar.png') ||
         url.includes('_avatar.png');
};
// --- Akhir Fungsi Helper ---


export default function HomePage() {
  const [artists, setArtists] = useState<DisplayArtist[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [likedArtistIds, setLikedArtistIds] = useState<string[]>([]);

  // Fungsi untuk menggabungkan data API dengan status like dari localStorage
  const mergeArtistData = useCallback(async (apiArtists: ArtistFromAPI[]) => {
    const artistsWithImages = await Promise.all(apiArtists.map(async apiArtist => {
      // Gunakan mbid jika ada, jika tidak, buat ID dari nama artis
      const id = apiArtist.mbid || apiArtist.strArtist.toLowerCase().replace(/\s/g, "-");
      
      // Coba ambil gambar dari Bandsintown terlebih dahulu
      const bandsintownImage = await getArtistImageFromBandsintown(apiArtist.strArtist);
      
      // Gambar dari Last.fm (sudah ada)
      const lastFmRawImage = apiArtist.strArtistThumb;
      const lastFmImageCleaned = (lastFmRawImage && !isLastFmKnownPlaceholder(lastFmRawImage)) ? lastFmRawImage : null;

      // Prioritaskan: Bandsintown -> Last.fm (jika bukan placeholder) -> Placeholder lokal
      const finalImage = bandsintownImage || lastFmImageCleaned || "/placeholder.svg?height=300&width=300";

      return {
        id: id,
        name: apiArtist.strArtist || 'Unknown Artist',
        genre: apiArtist.strGenre || 'Unknown Genre',
        image: finalImage,
        isLiked: likedArtistIds.includes(id), // Periksa status liked dari state likedArtistIds
      };
    }));
    return artistsWithImages;
  }, [likedArtistIds]); // Tambahkan likedArtistIds sebagai dependency

  // Effect untuk memuat liked artists dari localStorage saat komponen mount
  useEffect(() => {
    const savedLikes = localStorage.getItem("likedArtists");
    if (savedLikes) {
      setLikedArtistIds(JSON.parse(savedLikes));
    }
    // Panggil fetchDataArtists di sini juga untuk memastikan data awal dimuat dengan status like yang benar
    fetchDataArtists(searchTerm); 
  }, []); 

  // Effect untuk debounce pencarian
  useEffect(() => {
    const handler = setTimeout(() => {
      fetchDataArtists(searchTerm);
    }, 500); 
    return () => {
      clearTimeout(handler);
    };
  }, [searchTerm]); // Hanya jalankan saat searchTerm berubah

  const fetchDataArtists = async (query: string) => {
    setLoading(true);
    let fetchedApiArtists: DisplayArtist[] = [];

    try {
      if (query.trim() === "") {
        // Jika query kosong, ambil daftar artis default yang lebih banyak
        const lastFmResults = await getMultipleArtistsDetails(defaultArtistSearchList);
        
        // Pastikan setiap artis memiliki ID yang konsisten (MBID atau slug dari nama)
        fetchedApiArtists = await mergeArtistData(lastFmResults.map((artist: any) => ({
          idArtist: artist.mbid || artist.name.toLowerCase().replace(/\s/g, "-"), // Gunakan MBID atau buat ID dari nama
          strArtist: artist.name,
          strGenre: artist.tags?.tag?.[0]?.name || "Unknown Genre",
          strArtistThumb: artist.image?.find((img: any) => img.size === "extralarge")?.["#text"] || "/placeholder.svg?height=300&width=300",
        })));
      } else {
        const lastFmResults = await searchArtistLastFm(query);
        fetchedApiArtists = await mergeArtistData(lastFmResults.map((artist: any) => ({
          idArtist: artist.mbid || artist.name.toLowerCase().replace(/\s/g, "-"), // Gunakan MBID atau buat ID dari nama
          strArtist: artist.name,
          strGenre: "Unknown Genre", // Last.fm search tidak selalu memberikan genre
          strArtistThumb: artist.image?.find((img: any) => img.size === "extralarge")?.["#text"] || "/placeholder.svg?height=300&width=300",
        })));
      }

      // HANYA gunakan fetchedApiArtists. Jika kosong, itu akan memicu pesan "Tidak ada artis yang cocok ditemukan"
      setArtists(fetchedApiArtists); 

    } catch (error) {
      console.error("Error fetching artists:", error);
      // Jika ada error, set artists menjadi array kosong agar menampilkan pesan "Tidak ada artis..."
      setArtists([]); 
    } finally {
      setLoading(false);
    }
  };


  const handleToggleLike = (artistId: string) => {
    setLikedArtistIds(prevLikedIds => {
      const isCurrentlyLiked = prevLikedIds.includes(artistId);
      const newLikedIds = isCurrentlyLiked
        ? prevLikedIds.filter(id => id !== artistId)
        : [...prevLikedIds, artistId];

      localStorage.setItem("likedArtists", JSON.stringify(newLikedIds));
      
      // Perbarui status isLiked pada artis yang ada di state 'artists'
      setArtists(currentArtists => 
        currentArtists.map(artist =>
          artist.id === artistId ? { ...artist, isLiked: !isCurrentlyLiked } : artist
        )
      );
      return newLikedIds;
    });
  };


  const likedCount = likedArtistIds.length;

  if (loading) {
    return <ArtistsPageSkeleton />;
  }

  return (
    <div className="p-6 space-y-8">
      {/* Header */}
      <div className="flex flex-col lg:flex-row gap-6 items-start lg:items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
            Discover Artists
          </h1>
          <p className="text-gray-400 text-lg">Jelajahi dan pelajari tentang artis musik favorit Anda</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Cari artis atau genre..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-full sm:w-80 bg-gray-800/50 border-gray-700 focus:border-cyan-400"
            />
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="flex items-center gap-8 text-sm text-gray-400">
        <div className="flex items-center gap-2">
          <Users className="w-4 h-4 text-cyan-400" />
          <span>{artists.length} Artis Ditemukan</span>
        </div>
        <div className="flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-purple-400" />
          <span>{likedCount} Disukai</span>
        </div>
      </div>

      {/* Artists Grid */}
      {artists.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
          {artists.map((artist) => (
            <ArtistCard key={artist.id} artist={artist} onToggleLike={handleToggleLike} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <Users className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2">{searchTerm ? "Tidak ada artis yang cocok ditemukan" : "Mulai pencarian untuk menemukan artis"}</h3>
          <p className="text-gray-400">Coba sesuaikan istilah pencarian Anda</p>
        </div>
      )}
    </div>
  );
}

function ArtistsPageSkeleton() {
  return (
    <div className="p-6 space-y-8">
      <div className="flex flex-col lg:flex-row gap-6 items-start lg:items-center justify-between">
        <div>
          <Skeleton className="h-10 w-80 mb-2" />
          <Skeleton className="h-6 w-96" />
        </div>
        <Skeleton className="h-10 w-80" />
      </div>

      <div className="flex items-center gap-8">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-4 w-20" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
        {Array.from({ length: 10 }).map((_, i) => (
          <div key={i} className="bg-gray-800/30 border border-gray-700 rounded-lg p-4">
            <Skeleton className="w-full h-48 mb-4" />
            <Skeleton className="h-6 w-3/4 mb-2" />
            <Skeleton className="h-4 w-1/2" />
          </div>
        ))}
      </div>
    </div>
  )
}

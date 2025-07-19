ArtistHub - Platform Penemuan Artis Musik
Deskripsi Proyek
ArtistHub adalah platform penemuan artis musik yang memungkinkan pengguna untuk menjelajahi berbagai artis, melihat detail profil mereka, menemukan konser dan acara mendatang, membuat catatan pribadi tentang acara, dan menyimpan daftar artis favorit mereka. Aplikasi ini dirancang untuk memberikan pengalaman yang responsif dan intuitif bagi para pecinta musik.

API yang Digunakan
Aplikasi ini mengintegrasikan data dari beberapa API eksternal untuk menyediakan informasi artis dan acara yang komprehensif:

- Last.fm API: Digunakan untuk mengambil detail artis (biografi, genre, gambar), album teratas, dan lagu teratas.

- Bandsintown API: Digunakan untuk mengambil informasi acara dan konser artis, serta gambar artis tambahan.

Fitur-Fitur Utama
- Penemuan Artis: Jelajahi daftar artis populer dan cari artis berdasarkan nama atau genre.

- Detail Artis: Lihat profil lengkap artis, termasuk biografi, genre, album, dan lagu teratas. Lagu-lagu teratas dapat diakses melalui tautan eksternal ke Last.fm untuk mendengarkan.

- Artis yang Disukai: Simpan artis favorit Anda ke dalam daftar "Disukai" untuk akses mudah. Status "disukai" akan tetap tersimpan bahkan setelah me-refresh halaman atau berpindah halaman.

- Acara & Konser: Temukan daftar acara dan konser mendatang dari berbagai artis.

- Catatan Acara: Buat catatan pribadi untuk setiap acara atau konser yang Anda temukan, memungkinkan Anda menyimpan kenangan dan pemikiran.

- Desain Responsif: Antarmuka pengguna yang dioptimalkan untuk berbagai ukuran layar (desktop, tablet, mobile).

- Pencarian Interaktif: Fungsi pencarian real-time untuk artis dan acara.

Struktur Halaman dan Routing
Aplikasi ini memiliki struktur halaman berbasis Next.js App Router:

1. / (Halaman Utama / Discover Artists): Menampilkan daftar artis yang dapat dijelajahi dan dicari.

2. /artist/[id] (Detail Artis): Menampilkan informasi mendetail tentang artis tertentu berdasarkan ID-nya.

3. /events (Acara & Konser): Menampilkan daftar acara musik yang akan datang.

4. /notes (Catatan Saya): Menampilkan semua catatan pribadi yang dibuat pengguna untuk acara.

5. /likes (Artis yang Disukai): Menampilkan daftar artis yang telah ditandai sebagai favorit oleh pengguna.

6. /song/[id] (Detail Lagu): Menampilkan informasi detail tentang lagu tertentu (saat ini dengan data mock).

Cara Menjalankan Secara Lokal
Untuk menjalankan proyek ini di lingkungan pengembangan lokal Anda, ikuti langkah-langkah berikut:

Prasyarat:

Pastikan Anda telah menginstal Node.js (versi LTS direkomendasikan) dan npm atau yarn.

Kloning Repositori (Jika di GitHub):

git clone <URL_REPOSITORI_ANDA>
cd ArtistHub

(Catatan: Karena ini adalah proyek Canvas, Anda akan memiliki akses langsung ke kode di lingkungan pengembangan.)

Instal Dependensi:

npm install
# atau
yarn install

Konfigurasi API Keys (Jika Diperlukan):

Dalam lingkungan Canvas, API key untuk Last.fm dan Bandsintown biasanya sudah dikelola secara otomatis. Namun, jika Anda menjalankan di luar Canvas atau API key diperlukan, Anda mungkin perlu menyiapkan variabel lingkungan (misalnya, di file .env.local) untuk API key yang relevan.

Jalankan Server Pengembangan:

npm run dev
# atau
yarn dev

Akses Aplikasi:
Buka browser Anda dan navigasikan ke http://localhost:3000.

Link Live Demo Aplikasi
Saat ini, proyek ini dikembangkan dalam lingkungan interaktif. Jika aplikasi ini di-deploy ke hosting publik, tautan demo langsung akan disediakan di sini.

Live Demo: [Belum Tersedia - Akan Ditambahkan Setelah Deployment]
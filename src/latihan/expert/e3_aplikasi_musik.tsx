// ========================================
// LATIHAN EXPERT 3 — APLIKASI MUSIK
// ========================================
// Level: Expert
// Konsep: specialization class — extends dengan type argument tetap (materi 9)
// Program: daftar media generik yang dikhususkan jadi pustaka lagu —
//          T induk generik, T anak dikunci Song.

// ========================================
// SOAL
// ========================================
// Aplikasi musik butuh daftar putar.
// 1. Buat class generic 'MediaList<T>' dengan protected items, add(item),
//    dan count().
// 2. Buat class 'SongLibrary extends MediaList<Song>' — subclass TIDAK
//    generic, type argument induk DIKUNCI Song — tambahkan method
//    totalSeconds() dan titles().
// 3. Uji: tambah dua lagu, cetak titles, totalSeconds, dan count —
//    method warisan tetap jalan, add hanya menerima Song.

// ========================================
// JAWABAN
// ========================================

// ------------------------------------------------------------------
// (1) INDUK GENERIK — MediaList<T> tidak tahu apa isinya: bisa lagu,
//     podcast, video. Ia hanya tahu cara menyimpan dan menghitung.
//     (Jika di Dart: class MediaList<T> { final List<T> _items = [];
//       void add(T item) { _items.add(item); } ... } — bentuk sama)
// ------------------------------------------------------------------
interface Song {
  title: string;
  artist: string;
  seconds: number;
}

class MediaList<T> {
  protected items: T[] = [];

  add(item: T): void {
    this.items.push(item);
  }

  count(): number {
    return this.items.length;
  }
}

// ------------------------------------------------------------------
// (2) SPECIALIZATION — SongLibrary TIDAK punya type parameter sendiri:
//     ia mengunci MediaList<Song>. Konsekuensinya, di DALAM class ini
//     this.items sudah pasti Song[] — s.seconds aman diakses tanpa
//     constraint apa pun. T terkunci juga ke luar: add menerima HANYA
//     Song — add({ title: "x" }) tanpa artist/seconds langsung error
//     compile.
//     (Jika di Dart: class SongLibrary extends MediaList<Song> —
//       specialization identik persis di Dart, recall StringCollection
//       di materi 9)
// ------------------------------------------------------------------
class SongLibrary extends MediaList<Song> {
  totalSeconds(): number {
    return this.items.reduce((acc, s) => acc + s.seconds, 0);
  }

  titles(): string[] {
    return this.items.map((s) => s.title);
  }
}

// ------------------------------------------------------------------
// (3) UJI — method spesifik (titles, totalSeconds) dan method warisan
//     (count) hidup berdampingan di objek yang sama.
// ------------------------------------------------------------------
const favorites = new SongLibrary();
favorites.add({ title: "Balonku", artist: "Anonim", seconds: 120 });
favorites.add({ title: "Cicak", artist: "Anonim", seconds: 95 });
console.log(favorites.titles()); // [ 'Balonku', 'Cicak' ]
console.log(favorites.totalSeconds()); // 215
console.log(favorites.count()); // 2  (method warisan tetap jalan)

// ========================================
// RANGKUMAN
// ========================================
// - Specialization: extends MediaList<Song> mengunci T — subclass
//  tidak generic, semua kemampuan induk diwarisi dengan T sudah pasti.
// - Di dalam subclass, this.items = Song[] — method spesifik bebas
//   mengakses field Song tanpa constraint tambahan.
// - Ini jalan tengah: generiknya di induk (satu MediaList untuk semua
//   media), spesifiknya di anak (SongLibrary khusus lagu).
//   (Jika di Dart: pola yang sama lazim — class UserRepository extends
//     Repository<User> — satu induk generik dipakai ulang untuk banyak
//     anak spesifik di aplikasi Flutter)

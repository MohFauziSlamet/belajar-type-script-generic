// ========================================
// LATIHAN ADVANCE 1 — PENCARIAN FILM
// ========================================
// Level: Advance
// Konsep: generic interface bentuk data (materi 7)
// Program: layanan pencarian film yang menyimpan hasil bertipe apa pun
//          beserta method untuk menampilkan ringkasannya.

// ========================================
// SOAL
// ========================================
// Aplikasi streaming ingin menampilkan hasil pencarian film.
// 1. Buat interface generic 'SearchResult<T>' dengan properti query (string),
//    items (T[]), total (number), dan method firstMatch() serta describe().
// 2. Buat tipe 'Movie' lalu implementasikan SearchResult<Movie> lewat
//    OBJECT LITERAL — perhatikan method TIDAK perlu anotasi parameter.
// 3. Cetak describe(), firstMatch(), dan daftar judul dari items.

// ========================================
// JAWABAN
// ========================================

// ------------------------------------------------------------------
// (1) INTERFACE GENERIC BENTUK DATA — properti + method sekaligus dalam
//     satu kontrak. T di posisi properti (items) DAN return method.
//     (Jika di Dart: abstract class SearchResult<T> { List<T> items;
//       String query; int total; T? firstMatch(); String describe(); }
//       — Dart klasik memakai abstract class sebagai kontrak;
//       Dart 3 juga punya modifier interface class)
// ------------------------------------------------------------------
interface SearchResult<T> {
  query: string;
  items: T[];
  total: number;
  firstMatch(): T | undefined;
  describe(): string;
}

// ------------------------------------------------------------------
// (2) TIPE DATA + OBJECT LITERAL — TS tidak butuh class untuk
//     mengimplementasikan interface: object literal cukup.
//     Perhatikan: firstMatch() dan describe() ditulis TANPA anotasi
//     parameter/return — ter-infer dari interface (recall materi 7).
// ------------------------------------------------------------------
interface Movie {
  title: string;
  year: number;
  rating: number;
}

const result: SearchResult<Movie> = {
  query: "nolan",
  items: [
    { title: "Interstellar", year: 2014, rating: 9 },
    { title: "Inception", year: 2010, rating: 9 },
  ],
  total: 2,
  firstMatch() {
    return this.items[0];
  },
  describe() {
    return `pencarian "${this.query}": ${this.total} judul ditemukan`;
  },
};

// ------------------------------------------------------------------
// (3) PEMAKAIAN — describe() mengembalikan string ringkas, firstMatch()
//     mengembalikan T (Movie) utuh — bukan any, bukan perlu cast.
// ------------------------------------------------------------------
console.log(result.describe()); // pencarian "nolan": 2 judul ditemukan
console.log(result.firstMatch()); // { title: 'Interstellar', year: 2014, rating: 9 }
console.log(result.items.map((m) => m.title)); // [ 'Interstellar', 'Inception' ]

// ========================================
// RANGKUMAN
// ========================================
// - Generic interface = kontrak BENTUK: properti + method sekaligus, sekali
//   definisi dipakai untuk semua T (SearchResult<Movie>, SearchResult<Series>, ...).
// - Object literal langsung mengimplementasikan interface — tanpa class,
//   tanpa boilerplate (beda dari Dart yang butuh class/abstract class).
// - Method object literal (firstMatch, describe) ter-infer dari interface —
//   anotasi manual tidak diperlukan.
//   (Jika di Dart: Dart tidak punya object literal — kontrak seperti ini baru
//     bisa diisi lewat class, dan method override di class Dart wajib anotasi
//     eksplisit. Di TypeScript, inference dari interface hanya milik object
//     literal; method dalam class TS pun tetap wajib anotasi)
// - T tetap utuh sampai pemanggil: firstMatch() = Movie, bukan any.

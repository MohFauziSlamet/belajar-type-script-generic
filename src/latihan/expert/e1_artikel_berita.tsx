// ========================================
// LATIHAN EXPERT 1 — ARTIKEL BERITA
// ========================================
// Level: Expert
// Konsep: interface extends interface generic + specialization interface (materi 9)
// Program: sistem konten berita — artikel punya data + jejak audit +
//          info publikasi, plus pengumuman singkat yang datanya string.

// ========================================
// SOAL
// ========================================
// CMS berita butuh struktur konten bertingkat.
// 1. Buat interface generic 'Auditable<T>' berisi data (T) dan updatedAt.
// 2. Buat interface 'Published<T> extends Auditable<T>' yang menambah author
//    dan publishedAt — T dioper turun tanpa menyalin ulang kontrak induk.
// 3. Buat interface 'Announcement extends Published<string>' (specialization:
//    T dikunci string) dengan priority union literal "tinggi" | "rendah".

// ========================================
// JAWABAN
// ========================================

// ------------------------------------------------------------------
// (1) KONTRAK DASAR — Auditable<T> hanya tahu "ada data bertipe T dan
//     jejak waktu". Ia tidak peduli T-nya apa.
//     (Jika di Dart: abstract class Auditable<T> { final T data;
//       final String updatedAt; } — kontrak dasar serupa)
// ------------------------------------------------------------------
interface Auditable<T> {
  data: T;
  updatedAt: string;
}

// ------------------------------------------------------------------
// (2) PEWARISAN GENERIC — Published<T> mewarisi data + updatedAt,
//     menambah author + publishedAt. T DIOPER turun: saat T = Article,
//     induk otomatis ikut jadi Auditable<Article> juga.
// ------------------------------------------------------------------
interface Article {
  title: string;
  body: string;
}

interface Published<T> extends Auditable<T> {
  author: string;
  publishedAt: string;
}

const news: Published<Article> = {
  data: { title: "TS 5.9 Rilis", body: "Generic makin mantap." },
  author: "Siti",
  updatedAt: "2026-09-09",
  publishedAt: "2026-09-08",
};
console.log(news);
// {
//   data: { title: 'TS 5.9 Rilis', body: 'Generic makin mantap.' },
//   author: 'Siti',
//   updatedAt: '2026-09-09',
//   publishedAt: '2026-09-08'
// }
console.log(news.data.title); // TS 5.9 Rilis

// ------------------------------------------------------------------
// (3) SPECIALIZATION DI LEVEL INTERFACE — Announcement MENGUNCI T
//     menjadi string: semua kontrak induk tetap berlaku, tapi data
//     pasti string. Union literal "tinggi" | "rendah" mempersempit
//     nilai valid tepat dua pilihan (recall union literal materi 4).
// ------------------------------------------------------------------
interface Announcement extends Published<string> {
  priority: "tinggi" | "rendah";
}

const notice: Announcement = {
  data: "Server maintenance jam 02:00",
  author: "Ops",
  updatedAt: "2026-09-09",
  publishedAt: "2026-09-09",
  priority: "tinggi",
};
console.log(notice.priority); // tinggi
console.log(notice.data.toUpperCase()); // SERVER MAINTENANCE JAM 02:00  (data = string terkunci)

// ========================================
// RANGKUMAN
// ========================================
// - Interface generic mewarisi interface generic: Published<T> extends
//   Auditable<T> — kontrak induk dioper turun, anak hanya menambah.
// - Specialization interface (Announcement extends Published<string>)
//   mengunci T: data pasti string — toUpperCase() aman tanpa cast.
// - Union literal "tinggi" | "rendah" = nilai valid tepat dua kata —
//   salah ketik langsung error compile.
//   (Jika di Dart: enum Priority { tinggi, rendah } adalah cara Dart
//     membentuk kumpulan nilai tetap — union literal TS mencapai hal
//     sama tanpa deklarasi terpisah; pewarisan abstract class generic
//     Published<T> extends Auditable<T> juga identik di Dart)

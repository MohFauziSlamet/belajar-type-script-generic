// ========================================
// LATIHAN MIDDLE 2 — KATALOG BUKU (KEYOF)
// ========================================
// Level: Middle
// Konsep: constraint keyof + indexed access T[K] (materi 5)
// Program: membaca field buku apa pun secara type-safe dari nama field.

// ========================================
// SOAL
// ========================================
// Aplikasi perpustakaan ingin menampilkan field buku berdasarkan nama field
// yang dipilih saat runtime (misalnya dari menu pengguna).
// 1. Buat interface Book dengan code: string, title: string, pages: number.
// 2. Buat function generic getField<T, K extends keyof T>(item: T, field: K): T[K]
//    yang mengembalikan nilai field yang diminta — type-safe, tanpa any.
// 3. Buat function generic describeField<T, K extends keyof T>(item: T, field: K): string
//    yang mengembalikan teks "namaField = nilai".
// 4. Buktikan T[K] terjaga: cetak typeof hasil getField untuk field number & string.

// ========================================
// JAWABAN
// ========================================

// ------------------------------------------------------------------
// (1) INTERFACE BOOK — bentuk data katalog.
// ------------------------------------------------------------------
interface Book {
  code: string;
  title: string;
  pages: number;
}

// ------------------------------------------------------------------
// (2) GETFIELD — K dibatasi keyof T: hanya nama field yang ADA di Book.
//     Tipe hasil T[K] otomatis mengikuti field yang dipilih.
//     (Jika di Dart: item[field] TIDAK BISA untuk objek biasa — hanya Map.
//      Cara Dart: Map<String, dynamic> + cast manual — type safety hilang.
//      keyof menghadirkan akses via string TANPA kehilangan tipe.)
// ------------------------------------------------------------------
function getField<T, K extends keyof T>(item: T, field: K): T[K] {
  return item[field];
}

const book: Book = { code: "BK-01", title: "Belajar TS", pages: 210 };

console.log(getField(book, "title")); // Belajar TS
console.log(typeof getField(book, "pages")); // number  (T[K] = number, terjaga!)

// ------------------------------------------------------------------
// (3) DESCRIBEFIELD — pola sama, hasil dirangkai jadi string.
//     Salah ketik field (misal "page") langsung error compile.
// ------------------------------------------------------------------
function describeField<T, K extends keyof T>(item: T, field: K): string {
  return `${String(field)} = ${item[field]}`;
}

console.log(describeField(book, "pages")); // pages = 210

// ========================================
// RANGKUMAN
// ========================================
// - K extends keyof T = "K harus salah satu nama field milik T".
// - T[K] (indexed access) menyesuaikan tipe per field: pages → number, title → string.
// - Salah ketik nama field = error SEBELUM program jalan, bukan undefined diam-diam.
//   (Jika di Dart: dynamic map["pages"] salah ketik → null saat runtime, tak terdeteksi)
// - Satu fungsi generic menggantikan banyak getter per field.

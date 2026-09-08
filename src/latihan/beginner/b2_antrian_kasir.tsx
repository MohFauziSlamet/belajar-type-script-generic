// ========================================
// LATIHAN BEGINNER 2 — ANTRIAN KASIR
// ========================================
// Level: Beginner
// Konsep: generic function dengan array T[] dan hasil T | undefined (materi 2)
// Program: melihat pelanggan pertama & terakhir dari antrian kasir.

// ========================================
// SOAL
// ========================================
// Kasir ingin tahu siapa yang dilayani pertama dan terakhir.
// 1. Buat function generic firstInLine<T>(queue: T[]): T | undefined
//    yang mengembalikan elemen PERTAMA antrian.
// 2. Buat function generic lastInLine<T>(queue: T[]): T | undefined
//    yang mengembalikan elemen TERAKHIR antrian.
// 3. Uji dengan antrian nama (string), antrian nomor (number),
//    dan antrian kosong (harus aman: undefined).

// ========================================
// JAWABAN
// ========================================

// ------------------------------------------------------------------
// (1) ELEMEN PERTAMA — kenapa T | undefined? Array kosong tidak punya
//     elemen ke-0, jadi hasilnya bisa undefined.
//     (Jika di Dart: queue.first MELEMPAR error saat kosong —
//     versi TS kita mengembalikan undefined, lebih aman tanpa try-catch)
// ------------------------------------------------------------------
function firstInLine<T>(queue: T[]): T | undefined {
  return queue[0];
}

// ------------------------------------------------------------------
// (2) ELEMEN TERAKHIR — pola sama, index paling belakang.
// ------------------------------------------------------------------
function lastInLine<T>(queue: T[]): T | undefined {
  return queue[queue.length - 1];
}

// ------------------------------------------------------------------
// (3) UJI TIGA KEADAAN — string, number, dan array kosong.
//     Satu pasangan fungsi bekerja untuk SEMUA tipe antrian.
// ------------------------------------------------------------------
const namaAntrian = ["Siti", "Budi", "Ani"];
const nomorAntrian = [101, 102, 103];

console.log(firstInLine(namaAntrian)); // Siti  (inference T = string)
console.log(lastInLine(namaAntrian)); // Ani
console.log(firstInLine(nomorAntrian)); // 101  (inference T = number)
console.log(firstInLine([])); // undefined  (kosong: aman, tidak error)

// ========================================
// RANGKUMAN
// ========================================
// - T[] berarti "array bertipe T apa pun" — nama atau nomor sama-sama jalan.
// - T | undefined = pola wajib untuk akses elemen: array kosong mungkin terjadi.
//   (Jika di Dart: list.first kosong → StateError; TS memaksa kita sadar undefined)
// - Inference mengunci T dari isi array: string[] → T = string.
// - Tanpa generic, harus tulis dua fungsi (string[] dan number[]) — duplikasi.

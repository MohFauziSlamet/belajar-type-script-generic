// ========================================
// LATIHAN BEGINNER 4 — KOORDINAT PETA
// ========================================
// Level: Beginner
// Konsep: tuple [T, U] sebagai return type + menukar posisi (materi 3)
// Program: merepresentasikan titik koordinat peta dengan dua tipe berbeda.

// ========================================
// SOAL
// ========================================
// Aplikasi peta menyimpan titik sebagai pasangan (sumbu, area).
// 1. Buat function generic makeCoord<T, U>(x: T, y: U): [T, U]
//    yang membungkus dua nilai menjadi tuple.
// 2. Buat function generic mirrorCoord<T, U>(coord: [T, U]): [U, T]
//    yang menukar posisi elemen tuple lalu mengembalikannya.
// 3. Uji dengan (number, string) dan (string, number), lalu cetak
//    elemen tuple per posisi (coord[0], coord[1]).

// ========================================
// JAWABAN
// ========================================

// ------------------------------------------------------------------
// (1) MEMBUAT TUPLE — [T, U] artinya array panjang TETAP 2 dengan tipe
//     per posisi berbeda. Tidak perlu bikin class Pair khusus.
//     (Jika di Dart 3: record (T, U) — makeCoord(3, 'garis-A');
//      sebelum Dart 3 harus bikin class Pair manual)
// ------------------------------------------------------------------
function makeCoord<T, U>(x: T, y: U): [T, U] {
  return [x, y];
}

// ------------------------------------------------------------------
// (2) MENUKAR POSISI — urutan type parameter return IKUT bertukar:
//     masuk [T, U], keluar [U, T].
// ------------------------------------------------------------------
function mirrorCoord<T, U>(coord: [T, U]): [U, T] {
  return [coord[1], coord[0]];
}

// ------------------------------------------------------------------
// (3) UJI — akses tuple via index [0] / [1] (record Dart 3 pakai $1 / $2).
// ------------------------------------------------------------------
const titik = makeCoord(3, "garis-A"); // T = number, U = string
console.log(titik); // [ 3, 'garis-A' ]
console.log(titik[0], titik[1]); // 3 garis-A
console.log(mirrorCoord(titik)); // [ 'garis-A', 3 ]  (posisi bertukar)
console.log(mirrorCoord(["selatan", 120])); // [ 120, 'selatan' ]

// ========================================
// RANGKUMAN
// ========================================
// - Tuple [T, U]: panjang tetap, tipe tiap posisi bisa berbeda.
// - mirrorCoord menukar BUKAN hanya nilai, tapi juga urutan tipe: [U, T].
// - Akses via index: coord[0], coord[1].
//   (Jika di Dart 3: record (T, U) dengan akses via $1/$2 —
//    paralel coord[0]/coord[1] di TypeScript)
// - Tuple = cara ringan mengembalikan dua nilai beda tipe tanpa class/objek.

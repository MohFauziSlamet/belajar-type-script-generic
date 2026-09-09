// ========================================
// LATIHAN ADVANCE 5 — DAFTAR ISTILAH
// ========================================
// Level: Advance
// Konsep: interface dua type parameter + class implements (materi 7 + 8)
// Program: kamus istilah dan daftar menu yang sama-sama memakai satu
//          class dictionary berbasis array pasangan [kunci, nilai].

// ========================================
// SOAL
// ========================================
// Aplikasi belajar butuh kamus istilah; aplikasi kasir butuh daftar menu.
// Keduanya pola yang sama: simpan pasangan kunci → nilai, cari by kunci.
// 1. Buat interface generic 'Dictionary<K, V>' dengan method add,
//    lookup, dan entries (mengembalikan array TUPLE [K, V]).
// 2. Buat class 'ArrayDictionary<K, V>' yang implements kontrak itu
//    dengan internal array of tuple.
// 3. Pakai SATU class untuk DUA kebutuhan beda: kamus istilah
//    (string → string) dan kode menu (number → string).

// ========================================
// JAWABAN
// ========================================

// ------------------------------------------------------------------
// (1) KONTRAK DUA TYPE PARAMETER — K untuk kunci, V untuk nilai.
//     entries() mengembalikan [K, V][] — TUPLE: array tetap dua posisi
//     dengan tipe per posisi (recall materi 3).
//     (Jika di Dart: abstract class Dictionary<K, V> { void add(K, V);
//       V? lookup(K); List<(K, V)> entries(); } — record Dart 3 (K, V)
//       berperan seperti tuple [K, V] TypeScript)
// ------------------------------------------------------------------
interface Dictionary<K, V> {
  add(key: K, value: V): void;
  lookup(key: K): V | undefined;
  entries(): [K, V][];
}

// ------------------------------------------------------------------
// (2) CLASS IMPLEMENTS — internal berupa Array<[K, V]>. lookup memakai
//     find + destructuring [k] lalu ?. — hasil undefined saat kunci
//     tidak ada (null-safety ala TS).
// ------------------------------------------------------------------
class ArrayDictionary<K, V> implements Dictionary<K, V> {
  private pairs: Array<[K, V]> = [];

  add(key: K, value: V): void {
    this.pairs.push([key, value]);
  }

  lookup(key: K): V | undefined {
    return this.pairs.find(([k]) => k === key)?.[1];
  }

  entries(): [K, V][] {
    return this.pairs;
  }
}

// ------------------------------------------------------------------
// (3) SATU CLASS, DUA KEBUTUHAN — instantiasi pertama string → string
//     (kamus), kedua number → string (kode menu). Tidak ada kode
//     duplikat: ArrayDictionary ditulis SEKALI.
// ------------------------------------------------------------------
const istilah = new ArrayDictionary<string, string>();
istilah.add("generic", "tipe parameter yang diisi belakangan");
istilah.add("inference", "compiler menebak tipe otomatis");
console.log(istilah.lookup("generic")); // tipe parameter yang diisi belakangan
console.log(istilah.lookup("closure")); // undefined  (kunci tidak ada)
console.log(istilah.entries()[0]); // [ 'generic', 'tipe parameter yang diisi belakangan' ]

const harga = new ArrayDictionary<number, string>();
harga.add(101, "Kopi Susu");
harga.add(102, "Teh Tarik");
console.log(harga.lookup(102)); // Teh Tarik

// ========================================
// RANGKUMAN
// ========================================
// - Interface dua type parameter (Dictionary<K, V>) + class implements =
//   kontrak dan implementasi terpisah — gabungan materi 7 dan 8.
// - Tuple [K, V] menjaga pasangan tetap dua posisi bertipe — berbeda dari
//   array biasa yang homogen.
// - lookup mengembalikan V | undefined: kunci hilang = undefined, bukan
//   error — konsisten dengan pola Map.get TS.
//   (Jika di Dart: Map<K, V> bawaan sudah menyelesaikan masalah ini —
//     map[key] mengembalikan null saat kunci tidak ada; versi array manual di
//     latihan ini untuk melatih tuple + kontrak generic sendiri)

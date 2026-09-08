// ========================================
// LATIHAN BEGINNER 5 — KONVERSI UKURAN
// ========================================
// Level: Beginner
// Konsep: dua type parameter + callback converter (materi 3)
// Program: mengubah nilai dari satu bentuk ke bentuk lain dengan fungsi konversi.

// ========================================
// SOAL
// ========================================
// Aplikasi toko perlu mengubah nilai dari satu bentuk ke bentuk lain.
// 1. Buat function generic convertValue<T, U>(value: T, converter: (v: T) => U): U
//    yang menerapkan converter pada value.
// 2. Uji dengan: angka → label string ("150 cm"), string → number (Number),
//    desimal → number bulat (Math.round), dan string → uppercase.
// 3. Perhatikan U di-infer dari RETURN callback, bukan dari value.

// ========================================
// JAWABAN
// ========================================

// ------------------------------------------------------------------
// (1) CONVERTER CALLBACK — T ditentukan value, U ditentukan HASIL
//     callback. Fungsinya jadi "jembatan" dua tipe.
//     (Jika di Dart: U convert<T, U>(T value, U Function(T) converter)
//       => converter(value); — bentuknya sama)
// ------------------------------------------------------------------
function convertValue<T, U>(value: T, converter: (v: T) => U): U {
  return converter(value);
}

// ------------------------------------------------------------------
// (2) EMPAT KONVERSI — tiap pemanggilan mengunci T dan U sendiri.
// ------------------------------------------------------------------
console.log(convertValue(150, (n) => `${n} cm`)); // 150 cm  (T = number, U = string)
console.log(convertValue("42", Number)); // 42  (T = string, U = number — Number bawaan)
console.log(convertValue(42, String)); // 42  (T = number, U = string — String bawaan)
console.log(convertValue(2.5, (n) => Math.round(n * 100))); // 250  (U = number)
console.log(convertValue("aktif", (s) => s.toUpperCase())); // AKTIF  (T = string, U = string)

// ========================================
// RANGKUMAN
// ========================================
// - Callback (v: T) => U = resep konversi; T dari argumen, U dari return callback.
// - Number dan String bisa dipakai langsung sebagai converter bawaan.
//   (Jika di Dart: int.parse / double.parse sebagai converter — versi TS: Number)
// - Satu fungsi generik menggantikan banyak fungsi konversi per kombinasi tipe.
// - U di-infer dari isi callback — tidak perlu ditulis eksplisit.

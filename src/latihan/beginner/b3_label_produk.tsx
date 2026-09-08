// ========================================
// LATIHAN BEGINNER 3 — LABEL HARGA PRODUK
// ========================================
// Level: Beginner
// Konsep: multiple type parameters <K, V> (materi 3)
// Program: mencetak label harga produk dari kombinasi tipe yang berbeda.

// ========================================
// SOAL
// ========================================
// Gudang ingin mencetak label harga dengan format "PROD-<kode>: Rp<harga>".
// 1. Buat function generic priceLabel<K, V>(code: K, price: V): string
//    yang menggabungkan kode dan harga menjadi satu label.
// 2. Uji dengan tiga kombinasi: (string, number), (number, number),
//    dan (boolean, number).
// 3. Pastikan satu fungsi cukup untuk semua kombinasi — tanpa overload.

// ========================================
// JAWABAN
// ========================================

// ------------------------------------------------------------------
// (1) DUA TYPE PARAMETER — K untuk kode, V untuk harga. Keduanya hanya
//     dipakai untuk di-string-kan via template literal, jadi bebas tipe apa pun.
//     (Jika di Dart: String priceLabel<K, V>(K code, V price) =>
//       'PROD-$code: Rp$price'; — pola dua type parameter sama)
// ------------------------------------------------------------------
function priceLabel<K, V>(code: K, price: V): string {
  return `PROD-${code}: Rp${price}`;
}

// ------------------------------------------------------------------
// (2) TIGA KOMBINASI — TypeScript meng-infer K dan V SECARA TERPISAH
//     dari posisi argumen masing-masing.
// ------------------------------------------------------------------
console.log(priceLabel("KB-7", 15000)); // PROD-KB-7: Rp15000  (K = string, V = number)
console.log(priceLabel(42, 2500)); // PROD-42: Rp2500  (K = number, V = number)
console.log(priceLabel(true, 99000)); // PROD-true: Rp99000  (K = boolean, V = number)

// ========================================
// RANGKUMAN
// ========================================
// - <K, V> dibaca per posisi: argumen pertama menentukan K, kedua menentukan V.
// - Inference bekerja independen untuk tiap type parameter.
// - Template literal `${...}` menerima tipe apa pun — cocok digabung generic.
//   (Jika di Dart: 'Rp$price' cukup; di TS wajib kurung kurawal ${price})
// - Tanpa generic: tiga overload (string/number/boolean × number) — satu fungsi <K, V> cukup.

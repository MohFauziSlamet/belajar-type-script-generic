// ========================================
// LATIHAN MIDDLE 4 — DISKON MEMBER (CONSTRAINT BENTUK)
// ========================================
// Level: Middle
// Konsep: constraint <T extends Bentuk> berupa interface (materi 4)
// Program: menghitung harga final dengan promo diskon apa pun bentuknya.

// ========================================
// SOAL
// ========================================
// Toko punya beragam bentuk promo — yang pasti dimiliki semua promo:
// percent (persentase diskon).
// 1. Buat interface Discountable dengan properti percent: number.
// 2. Buat function generic finalPrice<T extends Discountable>(price: number, promo: T): number
//    yang menghitung harga setelah diskon persen.
// 3. Uji dengan TIGA bentuk promo berbeda: {percent, code}, {percent} saja,
//    dan {percent, note} — semuanya lolos karena punya percent.

// ========================================
// JAWABAN
// ========================================

// ------------------------------------------------------------------
// (1) INTERFACE DISCOUNTABLE — kontrak minimal: "punya percent".
//     Tidak peduli field lain apa pun yang menyertainya.
//     (Jika di Dart: abstract class Discountable { int get percent; }
//      lalu finalPrice<T extends Discountable>(...) — konsep sama,
//      tapi TS cukup bentuk (structural), Dart butuh pewarisan eksplisit)
// ------------------------------------------------------------------
interface Discountable {
  percent: number;
}

// ------------------------------------------------------------------
// (2) FINALPRICE — constraint memungkinkan promo.percent aman diakses.
// ------------------------------------------------------------------
function finalPrice<T extends Discountable>(price: number, promo: T): number {
  return price - (price * promo.percent) / 100;
}

// ------------------------------------------------------------------
// (3) TIGA BENTUK PROMO — semua punya percent → semua lolos constraint.
//     Field tambahan (code, note) tidak mengganggu — itulah kekuatan
//     structural typing: yang dinilai BENTUKNYA, bukan asal usulnya.
// ------------------------------------------------------------------
console.log(finalPrice(200000, { percent: 20, code: "HEMAT" })); // 160000
console.log(finalPrice(50000, { percent: 5 })); // 47500
console.log(finalPrice(150000, { percent: 0, note: "tanpa diskon" })); // 150000

// ========================================
// RANGKUMAN
// ========================================
// - <T extends Discountable> = "asal punya percent, tipe apa pun boleh".
// - Structural typing: object literal langsung lolos tanpa implements.
//   (Jika di Dart: class Promo implements Discountable harus eksplisit —
//    TS cukup bentuk cocok, seperti duck typing yang diperiksa compiler)
// - Hasil tetap number (bukan T) — sesuai kebutuhan soal: output harga final.
// - Satu fungsi menangani semua bentuk promo masa depan, tanpa overload.

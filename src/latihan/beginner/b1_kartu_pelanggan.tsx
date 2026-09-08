// ========================================
// LATIHAN BEGINNER 1 — KARTU PELANGGAN TOKO
// ========================================
// Level: Beginner
// Konsep: generic function dasar & type inference (materi 1, 2)
// Program: mencetak kartu identitas pelanggan dengan tipe data apa pun.

// ========================================
// SOAL
// ========================================
// Sebuah toko ingin mencetak kartu pelanggan dari berbagai jenis data.
// 1. Buat function generic idCard<T>(value: T): T yang mengembalikan nilai
//    yang diterima apa adanya (fungsi identitas).
// 2. Cetak kartu untuk: kode string ("BUDI-001"), nomor member (77),
//    dan status aktif (true) — campur cara eksplisit dan inference.
// 3. Buktikan tipe tetap terjaga dengan typeof pada hasil pemanggilan.

// ========================================
// JAWABAN
// ========================================

// ------------------------------------------------------------------
// (1) FUNCTION IDENTITAS — <T> adalah type variable: "tipe ditentukan
//     saat dipanggil". Nilai masuk T, keluar tetap T — info tipe TIDAK
//     hilang (beda dengan any).
//     (Jika di Dart: T idCard<T>(T value) => value; — bentuknya sama persis)
// ------------------------------------------------------------------
function idCard<T>(value: T): T {
  return value;
}

console.log(idCard<string>("BUDI-001")); // BUDI-001  (eksplisit: T = string)
console.log(idCard(77)); // 77  (inference: T = number)
console.log(typeof idCard(77)); // number  (bukti tipe terjaga, bukan any)
console.log(idCard(true)); // true  (inference: T = boolean)

// ------------------------------------------------------------------
// (2) INFERENCE PADA VARIABEL — hasil pemanggilan generic bisa disimpan
//     ke variabel; TypeScript tahu tipenya TANPA anotasi manual.
// ------------------------------------------------------------------
const fromInference = idCard("member-gold"); // T di-infer string
console.log(fromInference, typeof fromInference); // member-gold string

// ========================================
// RANGKUMAN
// ========================================
// - <T> menangkap tipe saat DIPANGGIL: idCard<string>, atau di-infer dari argumen.
//   (Jika di Dart: T idCard<T>(T value) → di TS: idCard<T>(value: T): T)
// - Inference bekerja otomatis dari argumen — eksplisit hanya saat perlu.
// - typeof membuktikan hasil tetap number/string/boolean — tidak jatuh ke any.
// - Satu fungsi untuk semua tipe = tidak perlu duplikasi per tipe (masalah materi 1).

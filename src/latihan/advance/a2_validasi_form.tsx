// ========================================
// LATIHAN ADVANCE 2 — VALIDASI FORM PENDAFTARAN
// ========================================
// Level: Advance
// Konsep: call signature interface (materi 7)
// Program: memvalidasi input form pendaftaran dengan aturan bertipe —
//          email, usia, dan kumpulan aturan lain dalam satu pola.

// ========================================
// SOAL
// ========================================
// Form pendaftaran akun perlu validasi per input.
// 1. Buat interface generic 'Validator<T>' berupa CALL SIGNATURE yang
//    menerima nilai T dan mengembalikan string | null
//    (null = valid, string = pesan error).
// 2. Buat dua validator: isEmail untuk string dan isAdult untuk number.
// 3. Buat function generic 'runValidation' yang menjalankan SATU nilai
//    terhadap banyak validator sekaligus, lalu mengumpulkan pesan error.

// ========================================
// JAWABAN
// ========================================

// ------------------------------------------------------------------
// (1) CALL SIGNATURE — interface yang mendeskripsikan BENTUK FUNGSI:
//     tanda kurung + daftar parameter + return type, tanpa nama method.
//     (Jika di Dart: typedef Validator<T> = String? Function(T value);
//       — typedef adalah cara Dart mendeskripsikan bentuk fungsi,
//       call signature adalah caranya TypeScript)
// ------------------------------------------------------------------
interface Validator<T> {
  (value: T): string | null;
}

// ------------------------------------------------------------------
// (2) DUA VALIDATOR — Validator<string> dan Validator<number> dua
//     instantiasi dari SATU kontrak. Parameter arrow function (v) dan
//     (age) tidak perlu anotasi — ter-infer dari Validator<T>.
// ------------------------------------------------------------------
const isEmail: Validator<string> = (v) => (v.includes("@") ? null : "email tidak valid");
const isAdult: Validator<number> = (age) => (age >= 17 ? null : "minimal 17 tahun");

// ------------------------------------------------------------------
// (3) MENJALANKAN BANYAK VALIDATOR — generic function biasa (recall
//     materi 2) yang menerima array of Validator<T>. Semua validator
//     dalam array WAJIB bertipe sama dengan nilai yang dicek — itulah
//     jaminan tipenya: runValidation(15, [isEmail]) langsung error compile.
// ------------------------------------------------------------------
function runValidation<T>(value: T, checks: Validator<T>[]): string[] {
  const errors: string[] = [];
  for (const check of checks) {
    const msg = check(value);
    if (msg !== null) {
      errors.push(msg);
    }
  }
  return errors;
}

console.log(runValidation("budi@mail.com", [isEmail])); // []
console.log(runValidation("budi", [isEmail])); // [ 'email tidak valid' ]
console.log(runValidation(15, [isAdult])); // [ 'minimal 17 tahun' ]

// ========================================
// RANGKUMAN
// ========================================
// - Call signature (value: T): string | null = kontrak bentuk fungsi —
//   return null berarti lolos, return string berarti pesan error.
// - Satu kontrak Validator<T> dipakai untuk tipe input berbeda
//   (string email, number usia) tanpa duplikasi definisi.
// - Array Validator<T> memaksa SEMUA aturan cocok dengan tipe nilai yang
//   divalidasi — salah kombinasi ketahuan saat compile, bukan runtime.
//   (Jika di Dart: List<Validator<String>> checks — daftar aturan dengan
//     typedef bertipe sama; kombinasi Validator<int> vs String juga
//     ditolak compiler Dart)
